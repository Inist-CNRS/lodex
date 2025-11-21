import { TaskStatus } from '@lodex/common';
import omit from 'lodash/omit';
import {
    Collection,
    Db,
    ObjectId,
    type Filter,
    type UpdateResult,
} from 'mongodb';
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
    _id: ObjectId;
    name: string;
    webServiceUrl: string;
    sourceColumns: string[];
    status: PreComputationStatus;
    createdAt: Date;
    startedAt?: Date;
    finishedAt?: Date;
    data?: unknown[];
    hasData?: boolean;
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
    getSample: (id: ObjectId | string) => Promise<Record<string, unknown>[]>;
    getStreamOfResult: (id: ObjectId | string) => NodeJS.ReadableStream;
    resultFindLimitFromSkip: <Result extends Record<string, unknown>>(params: {
        precomputedId: string;
        limit: number;
        skip: number;
        query?: Filter<Result>;
        sortBy?: string;
        sortDir: 'ASC' | 'DESC';
    }) => Promise<Result[]>;
    resultCount: (
        precomputedId: string,
        query?: Filter<PreComputation>,
    ) => Promise<number>;
    getResultColumns: (
        precomputedId: string,
    ) => Promise<{ key: string; type: string }[]>;
    getColumnsWithSubPaths: (
        id: ObjectId | string,
    ) => Promise<{ name: string; subPaths: string[] }[]>;
    updateResult: (params: {
        precomputedId: string;
        id: string;
        data: Record<string, unknown>;
    }) => Promise<Record<string, unknown> | null>;
    cancelByIds: (jobIds: string[]) => Promise<UpdateResult | undefined>;
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
                // @ts-expect-error TS2345
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
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

        const { insertedId } = await collection.insertOne(
            // This is required for typing because insertOne should accept document without _id,
            // but this is not the case
            data as PreComputation,
        );
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
            // @ts-expect-error TS2345
            $or: [{ _id: new ObjectId(id) }, { _id: id }],
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
                // @ts-expect-error TS2345
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
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
                // @ts-expect-error TS2345
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
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
                // @ts-expect-error TS2345
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
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

    const resultFindLimitFromSkip = <Result extends Record<string, unknown>>({
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
        query?: Filter<Result>;
        sortBy?: string;
        sortDir: 'ASC' | 'DESC';
    }): Promise<Result[]> => {
        return db
            .collection<Result>(`pc_${precomputedId}`)
            .find(query)
            .sort(
                sortBy && sortDir
                    ? { [sortBy]: sortDir === 'ASC' ? 1 : -1 }
                    : {},
            )
            .skip(skip)
            .limit(limit)
            .toArray() as Promise<Result[]>;
    };

    const resultCount = async (
        precomputedId: string,
        query = {},
    ): Promise<number> => {
        return db.collection(`pc_${precomputedId}`).find(query).count();
    };

    const getResultColumns = async (
        precomputedId: string,
    ): Promise<
        {
            key: string;
            type: string;
        }[]
    > => {
        const pipeline = [
            { $sample: { size: 1000 } },
            {
                $project: {
                    fields: { $objectToArray: '$$ROOT' },
                },
            },
            { $unwind: '$fields' },
            {
                $match: {
                    'fields.k': { $ne: '_id' }, // Exclude the _id field
                },
            },
            {
                $group: {
                    _id: '$fields.k',
                    types: {
                        $addToSet: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $eq: [
                                                { $type: '$fields.v' },
                                                'null',
                                            ],
                                        },
                                        then: 'null',
                                    },
                                    {
                                        case: {
                                            $eq: [
                                                { $type: '$fields.v' },
                                                'bool',
                                            ],
                                        },
                                        then: 'boolean',
                                    },
                                    {
                                        case: {
                                            $in: [
                                                { $type: '$fields.v' },
                                                [
                                                    'int',
                                                    'long',
                                                    'double',
                                                    'decimal',
                                                ],
                                            ],
                                        },
                                        then: 'number',
                                    },
                                    {
                                        case: {
                                            $eq: [
                                                { $type: '$fields.v' },
                                                'string',
                                            ],
                                        },
                                        then: 'string',
                                    },
                                    {
                                        case: {
                                            $eq: [
                                                { $type: '$fields.v' },
                                                'array',
                                            ],
                                        },
                                        then: 'array',
                                    },
                                    {
                                        case: {
                                            $eq: [
                                                { $type: '$fields.v' },
                                                'object',
                                            ],
                                        },
                                        then: 'object',
                                    },
                                ],
                                default: 'string',
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    key: '$_id',
                    type: {
                        $cond: {
                            if: { $eq: [{ $size: '$types' }, 1] },
                            then: { $arrayElemAt: ['$types', 0] },
                            else: {
                                $cond: {
                                    if: { $in: ['string', '$types'] },
                                    then: 'string',
                                    else: { $arrayElemAt: ['$types', 0] },
                                },
                            },
                        },
                    },
                    _id: 0,
                },
            },
            { $sort: { key: 1 } },
        ];

        try {
            return db
                .collection(`pc_${precomputedId}`)
                .aggregate<{
                    key: string;
                    type: string;
                }>(pipeline)
                .toArray();
        } catch (error) {
            return [{ key: 'value', type: 'string' }];
        }
    };

    const updateResult = async ({
        precomputedId,
        id,
        data,
    }: {
        precomputedId: string;
        id: string;
        data: Record<string, unknown>;
    }) => {
        return db.collection(`pc_${precomputedId}`).findOneAndUpdate(
            {
                // @ts-expect-error TS2345
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
            },
            {
                $set: omit(data, ['_id']),
            },
            { returnDocument: 'after' },
        ) as Promise<Record<string, unknown> | null>;
    };

    const getColumnsWithSubPaths = async (
        id: ObjectId | string,
    ): Promise<{ name: string; subPaths: string[] }[]> => {
        const pipeline = [
            { $limit: 1000 },
            {
                $project: {
                    fields: { $objectToArray: '$$ROOT' },
                },
            },
            { $unwind: '$fields' },
            {
                $match: {
                    'fields.k': { $ne: '_id' },
                },
            },
            {
                $group: {
                    _id: '$fields.k',
                    subPaths: {
                        $addToSet: {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: [
                                                { $type: '$fields.v' },
                                                'object',
                                            ],
                                        },
                                        {
                                            $ne: [
                                                { $isArray: '$fields.v' },
                                                true,
                                            ],
                                        },
                                    ],
                                },
                                then: { $objectToArray: '$fields.v' },
                                else: null,
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    subPaths: {
                        $reduce: {
                            input: '$subPaths',
                            initialValue: [],
                            in: {
                                $cond: {
                                    if: { $eq: ['$$this', null] },
                                    then: '$$value',
                                    else: {
                                        $setUnion: [
                                            '$$value',
                                            {
                                                $map: {
                                                    input: '$$this',
                                                    as: 'kv',
                                                    in: '$$kv.k',
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
            { $sort: { name: 1 } },
        ];

        try {
            return await db
                .collection(`pc_${id}`)
                .aggregate<{ name: string; subPaths: string[] }>(pipeline)
                .toArray();
        } catch (error) {
            return [];
        }
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
            { $set: { status: TaskStatus.CANCELED, finishedAt: new Date() } },
        );
    };

    const removeResultColumn = async (
        precomputedId: string,
        columnKey: string,
    ): Promise<void> => {
        await db
            .collection(`pc_${precomputedId}`)
            .updateMany({}, { $unset: { [columnKey]: '' } });
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
        getResultColumns,
        getColumnsWithSubPaths,
        updateResult,
        cancelByIds,
        removeResultColumn,
    });
};
