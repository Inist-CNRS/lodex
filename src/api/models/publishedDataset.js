import { ObjectID } from 'mongodb';
import chunk from 'lodash.chunk';
import omit from 'lodash.omit';
import compose from 'lodash.compose';
import config from 'config';
import { getFullResourceUri } from '../../common/uris';

import { VALIDATED, PROPOSED } from '../../common/propositionStatus';

export const addMatchToFilters = (match, searchableFieldNames) => (filters) => {
    if (!match || !searchableFieldNames || !searchableFieldNames.length) {
        return filters;
    }
    const regexMatch = new RegExp(match);

    return {
        ...filters,
        $or: searchableFieldNames.map(name => ({
            [`versions.${name}`]: { $regex: regexMatch, $options: 'i' },
        })),
    };
};

export const addFacetToFilters = (facets, facetFieldNames) => (filters) => {
    if (!facets || !Object.keys(facets).length || !facetFieldNames || !facetFieldNames.length) {
        return filters;
    }
    return {
        ...filters,
        $and: facetFieldNames.reduce((acc, name) => {
            if (!facets[name]) return acc;

            return [
                ...acc,
                { [`versions.${name}`]: facets[name] },
            ];
        }, []),
    };
};

export const addKeyToFilters = (key, value) => (filters) => {
    if (!value) {
        return filters;
    }

    return {
        ...filters,
        [key]: value,
    };
};

export default async (db) => {
    const collection = db.collection('publishedDataset');

    await collection.createIndex({ uri: 1 }, { unique: true });

    collection.insertBatch = documents =>
        Promise.all(chunk(documents, 1000).map(data => collection.insertMany(data, {
            forceServerObjectId: true,
            w: 1,
        })));

    collection.getFindCursor = (filter, sortBy, sortDir = 'ASC') => {
        let cursor = collection.find(filter);
        if (sortBy) {
            cursor = cursor.sort({
                [sortBy === 'uri' ? sortBy : `versions.${sortBy}`]: sortDir === 'ASC' ? 1 : -1,
            });
        }
        return cursor;
    };

    collection.findLimitFromSkip = async (limit, skip, filter, sortBy, sortDir = 'ASC') => {
        const cursor = collection.getFindCursor(filter, sortBy, sortDir);

        return {
            data: await cursor.skip(skip).limit(limit).toArray(),
            total: await cursor.count(),
        };
    };

    collection.findPage = async (
        page = 0,
        perPage = 10,
        sortBy,
        sortDir,
        match,
        facets,
        searchableFieldNames,
        facetFieldNames,
    ) => {
        const filters = compose(
            addMatchToFilters(match, searchableFieldNames),
            addFacetToFilters(facets, facetFieldNames),
        )({ removedAt: { $exists: false } });

        return collection.findLimitFromSkip(perPage, page * perPage, filters, sortBy, sortDir);
    };

    collection.findRemovedPage = (page = 0, perPage = 10) =>
        collection.findLimitFromSkip(perPage, page * perPage, { removedAt: { $exists: true } });

    collection.findContributedPage = (page, perPage, status) =>
        collection.findLimitFromSkip(perPage, page * perPage, {
            removedAt: { $exists: false },
            'contributions.status': status,
        });

    collection.getFindAllStream = (uri, match, searchableFieldNames, facets, facetFieldNames, sortBy, sortDir) => {
        const filters = compose(
            addKeyToFilters('uri', uri),
            addMatchToFilters(match, searchableFieldNames),
            addFacetToFilters(facets, facetFieldNames),
        )({ removedAt: { $exists: false } });
        const cursor = collection.getFindCursor(filters, sortBy, sortDir);

        return cursor
            .map(resource => (
                resource.uri.startsWith('http') ? resource : ({
                    ...resource,
                    uri: getFullResourceUri(resource, config.host),
                })
            ))
            .stream();
    };

    collection.findById = async (id) => {
        const oid = new ObjectID(id);
        return collection.findOne({ _id: oid });
    };

    collection.findByUri = uri => collection.findOne({ uri });

    collection.addVersion = async (resource, newVersion, publicationDate = new Date()) =>
        collection.findOneAndUpdate(
            { uri: resource.uri },
            {
                $push: {
                    versions: {
                        ...omit(newVersion, ['uri', '_id']),
                        publicationDate,
                    },
                },
            },
            {
                returnOriginal: false,
            },
        );

    collection.hide = async (uri, reason, date = new Date()) =>
        collection.update({ uri }, { $set: {
            removedAt: date,
            reason,
        } });

    collection.restore = async uri =>
        collection.update({ uri }, { $unset: { removedAt: true, reason: true } });

    collection.addFieldToResource = async (uri, contributor, field, isLoggedIn, publicationDate = new Date()) => {
        const previousResource = await collection.findByUri(uri);

        const newVersion = {
            ...previousResource.versions[previousResource.versions.length - 1],
            [field.name]: field.value,
            publicationDate,
        };

        return collection.update({ uri }, {
            $addToSet: {
                contributions: {
                    fieldName: field.name,
                    contributor,
                    status: isLoggedIn ? VALIDATED : PROPOSED,
                },
            },
            $inc: isLoggedIn ? {
                [`contributionCount.${VALIDATED}`]: 1,
            } : {
                [`contributionCount.${PROPOSED}`]: 1,
            },
            $push: {
                versions: {
                    ...newVersion,
                    publicationDate,
                },
            },
        });
    };

    collection.getFieldStatus = async (uri, name) => {
        const results = await collection.aggregate([
            { $match: { uri } },
            { $unwind: '$contributions' },
            { $match: { 'contributions.fieldName': name } },
            { $project: { _id: 0, status: '$contributions.status' } },
        ]);

        const [result] = await results.toArray();


        if (!result) {
            return null;
        }

        return result.status;
    };

    collection.changePropositionStatus = async (uri, name, status) => {
        const previousStatus = await collection.getFieldStatus(uri, name);
        if (!previousStatus || previousStatus === status) {
            return { result: 'noChange' };
        }

        await collection.update({
            uri,
            'contributions.fieldName': name,
        }, {
            $set: {
                'contributions.$.status': status,
            },
            $inc: {
                [`contributionCount.${status}`]: 1,
                [`contributionCount.${previousStatus}`]: -1,
            },
        });

        return {
            result: 'resource contribution updated',
        };
    };

    collection.findDistinctValuesForField = field => collection.distinct(`versions.${field}`);

    collection.countByFacet = (field, value) =>
        collection.count({ [field === 'uri' ? 'uri' : `versions.${field}`]: value });

    collection.create = async (resource, publicationDate = new Date()) => {
        const { uri, ...version } = resource;
        return collection.insertOne({
            uri,
            versions: [{
                ...version,
                publicationDate,
            }],
        });
    };

    return collection;
};
