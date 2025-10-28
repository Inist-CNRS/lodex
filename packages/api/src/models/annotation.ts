import { ObjectId } from 'mongodb';
import { getCreatedCollection } from './utils';

export default async (db: any) => {
    const annotationCollection: any = await getCreatedCollection(
        db,
        'annotation',
    );
    await annotationCollection.createIndex({ fieldId: 1 });
    await annotationCollection.createIndex({ resourceUri: 1 });

    async function create({ reCaptchaToken, ...annotationPayload }: any) {
        const now = new Date();
        const { insertedId } = await annotationCollection.insertOne({
            ...annotationPayload,
            status: annotationPayload.status ?? 'to_review',
            internalComment: annotationPayload.internalComment ?? null,
            createdAt: annotationPayload.createdAt ?? now,
            updatedAt: annotationPayload.updatedAt ?? now,
        });

        return annotationCollection.findOne({ _id: insertedId });
    }

    async function updateOneById(
        id: any,
        annotationPayload: any,
        updatedAt = new Date(),
    ) {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        return annotationCollection.findOneAndUpdate(
            {
                _id: new ObjectId(id),
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

    async function findAll() {
        return annotationCollection.find().sort({
            createdAt: -1,
        });
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

    async function findOneById(id: any) {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        return annotationCollection.findOne({ _id: new ObjectId(id) });
    }

    async function deleteOneById(id: any) {
        if (!ObjectId.isValid(id)) {
            return 0;
        }
        const { deletedCount } = await annotationCollection.deleteOne({
            _id: new ObjectId(id),
        });
        return +deletedCount;
    }

    async function deleteMany(filter = {}) {
        return annotationCollection.deleteMany(filter);
    }

    async function deleteManyById(ids: any) {
        const { deletedCount } = await annotationCollection.deleteMany({
            _id: {
                $in: ids
                    .filter((id: any) => ObjectId.isValid(id))
                    .map((id: any) => new ObjectId(id)),
            },
        });
        return +deletedCount;
    }

    async function findManyByFieldAndResource(fieldId: any, resourceUri: any) {
        return await annotationCollection
            .find({ fieldId, resourceUri })
            .sort({
                createdAt: -1,
            })
            .toArray();
    }

    async function getAnnotatedResourceUris() {
        return annotationCollection.distinct('resourceUri');
    }

    return {
        find: (...args: any[]) => annotationCollection.find(...args),
        create,
        updateOneById,
        findAll,
        findLimitFromSkip,
        count,
        findOneById,
        deleteOneById,
        deleteMany,
        deleteManyById,
        findManyByFieldAndResource,
        getAnnotatedResourceUris,
    };
};
