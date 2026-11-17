import {
    countLaunchSteps,
    type CatalogModel,
    type SiteGenerationCounter,
    type SiteGenerationView,
} from '@lodex/common';

type SiteInfoChoice = {
    siteName: string;
    siteDescription: string;
    autoPublish: boolean;
};

const estimate = (
    model: CatalogModel,
    type: 'enrichment' | 'precomputed',
): SiteGenerationCounter => ({
    done: 0,
    error: 0,
    total: countLaunchSteps(model, type),
});

// what the server will show once it runs the generation, while the data is
// still being sent: the data step runs, the next ones wait
export const getUploadView = (
    model: CatalogModel,
    { siteName, siteDescription, autoPublish }: SiteInfoChoice,
): SiteGenerationView => ({
    status: 'running',
    phase: 'data',
    steps: [],
    modelId: model.id,
    settings: { siteName: !!siteName, siteDescription: !!siteDescription },
    launch: model.launchOrder
        ? {
              enrichment: estimate(model, 'enrichment'),
              precomputed: estimate(model, 'precomputed'),
          }
        : null,
    ...(autoPublish && { publication: { state: 'waiting' } }),
});
