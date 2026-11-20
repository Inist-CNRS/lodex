import {
    countLaunchSteps,
    type CatalogModel,
    type SiteGenerationCounter,
    type SiteDataAddChoice,
    type SiteGenerationView,
    type SiteModelLaunchView,
    toWaitingLaunchSteps,
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
    steps: toWaitingLaunchSteps(model.launchOrder ?? []),
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
// are steps to relaunch. Unknown counts (null) with a relaunch still show the
// step, without counts (a counter with no total shows no line).
// The step may disappear once the server's view takes over if the model has
// nothing to relaunch (rare: only when reading the counts failed).
const getDataAddLaunch = (
    launch: SiteModelLaunchView | null,
    relaunch: boolean,
): SiteGenerationView['launch'] => {
    if (!relaunch) {
        return null;
    }
    if (!launch) {
        return { enrichment: counter(0), precomputed: counter(0) };
    }
    return launch.enrichment + launch.precomputed > 0
        ? {
              enrichment: counter(launch.enrichment),
              precomputed: counter(launch.precomputed),
          }
        : null;
};

export const getDataAddUploadView = (
    launch: SiteModelLaunchView | null,
    { relaunch, autoPublish }: SiteDataAddChoice,
): SiteGenerationView => ({
    kind: 'addData',
    status: 'running',
    phase: 'data',
    // steps is missing from the response of an older API
    steps: relaunch && launch ? toWaitingLaunchSteps(launch.steps ?? []) : [],
    launch: getDataAddLaunch(launch, relaunch),
    ...(autoPublish && { publication: { state: 'waiting' } }),
});
