import type {
    SiteGenerationPhase,
    SiteGenerationStepState,
    SiteGenerationView,
} from '@lodex/common';

// the publication of the site comes after the launch phase (autoPublish)
export type DisplayedStepKey = SiteGenerationPhase | 'publication';

export type DisplayedStep = {
    key: DisplayedStepKey;
    state: SiteGenerationStepState;
};

const PHASES: SiteGenerationPhase[] = ['data', 'model', 'settings', 'launch'];

const KEYS: DisplayedStepKey[] = [...PHASES, 'publication'];

const isShown = (view: SiteGenerationView, key: DisplayedStepKey) => {
    switch (key) {
        // a data add imports data, but no model
        case 'data':
            return view.kind === 'addData' || !!view.modelId;
        // a data add has no model id
        case 'model':
            return !!view.modelId;
        case 'settings':
            return !!view.settings;
        case 'launch':
            return view.launch !== null;
        case 'publication':
            return !!view.publication;
    }
};

const getState = (
    view: SiteGenerationView,
    key: DisplayedStepKey,
): SiteGenerationStepState => {
    if (key === 'publication') {
        return view.publication!.state;
    }
    // a publication started once every phase was done
    if (
        view.status === 'done' ||
        (view.publication && view.publication.state !== 'waiting')
    ) {
        return 'done';
    }
    const rank = PHASES.indexOf(key);
    const currentRank = PHASES.indexOf(view.phase);
    if (rank < currentRank) {
        return 'done';
    }
    if (rank > currentRank) {
        return 'waiting';
    }
    return view.status === 'error' ? 'error' : 'running';
};

export const getDisplayedSteps = (view: SiteGenerationView): DisplayedStep[] =>
    KEYS.filter((key) => isShown(view, key)).map((key) => ({
        key,
        state: getState(view, key),
    }));

// the 1-based rank of the step in progress (or in error)
export const getCurrentRank = (steps: DisplayedStep[]): number => {
    const index = steps.findIndex(({ state }) => state !== 'done');
    return index === -1 ? steps.length : index + 1;
};
