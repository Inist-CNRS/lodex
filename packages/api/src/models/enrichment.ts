import { TaskStatus, type TaskStatusType } from '@lodex/common';
import omit from 'lodash/omit';
import {
    Collection,
    Db,
    ObjectId,
    type DeleteResult,
    type UpdateResult,
    type WithId,
} from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

export type Enrichment = {
    _id?: ObjectId;
    name: string;
    dataSource?: string;
    description?: string;
    status: TaskStatusType;
    createdAt: Date;
    startedAt?: Date;
    finishedAt?: Date;
    jobId: ObjectId;
    parameters: Record<string, unknown>;
    result?: Record<string, unknown>;
};

export type EnrichmentCollection = {
    findOneById: (id: string) => Promise<Enrichment | null>;
    findAll: () => Promise<Enrichment[]>;
    create: (data: Enrichment) => Promise<WithId<Enrichment> | null>;
    delete: (id: string) => Promise<DeleteResult>;
    update: (id: string, data: Enrichment) => Promise<Enrichment>;
    updateStatus: (
        id: string,
        status: TaskStatusType,
        data?: Partial<Enrichment>,
    ) => Promise<void>;
    cancelByIds: (jobIds: string[]) => Promise<UpdateResult | undefined>;
    castIds: () => void;
};

export default async (db: Db): Promise<EnrichmentCollection> => {
    const collection: Collection<Enrichment> = await getCreatedCollection(
        db,
        'enrichment',
    );
    await collection.createIndex({ name: 1, dataSource: 1 }, { unique: true });

    const findOneById = async (id: string) =>
        // @ts-expect-error TS2345
        collection.findOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    const findAll = async () => collection.find({}).toArray();

    const create = async (
        data: Enrichment,
    ): Promise<WithId<Enrichment> | null> => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    const deleteMethod = async (id: string) =>
        // @ts-expect-error TS2345
        collection.deleteOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    const update = async (id: string, data: Enrichment) => {
        const objectId = new ObjectId(id);

        return collection.findOneAndUpdate(
            {
                // @ts-expect-error TS2345
                $or: [{ _id: objectId }, { _id: id }],
            },
            {
                $set: omit(data, ['_id']),
            },
            { returnDocument: 'after' },
        );
    };

    const updateStatus = async (
        id: string,
        status: TaskStatusType,
        data: Partial<Enrichment> = {},
    ) => {
        const newData = { status, ...data };
        await collection.updateOne(
            {
                // @ts-expect-error TS2345
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
            },
            { $set: newData },
        );
    };

    const cancelByIds = async (ids: string[]) => {
        if (ids.length === 0) {
            return;
        }
        return collection.updateMany(
            {
                _id: {
                    $in: [
                        ...(ids as unknown as ObjectId[]),
                        ...ids.map((id) => new ObjectId(id)),
                    ],
                },
            },
            { $set: { status: TaskStatus.CANCELED } },
        );
    };

    const castIds = castIdsFactory(collection);

    return Object.assign(collection, {
        findOneById,
        findAll,
        create,
        delete: deleteMethod,
        update,
        updateStatus,
        castIds,
        cancelByIds,
    });
};
