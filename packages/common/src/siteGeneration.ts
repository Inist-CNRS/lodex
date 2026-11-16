import type { ModelLaunchStepType } from './models/modelCatalog';

export type SiteGenerationStatus = 'running' | 'error' | 'done' | 'stopped';

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
};
