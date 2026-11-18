import {
    countLaunchSteps,
    type CatalogModel,
    type SiteGenerationCounter,
    type SiteDataAddChoice,
    type SiteGenerationView,
    type SiteModelLaunchView,
} from '@lodex/common';

type SiteInfoChoice = {
    siteName: string;
    siteDescription: string;
    autoPublish: boolean;
};

const counter = (total: number): SiteGenerationCounter => ({
    done: 0,
    error: 0,
    total,
});

const estimate = (
    model: CatalogModel,
    type: 'enrichment' | 'precomputed',
): SiteGenerationCounter => counter(countLaunchSteps(model, type));

// what the server will show once it runs the generation, while the data is
// still being sent: the data step runs, the next ones wait
export const getUploadView = (
    model: CatalogModel,
    { siteName, siteDescription, autoPublish }: SiteInfoChoice,
): SiteGenerationView => ({
    kind: 'wizard',
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

// the same for a data add: no model nor settings, and a launch only when there
// are steps to relaunch
export const getDataAddUploadView = (
    launch: SiteModelLaunchView | null,
    { relaunch, autoPublish }: SiteDataAddChoice,
): SiteGenerationView => ({
    kind: 'addData',
    status: 'running',
    phase: 'data',
    steps: [],
    launch:
        relaunch && launch && launch.enrichment + launch.precomputed > 0
            ? {
                  enrichment: counter(launch.enrichment),
                  precomputed: counter(launch.precomputed),
              }
            : null,
    ...(autoPublish && { publication: { state: 'waiting' } }),
});
