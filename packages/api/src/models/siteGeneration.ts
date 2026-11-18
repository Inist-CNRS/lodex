import type {
    ModelLaunchStepType,
    SiteGenerationPhase,
    SiteGenerationStatus,
    SiteWizardChoice,
} from '@lodex/common';
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
    phase: SiteGenerationPhase;
    position: number;
    steps: SiteGenerationStep[];
    choice?: SiteWizardChoice;
    importJobId?: string;
    modelJobId?: string;
    importedLines?: number;
    message?: string;
    // the technical error behind the message, shown on demand
    detail?: string;
    themeNotFound?: string;
    estimate?: { enrichment: number; precomputed: number };
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

export type SiteGenerationUpdate = Partial<
    Omit<
        SiteGeneration,
        '_id' | 'runId' | 'version' | 'createdAt' | 'updatedAt'
    >
>;

export type SiteGenerationCollection = Collection<SiteGeneration> & {
    findCurrent: () => Promise<SiteGeneration | null>;
    startWizard: (
        wizard: Pick<SiteGeneration, 'choice' | 'importJobId' | 'estimate'>,
    ) => Promise<SiteGeneration>;
    transition: (
        current: SiteGeneration,
        update: SiteGenerationUpdate,
        options?: { unset?: (keyof SiteGenerationUpdate)[] },
    ) => Promise<SiteGeneration | null>;
    // called after every write of the generation (see pushSiteGeneration)
    onChange?: () => void;
};

// A generation stored before the wizard phases had none: it was launching
const withDefaults = (
    generation: SiteGeneration | null,
): SiteGeneration | null =>
    generation && { ...generation, phase: generation.phase ?? 'launch' };

export default async (db: Db): Promise<SiteGenerationCollection> => {
    const collection: Collection<SiteGeneration> = await getCreatedCollection(
        db,
        'siteGeneration',
    );

    const repository = collection as SiteGenerationCollection;

    repository.findCurrent = async () =>
        withDefaults(await collection.findOne({}));

    repository.startWizard = async ({ choice, importJobId, estimate }) => {
        const now = new Date();
        const generation: Omit<SiteGeneration, '_id'> = {
            runId: new ObjectId().toHexString(),
            status: 'running',
            version: 0,
            createdAt: now,
            updatedAt: now,
            phase: 'data',
            position: 0,
            steps: [],
            choice,
            importJobId,
            estimate,
            autoPublish: choice?.autoPublish === true,
        };
        // A single atomic operation: the existing document keeps its _id
        // (an _id cannot be replaced), a missing one is created.
        const stored = await collection.findOneAndReplace({}, generation, {
            upsert: true,
            returnDocument: 'after',
        });
        repository.onChange?.();
        return stored as SiteGeneration;
    };

    // `unset` removes fields (an undefined value would be stored as null)
    repository.transition = async (current, update, { unset = [] } = {}) => {
        const updated = withDefaults(
            await collection.findOneAndUpdate(
                {
                    _id: current._id,
                    runId: current.runId,
                    version: current.version,
                },
                {
                    $set: { ...update, updatedAt: new Date() },
                    $inc: { version: 1 },
                    ...(unset.length && {
                        $unset: Object.fromEntries(
                            unset.map((field) => [field, '']),
                        ),
                    }),
                },
                { returnDocument: 'after' },
            ),
        );
        if (updated) {
            repository.onChange?.();
        }
        return updated;
    };

    return repository;
};
