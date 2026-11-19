import {
    compareLaunchSteps,
    type ModelLaunchStepType,
    type SiteGenerationPhase,
    type SiteGenerationStepState,
    type SiteGenerationStepView,
    type SiteGenerationView,
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
        // a data add has the model id of the site, but imports no model
        case 'model':
            return view.kind !== 'addData' && !!view.modelId;
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

// a launch step and its rank among the steps of its type, from 1
export type RankedLaunchStep = SiteGenerationStepView & { rank: number };

// steps of a type that follow each other in the launch
export type LaunchGroup = {
    type: ModelLaunchStepType;
    steps: RankedLaunchStep[];
    total: number;
    done: number;
    // the steps tried again included
    running: number;
    error: number;
};

const countState = (
    steps: SiteGenerationStepView[],
    state: SiteGenerationStepState,
) => steps.filter((step) => step.state === state).length;

export const getLaunchGroups = (
    steps: SiteGenerationStepView[],
): LaunchGroup[] => {
    const ranks: Record<ModelLaunchStepType, number> = {
        enrichment: 0,
        precomputed: 0,
    };
    const groups: { type: ModelLaunchStepType; steps: RankedLaunchStep[] }[] =
        [];
    for (const step of [...steps].sort(compareLaunchSteps)) {
        const ranked = { ...step, rank: ++ranks[step.type] };
        const last = groups[groups.length - 1];
        if (last?.type === step.type) {
            last.steps.push(ranked);
        } else {
            groups.push({ type: step.type, steps: [ranked] });
        }
    }
    return groups.map((group) => ({
        ...group,
        total: group.steps.length,
        done: countState(group.steps, 'done'),
        running: countState(group.steps, 'running'),
        error: countState(group.steps, 'error'),
    }));
};
