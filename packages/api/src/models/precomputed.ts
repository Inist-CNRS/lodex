import omit from 'lodash/omit';
import { Collection, Db, ObjectId, type FindOptions } from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

const checkMissingFields = (data: Partial<PreComputation>) =>
    !data.name ||
    !data.webServiceUrl ||
    !data.sourceColumns ||
    (data.sourceColumns instanceof Array && data.sourceColumns.length === 0);

export type PreComputationStatus =
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'ON_HOLD'
    | 'PAUSED'
    | 'FINISHED'
    | 'ERROR'
    | 'CANCELED'
    | '';

export type PreComputation = {
    name: string;
    webServiceUrl: string;
    sourceColumns: string[];
    status: PreComputationStatus;
    createdAt: Date;
    startedAt?: Date;
    finishedAt?: Date;
    data?: unknown[];
};

export type PrecomputedCollection = Collection<PreComputation> & {
    findOneById: (id: string | ObjectId) => Promise<PreComputation | null>;
    findAll: () => Promise<PreComputation[]>;
    create: (data: Omit<PreComputation, '_id'>) => Promise<PreComputation>;
    delete: (id: ObjectId | string) => Promise<{ deletedCount?: number }>;
    update: (
        id: ObjectId | string,
        data: Partial<Omit<PreComputation, '_id'>>,
    ) => Promise<PreComputation | null>;
    updateStatus: (
        id: ObjectId | string,
        status: PreComputationStatus,
        data?: Partial<PreComputation>,
    ) => Promise<void>;
    updateStartedAt: (id: ObjectId | string, startedAt: Date) => Promise<void>;
    castIds: () => Promise<void>;
    getSample: (id: ObjectId | string) => Promise<unknown[]>;
    getStreamOfResult: (id: ObjectId | string) => NodeJS.ReadableStream;
    resultFindLimitFromSkip: (params: {
        precomputedId: string;
        limit: number;
        skip: number;
        query?: FindOptions<PreComputation>;
        sortBy?: string;
        sortDir: 'ASC' | 'DESC';
    }) => Promise<Record<string, unknown>[]>;
    resultCount: (
        precomputedId: string,
        query?: FindOptions<PreComputation>,
    ) => Promise<number>;
};

export default async (db: Db): Promise<PrecomputedCollection> => {
    const collection: Collection<PreComputation> =
        await getCreatedCollection<PreComputation>(db, 'precomputed');
    await collection.createIndex({ name: 1 }, { unique: true });
    const findOneById = async (
        id: string | ObjectId,
    ): Promise<PreComputation | null> =>
        collection.findOne<PreComputation>(
            {
                _id: id instanceof ObjectId ? id : new ObjectId(id),
            },
            { projection: { data: { $slice: 10 } } }, // Limit the size of the data field to 10 elements
        );

    const findAll = async (): Promise<PreComputation[]> =>
        collection.find<PreComputation>({}).toArray();

    const create = async (
        data: Omit<PreComputation, '_id'>,
    ): Promise<PreComputation> => {
        if (checkMissingFields(data)) {
            throw new Error('Missing required fields');
        }
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({
            _id: insertedId,
        }) as Promise<PreComputation>;
    };

    const deleteMethod = async (id: ObjectId | string) => {
        try {
            await db.collection(`pc_${id}`).drop();
        } catch {
            // Collection does not exist, no big deal
            console.warn(`Failed to drop collection 'pc_${id}'`);
        }
        return collection.deleteOne({
            _id: id instanceof ObjectId ? id : new ObjectId(id),
        });
    };

    const update = async (
        id: ObjectId | string,
        data: Partial<Omit<PreComputation, '_id'>>,
    ): Promise<PreComputation | null> => {
        if (checkMissingFields(data)) {
            throw new Error('Missing required fields');
        }

        return collection.findOneAndUpdate(
            {
                _id: id instanceof ObjectId ? id : new ObjectId(id),
            },
            {
                $set: omit(data, ['_id']),
            },
            { returnDocument: 'after' },
        ) as Promise<PreComputation | null>;
    };

    const updateStatus = async (
        id: ObjectId | string,
        status: PreComputationStatus,
        data: Partial<PreComputation> = {},
    ) => {
        const newData = { status, ...data };
        collection.updateOne(
            {
                _id: id instanceof ObjectId ? id : new ObjectId(id),
            },
            { $set: newData },
        );
    };

    const updateStartedAt = async (
        id: ObjectId | string,
        startedAt: Date,
    ): Promise<void> => {
        collection.updateOne(
            {
                _id: id instanceof ObjectId ? id : new ObjectId(id),
            },
            { $set: { startedAt } },
        );
    };

    const castIds = castIdsFactory(collection);

    const getSample = async (id: ObjectId | string) => {
        return db
            .collection(`pc_${id}`)
            .find({}, { projection: { _id: 0 } })
            .limit(10)
            .toArray();
    };

    const getStreamOfResult = (id: ObjectId | string) => {
        return db
            .collection(`pc_${id}`)
            .find({}, { projection: { _id: 0, id: 1, value: 1 } })
            .stream();
    };

    const resultFindLimitFromSkip = ({
        precomputedId,
        limit,
        skip,
        query = {},
        sortBy,
        sortDir,
    }: {
        precomputedId: string;
        limit: number;
        skip: number;
        query?: FindOptions<Record<string, unknown>>;
        sortBy?: string;
        sortDir: 'ASC' | 'DESC';
    }): Promise<Record<string, unknown>[]> =>
        db
            .collection(`pc_${precomputedId}`)
            .find(query)
            .sort(
                sortBy && sortDir
                    ? { [sortBy]: sortDir === 'ASC' ? 1 : -1 }
                    : {},
            )
            .skip(skip)
            .limit(limit)
            .toArray();

    const resultCount = async (
        precomputedId: string,
        query = {},
    ): Promise<number> => {
        return db.collection(`pc_${precomputedId}`).find(query).count();
    };

    return Object.assign(collection, {
        findOneById,
        findAll,
        create,
        delete: deleteMethod,
        update,
        updateStatus,
        updateStartedAt,
        castIds,
        getSample,
        getStreamOfResult,
        resultFindLimitFromSkip,
        resultCount,
    });
};
