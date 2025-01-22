import { getCreatedCollection } from './utils';

export default async (db) => {
    const annotationCollection = await getCreatedCollection(db, 'annotation');

    async function create(annotationPayload) {
        const now = new Date();
        const { insertedId } = await annotationCollection.insertOne({
            ...annotationPayload,
            status: 'to_review',
            internal_comment: null,
            createdAt: now,
            updatedAt: now,
        });

        return annotationCollection.findOne({ _id: insertedId });
    }

    async function findLimitFromSkip({
        skip = 0,
        limit = 10,
        query = {},
        sortBy = null,
        sortDir = 'asc',
    } = {}) {
        return annotationCollection
            .find(query)
            .sort(
                sortBy && sortDir
                    ? { [sortBy]: sortDir === 'asc' ? 1 : -1 }
                    : {},
            )
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    async function count(query = {}) {
        return annotationCollection.countDocuments(query);
    }

    return { create, findLimitFromSkip, count };
};
