import { ObjectId } from 'mongodb';
import { getCreatedCollection } from './utils';

export default async (db) => {
    const annotationCollection = await getCreatedCollection(db, 'annotation');

    async function create(annotationPayload) {
        const now = new Date();
        const { insertedId } = await annotationCollection.insertOne({
            ...annotationPayload,
            status: 'to_review',
            internalComment: null,
            createdAt: annotationPayload.createdAt ?? now,
            updatedAt: annotationPayload.updatedAt ?? now,
        });

        return annotationCollection.findOne({ _id: insertedId });
    }

    async function updateOneById(
        id,
        annotationPayload,
        updatedAt = new Date(),
    ) {
        return annotationCollection.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    ...annotationPayload,
                    updatedAt,
                },
            },
            { returnDocument: 'after' },
        );
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
        if (!ObjectId.isValid(id)) {
            return null;
        }
        return annotationCollection.findOne({ _id: new ObjectId(id) });
    }

    return { create, updateOneById, findLimitFromSkip, count, findOneById };
};
