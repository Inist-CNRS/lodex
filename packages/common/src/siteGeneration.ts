import type { ModelLaunchStepType, SiteInfo } from './models/modelCatalog';

// publishing: every step is done, the site is being published (autoPublish)
export type SiteGenerationStatus =
    | 'running'
    | 'publishing'
    | 'error'
    | 'stopping'
    | 'done'
    | 'stopped';

// The statuses of a generation not over yet: the progress dialog shows it
export const ACTIVE_SITE_GENERATION_STATUSES: readonly SiteGenerationStatus[] =
    ['running', 'publishing', 'error', 'stopping'];

export const isSiteGenerationActive = (
    status?: SiteGenerationStatus,
): boolean => !!status && ACTIVE_SITE_GENERATION_STATUSES.includes(status);

export type SiteGenerationPhase = 'data' | 'model' | 'settings' | 'launch';

export type SiteWizardChoice = { modelId: string } & SiteInfo;

export type SiteGenerationCounter = {
    done: number;
    total: number;
    error: number;
};

export type SiteGenerationStepState = 'waiting' | 'running' | 'done' | 'error';

export type SiteGenerationStepView = {
    name: string;
    type: ModelLaunchStepType;
    position: number;
    state: SiteGenerationStepState;
    message?: string;
};

export type SiteGenerationView = {
    status: SiteGenerationStatus;
    phase: SiteGenerationPhase;
    steps: SiteGenerationStepView[];
    modelId?: string;
    importedLines?: number;
    settings?: { siteName: boolean; siteDescription: boolean };
    launch: {
        enrichment: SiteGenerationCounter;
        precomputed: SiteGenerationCounter;
    } | null;
    message?: string;
    // the technical error behind the message, shown on demand
    detail?: string;
    themeNotFound?: string;
    // only when the site is published at the end of the generation
    publication?: Pick<SiteGenerationStepView, 'state' | 'message'>;
};
