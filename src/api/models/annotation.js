import { ObjectId } from 'mongodb';
import { getCreatedCollection } from './utils';

export default async (db) => {
    const annotationCollection = await getCreatedCollection(db, 'annotation');

    async function create(annotationPayload) {
        console.log('annotationPayload', annotationPayload);
        const now = new Date();
        const { insertedId } = await annotationCollection.insertOne({
            ...annotationPayload,
            status: 'to_review',
            internal_comment: null,
            createdAt: annotationPayload.createdAt ?? now,
            updatedAt: annotationPayload.updatedAt ?? now,
        });

        return annotationCollection.findOne({ _id: insertedId });
    }

    async function findLimitFromSkip({
        skip = 0,
        limit = 10,
        query = {},
        sortBy = 'createdAt',
        sortDir = 'desc',
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

    async function findOneById(id) {
        return annotationCollection.findOne({ _id: new ObjectId(id) });
    }

    return { create, findLimitFromSkip, count, findOneById };
};
