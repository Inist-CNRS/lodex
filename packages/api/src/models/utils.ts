import { Collection, Db, ObjectId, type Document } from 'mongodb';

export const castIdsFactory = (collection: any) => async () => {
    const items = await collection.find({}).toArray();

    return items.reduce(
        (acc: any, item: any) =>
            acc.then(async () => {
                await acc;
                await collection.deleteOne({ _id: item._id });
                await collection.insertOne({
                    ...item,
                    _id: new ObjectId(item._id),
                });
            }),
        Promise.resolve(),
    );
};

export type TaskState = {
    _id: unknown;
    status?: string;
    message?: string;
    jobId?: string;
};

// The status fields of the tasks (enrichments, precomputations) with the
// given ids, in one query. Their ids are ObjectIds, or strings in documents
// written before castIds.
export const findTaskStatesByIds = async (
    collection: Collection<any>,
    ids: string[],
): Promise<TaskState[]> => {
    if (!ids.length) {
        return [];
    }
    const candidates = ids.flatMap((id) =>
        ObjectId.isValid(id) ? [new ObjectId(id), id] : [id],
    );
    return collection
        .find<TaskState>(
            { _id: { $in: candidates } },
            { projection: { status: 1, message: 1, jobId: 1 } },
        )
        .toArray();
};

const checkIfCollectionExists = async (db: Db, collectionName: string) => {
    const found = await db
        .listCollections({ name: collectionName }, { nameOnly: true })
        .toArray();
    return found.length !== 0;
};

export const getCreatedCollection = async <Resource extends Document = any>(
    db: Db,
    collectionName: string,
): Promise<Collection<Resource>> => {
    const collExists = await checkIfCollectionExists(db, collectionName);
    if (!collExists) {
        try {
            await db.createCollection(collectionName);
        } catch (error) {
            // in some cases, with concurrent access, creation is simultaneous.
            const collAlreadyExists = await checkIfCollectionExists(
                db,
                collectionName,
            );
            if (!collAlreadyExists) {
                throw error;
            }
        }
    }
    return db.collection<Resource>(collectionName);
};

// Matches a task that carries the given jobId, or no jobId at all (written
// before the jobId existed). Without a jobId, matches the latter only.
export const jobIdMatches = (jobId?: string) => {
    const legacy = [
        { jobId: { $exists: false } },
        { jobId: { $type: 'null' as const } },
    ];
    return { $or: jobId ? [{ jobId }, ...legacy] : legacy };
};
