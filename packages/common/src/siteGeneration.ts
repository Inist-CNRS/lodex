import type { ModelLaunchStepType } from './models/modelCatalog';

// publishing: every step is done, the site is being published (autoPublish)
export type SiteGenerationStatus =
    | 'running'
    | 'publishing'
    | 'error'
    | 'done'
    | 'stopped';

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
    steps: SiteGenerationStepView[];
    // only when the site is published at the end of the generation
    publication?: Pick<SiteGenerationStepView, 'state' | 'message'>;
};
