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
            // an error of the launch phase is shown even without steps
            return (
                view.launch !== null ||
                (view.phase === 'launch' && view.status === 'error')
            );
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
