import mongoDatabase from './mongoDatabase.js';
import getPublishedDatasetFilter from './getPublishedDatasetFilter.js';

const findAll = async (collection: any) => collection.find({}).sort({ position: 1, cover: 1 }).toArray();

const findSearchableNames = async (collection: any) => {
    const searchableFields = await collection
        .find({ searchable: true })
        .toArray();

    return searchableFields.map(({
        name
    }: any) => name);
};

const findFacetNames = async (collection: any) => {
    const searchableFields = await collection.find({ isFacet: true }).toArray();

    return searchableFields.map(({
        name
    }: any) => name);
};

/**
 * Take `Object` containing a URL query and throw a Context Object
 * compatible with runQuery or reduceQuery
 *
 * @name LodexBuildContext
 * @param {String}  [connectionStringURI="mongodb://ezmaster_db:27017"]  to connect to MongoDB
 * @param {String}  [host] to set host (usefull to build some links)
 * @returns {Object}
 */
export const createFunction = () =>
    ((async function LodexBuildContext(this: any, data: any, feed: any) {
        if (this.isLast()) {
            return feed.close();
        }

        const precomputedName = this.getParam('precomputedName');

        const connectionStringURI = this.getParam(
            'connectionStringURI',
            'mongodb://ezmaster_db:27017',
        );

        const tenant = this.getParam('tenant', 'default');

        const db = await mongoDatabase(connectionStringURI);
        const collection = db.collection('field');

        const host = this.getParam('host');
        const {
            uri,
            maxSize,
            skip,
            maxValue,
            minValue,
            match,
            orderBy = '_id/asc',
            invertedFacets = [],
            $query,
            field,
            ...facets
        } = data;
        const searchableFieldNames = await findSearchableNames(collection);
        const facetFieldNames = await findFacetNames(collection);
        const fields = await findAll(collection);
        const filter = getPublishedDatasetFilter({
            uri,
            match,
            invertedFacets,
            facets,
            ...$query,
            searchableFieldNames,
            facetFieldNames,
        });

        if (filter.$and && !filter.$and.length) {
            delete filter.$and;
        }
        let precomputedId;
        if (precomputedName) {
            const db = await mongoDatabase(connectionStringURI);
            const { _id } = await db.collection('precomputed').findOne({
                name: precomputedName,
            });
            precomputedId = _id;
        }

        // context is the input for LodexReduceQuery & LodexRunQuery & LodexDocuments
        const context = {
            // /*
            // to build the MongoDB Query
            filter,
            field,
            fields,
            // Default parameters for ALL scripts
            maxSize,
            maxValue,
            minValue,
            orderBy,
            skip,
            uri,
            host,
            // to allow script to connect to MongoDB
            connectionStringURI,
            tenant,
            precomputedName,
            precomputedId,
        };
        feed.send(context);
    }));

export default {
    buildContext: createFunction(),
};
