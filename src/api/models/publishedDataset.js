import { ObjectId } from 'mongodb';
import chunk from 'lodash/chunk';
import omit from 'lodash/omit';

import { getFullResourceUri } from '../../common/uris';
import getPublishedDatasetFilter from './getPublishedDatasetFilter';
import { VALIDATED, PROPOSED } from '../../common/propositionStatus';
import { getCreatedCollection } from './utils';
import { createDiacriticSafeContainRegex } from '../services/createDiacriticSafeContainRegex';

const getMeta = (match, searchableFieldNames) => {
    if (!match || !searchableFieldNames || !searchableFieldNames.length) {
        return null;
    }

    return {
        score: { $meta: 'textScore' },
    };
};

const getSort = (sortBy, sortDir, match, searchableFieldNames) => {
    if (sortBy) {
        return {
            [sortBy === 'uri' ? sortBy : `versions.${sortBy}`]:
                sortDir === 'ASC' ? 1 : -1,
        };
    }

    if (match && searchableFieldNames && searchableFieldNames.length) {
        return {
            score: {
                $meta: 'textScore',
            },
        };
    }
    return { uri: 1 };
};

export default async (db) => {
    const collection = await getCreatedCollection(db, 'publishedDataset');

    await collection.createIndex({ uri: 1 }, { unique: true });

    collection.insertBatch = (documents) =>
        Promise.all(
            chunk(documents, 1000).map((data) =>
                collection.insertMany(data, {
                    forceServerObjectId: true,
                    w: 1,
                }),
            ),
        );

    collection.insertBatchIgnoreDuplicate = (documents) =>
        Promise.all(
            chunk(documents, 1000).map((data) =>
                collection.insertMany(data, { ordered: false }).catch((e) => {
                    if (e.code === 11000 /* duplicate error */) {
                        return;
                    }

                    throw e;
                }),
            ),
        );

    collection.getFindCursor = ({ filter, meta, sort }) => {
        const cursor = meta
            ? collection.find(filter, meta)
            : collection.find(filter);
        if (sort) {
            return cursor.sort(sort);
        }
        return cursor;
    };

    collection.findLimitFromSkip = async ({
        limit,
        skip,
        filter,
        meta,
        sort,
    }) => {
        const cursor = collection.getFindCursor({
            filter,
            meta,
            sort,
        });

        return {
            total: await cursor.count(),
            data: await cursor.skip(skip).limit(limit).toArray(),
        };
    };

    collection.findPage = async ({
        page = 0,
        perPage = 10,
        sortBy,
        sortDir,
        match,
        facets,
        invertedFacets,
        searchableFieldNames,
        facetFieldNames,
        filters,
        excludeSubresources = false,
    }) => {
        const filter = getPublishedDatasetFilter({
            match,
            searchableFieldNames,
            facets,
            facetFieldNames,
            invertedFacets,
            filters,
            excludeSubresources,
        });

        const meta = getMeta(match, searchableFieldNames);

        const sort = getSort(sortBy, sortDir, match, searchableFieldNames);

        // add _id to sort to avoid random results
        sort._id = sortDir === 'ASC' ? 1 : -1;

        const results = await collection.findLimitFromSkip({
            limit: perPage,
            skip: page * perPage,
            filter,
            meta,
            sort,
        });

        if (results.data.length > 0) {
            return results;
        }

        const regexFilters = getPublishedDatasetFilter({
            match,
            searchableFieldNames,
            facets,
            facetFieldNames,
            filters,
            regexSearch: true,
            excludeSubresources,
        });

        return await collection.findLimitFromSkip({
            limit: perPage,
            skip: page * perPage,
            filter: regexFilters,
            sort: getSort(sortBy, sortDir),
        });
    };

    collection.findRemovedPage = (page = 0, perPage = 10) =>
        collection.findLimitFromSkip({
            limit: perPage,
            skip: page * perPage,
            filter: {
                removedAt: { $exists: true },
            },
        });

    collection.findContributedPage = (page, perPage, status) =>
        collection.findLimitFromSkip({
            limit: perPage,
            skip: page * perPage,
            filter: {
                removedAt: { $exists: false },
                'contributions.status': status,
            },
        });

    collection.getFindAllStream = (
        uri,
        match,
        searchableFieldNames,
        facets,
        facetFieldNames,
        invertedFacets,
        sortBy,
        sortDir,
    ) => {
        const filter = getPublishedDatasetFilter({
            uri,
            match,
            searchableFieldNames,
            facets,
            facetFieldNames,
            invertedFacets,
        });
        const sort = getSort(sortBy, sortDir, match, searchableFieldNames);
        const cursor = collection.getFindCursor({ filter, sort });

        return cursor
            .map((resource) =>
                resource.uri.startsWith('http')
                    ? resource
                    : {
                          ...resource,
                          uri: getFullResourceUri(resource),
                      },
            )
            .stream();
    };

    collection.findById = async (id) => {
        const oid = new ObjectId(id);
        return collection.findOne({ _id: oid });
    };

    collection.findByUri = (uri) => collection.findOne({ uri });

    collection.findManyByUris = (uris) =>
        collection.find({ uri: { $in: uris } }).toArray();

    collection.addVersion = async (
        resource,
        newVersion,
        publicationDate = new Date(),
    ) =>
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
            { returnDocument: 'after' },
        );

    collection.hide = async (uri, reason, date = new Date()) => {
        await collection.updateOne(
            { uri },
            {
                $set: {
                    removedAt: date,
                    reason,
                },
            },
        );

        return { reason, removedAt: date };
    };

    collection.restore = async (uri) =>
        collection.updateOne(
            { uri },
            { $unset: { removedAt: true, reason: true } },
        );

    collection.addFieldToResource = async (
        uri,
        contributor,
        field,
        isLoggedIn,
        publicationDate = new Date(),
    ) => {
        const previousResource = await collection.findByUri(uri);

        const newVersion = {
            ...previousResource.versions[previousResource.versions.length - 1],
            [field.name]: field.value,
            publicationDate,
        };

        return collection.updateOne(
            { uri },
            {
                $addToSet: {
                    contributions: {
                        fieldName: field.name,
                        contributor,
                        status: isLoggedIn ? VALIDATED : PROPOSED,
                    },
                },
                $inc: isLoggedIn
                    ? {
                          [`contributionCount.${VALIDATED}`]: 1,
                      }
                    : {
                          [`contributionCount.${PROPOSED}`]: 1,
                      },
                $push: {
                    versions: {
                        ...newVersion,
                        publicationDate,
                    },
                },
            },
        );
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

        await collection.updateOne(
            {
                uri,
                'contributions.fieldName': name,
            },
            {
                $set: {
                    'contributions.$.status': status,
                },
                $inc: {
                    [`contributionCount.${status}`]: 1,
                    [`contributionCount.${previousStatus}`]: -1,
                },
            },
        );

        return {
            result: 'resource contribution updated',
        };
    };

    collection.findDistinctValuesForField = (field) =>
        collection.distinct(`versions.${field}`);

    collection.getFacetsForField = (field) =>
        collection.aggregate([
            {
                $project: {
                    value: { $arrayElemAt: [`$versions.${field}`, -1] },
                },
            },
            { $unwind: '$value' },
            { $group: { _id: '$value', count: { $sum: 1 } } },
            { $project: { _id: 0, value: '$_id', count: 1, field } },
        ]);

    collection.countByFacet = async (field, value) =>
        field === 'uri'
            ? collection.count({
                  uri: value,
              })
            : collection
                  .aggregate([
                      {
                          $project: {
                              value: {
                                  $arrayElemAt: [`$versions.${field}`, -1],
                              },
                          },
                      },
                      { $match: { value } },
                      { $count: 'value' },
                  ])
                  .toArray()
                  .then((result) => (result[0] ? result[0].value : 0));

    collection.countAll = async ({ excludeSubresources = false } = {}) => {
        const filter = {
            removedAt: { $exists: false },
        };

        if (excludeSubresources) {
            filter.subresourceId = null;
        }

        return collection.count(filter);
    };

    collection.create = async (resource, publicationDate = new Date()) => {
        const { uri, ...version } = resource;

        return collection.insertOne({
            uri,
            versions: [
                {
                    ...version,
                    publicationDate,
                },
            ],
        });
    };

    collection.createTextIndexes = async (fields) => {
        if (!fields.length) {
            return;
        }

        const textIndex = fields.reduce(
            (acc, name) => ({
                ...acc,
                [`versions.${name}`]: 'text',
            }),
            {},
        );

        try {
            await collection.createIndex(textIndex, {
                name: 'match_index',
            });
        } catch (error) {
            await collection.dropIndex('match_index');
            await collection.createIndex(textIndex, {
                name: 'match_index',
            });
        }
    };

    collection.findUrisByTitle = async ({ titleField, value }) => {
        const resources = await collection
            .find(
                {
                    versions: {
                        $elemMatch: {
                            [titleField.name]:
                                createDiacriticSafeContainRegex(value),
                        },
                    },
                },
                {
                    uri: true,
                },
            )
            .toArray();

        return resources.map(({ uri }) => uri);
    };

    return collection;
};
