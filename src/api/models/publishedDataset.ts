import { ObjectId } from 'mongodb';
import chunk from 'lodash/chunk';
import omit from 'lodash/omit';

import { getFullResourceUri } from '../../common/uris';
import getPublishedDatasetFilter from './getPublishedDatasetFilter';
import { VALIDATED, PROPOSED } from '../../common/propositionStatus';
import { getCreatedCollection } from './utils';
import { createDiacriticSafeContainRegex } from '../services/createDiacriticSafeContainRegex';

const getMeta = (match: any, searchableFieldNames: any) => {
    if (!match || !searchableFieldNames || !searchableFieldNames.length) {
        return null;
    }

    return {
        score: { $meta: 'textScore' },
    };
};

const getSort = (
    sortBy: any,
    sortDir: any,
    match: any,
    searchableFieldNames: any,
) => {
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

export default async (db: any) => {
    const collection = await getCreatedCollection(db, 'publishedDataset');

    await collection.createIndex({ uri: 1 }, { unique: true });

    collection.insertBatch = (documents: any) =>
        Promise.all(
            chunk(documents, 1000).map((data: any) =>
                collection.insertMany(data, {
                    forceServerObjectId: true,
                    w: 1,
                }),
            ),
        );

    collection.insertBatchIgnoreDuplicate = (documents: any) =>
        Promise.all(
            chunk(documents, 1000).map((data: any) =>
                collection
                    .insertMany(data, { ordered: false })
                    .catch((e: any) => {
                        if (e.code === 11000 /* duplicate error */) {
                            return;
                        }

                        throw e;
                    }),
            ),
        );

    collection.getFindCursor = ({ filter, meta, sort }: any) => {
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
    }: any) => {
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
    }: any) => {
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
        // @ts-expect-error TS(2339): Property '_id' does not exist on type '{ [x: numbe... Remove this comment to see the full error message
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
            // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
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

    collection.findContributedPage = (page: any, perPage: any, status: any) =>
        collection.findLimitFromSkip({
            limit: perPage,
            skip: page * perPage,
            filter: {
                removedAt: { $exists: false },
                'contributions.status': status,
            },
        });

    collection.getFindAllStream = (
        uri: any,
        match: any,
        searchableFieldNames: any,
        facets: any,
        facetFieldNames: any,
        invertedFacets: any,
        sortBy: any,
        sortDir: any,
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
            .map((resource: any) =>
                resource.uri.startsWith('http')
                    ? resource
                    : {
                          ...resource,
                          uri: getFullResourceUri(resource),
                      },
            )
            .stream();
    };

    collection.findById = async (id: any) => {
        const oid = new ObjectId(id);
        return collection.findOne({ _id: oid });
    };

    collection.findByUri = (uri: any) => collection.findOne({ uri });

    collection.findManyByUris = (uris: any) =>
        collection.find({ uri: { $in: uris } }).toArray();

    collection.addVersion = async (
        resource: any,
        newVersion: any,
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

    collection.hide = async (uri: any, reason: any, date = new Date()) => {
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

    collection.restore = async (uri: any) =>
        collection.updateOne(
            { uri },
            { $unset: { removedAt: true, reason: true } },
        );

    collection.addFieldToResource = async (
        uri: any,
        contributor: any,
        field: any,
        isLoggedIn: any,
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

    collection.getFieldStatus = async (uri: any, name: any) => {
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

    collection.changePropositionStatus = async (
        uri: any,
        name: any,
        status: any,
    ) => {
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

    collection.findDistinctValuesForField = (field: any) =>
        collection.distinct(`versions.${field}`);

    collection.getFacetsForField = (field: any) =>
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

    collection.countByFacet = async (field: any, value: any) =>
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
                  .then((result: any) => (result[0] ? result[0].value : 0));

    collection.countAll = async ({ excludeSubresources = false } = {}) => {
        const filter = {
            removedAt: { $exists: false },
        };

        if (excludeSubresources) {
            // @ts-expect-error TS(2339): Property 'subresourceId' does not exist on type '{... Remove this comment to see the full error message
            filter.subresourceId = null;
        }

        return collection.count(filter);
    };

    collection.create = async (resource: any, publicationDate = new Date()) => {
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

    collection.createTextIndexes = async (fields: any) => {
        if (!fields.length) {
            return;
        }

        const textIndex = fields.reduce(
            // @ts-expect-error TS(7006): Parameter 'acc' implicitly has an 'any' type.
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

    collection.findUrisByTitle = async ({ titleField, value }: any) => {
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

        return resources.map(({ uri }: any) => uri);
    };

    return collection;
};
