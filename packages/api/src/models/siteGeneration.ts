import type { ModelLaunchStepType, SiteGenerationStatus } from '@lodex/common';
import { ObjectId, type Collection, type Db } from 'mongodb';
import { getCreatedCollection } from './utils';

export type SiteGenerationStep = {
    name: string;
    type: ModelLaunchStepType;
    targetId: string;
    position: number;
    // Automatic relaunches so far (the first run is not counted)
    attempts: number;
    // The jobId of the job queued for this step: the target's status belongs
    // to the step only when the target carries the same jobId
    jobId?: string;
};

export type SiteGeneration = {
    _id: ObjectId;
    runId: string;
    status: SiteGenerationStatus;
    position: number;
    steps: SiteGenerationStep[];
    // publish the site once every step is done
    autoPublish: boolean;
    // the publisher job queued at the end, if any
    publishJobId?: string;
    // why that publication failed
    publishError?: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
};

export type SiteGenerationCollection = Collection<SiteGeneration> & {
    findCurrent: () => Promise<SiteGeneration | null>;
    start: (
        steps: SiteGenerationStep[],
        options?: { autoPublish?: boolean },
    ) => Promise<SiteGeneration>;
    transition: (
        current: SiteGeneration,
        update: Partial<
            Pick<
                SiteGeneration,
                | 'status'
                | 'position'
                | 'steps'
                | 'publishJobId'
                | 'publishError'
            >
        >,
    ) => Promise<SiteGeneration | null>;
};

export default async (db: Db): Promise<SiteGenerationCollection> => {
    const collection: Collection<SiteGeneration> = await getCreatedCollection(
        db,
        'siteGeneration',
    );

    const repository = collection as SiteGenerationCollection;

    repository.findCurrent = async () => collection.findOne({});

    repository.start = async (steps, { autoPublish = false } = {}) => {
        const now = new Date();
        const generation: Omit<SiteGeneration, '_id'> = {
            runId: new ObjectId().toHexString(),
            status: 'running',
            position: steps.length
                ? Math.min(...steps.map((step) => step.position))
                : 0,
            steps,
            autoPublish,
            version: 0,
            createdAt: now,
            updatedAt: now,
        };
        // A single atomic operation: the existing document keeps its _id
        // (an _id cannot be replaced), a missing one is created.
        const stored = await collection.findOneAndReplace({}, generation, {
            upsert: true,
            returnDocument: 'after',
        });
        return stored as SiteGeneration;
    };

    repository.transition = async (current, update) =>
        collection.findOneAndUpdate(
            {
                _id: current._id,
                runId: current.runId,
                version: current.version,
            },
            {
                $set: { ...update, updatedAt: new Date() },
                $inc: { version: 1 },
            },
            { returnDocument: 'after' },
        );

    return repository;
};
