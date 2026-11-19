import type {
    ModelLaunchStepType,
    SiteGenerationStepState,
    SiteGenerationStepView,
    SiteGenerationView,
} from '@lodex/common';
import { getDisplayedSteps, getLaunchGroups } from './displayedSteps';

const counter = (total: number) => ({ done: 0, total, error: 0 });

const buildView = (
    overrides: Partial<SiteGenerationView> = {},
): SiteGenerationView => ({
    status: 'running',
    phase: 'model',
    steps: [],
    modelId: 'hal2lodex',
    importedLines: 13483,
    settings: { siteName: true, siteDescription: true },
    launch: {
        enrichment: counter(7),
        precomputed: counter(3),
    },
    ...overrides,
});

describe('getDisplayedSteps', () => {
    it('shows the data, launch and publication steps of a data add', () => {
        const steps = getDisplayedSteps(
            buildView({
                kind: 'addData',
                modelId: undefined,
                settings: undefined,
                phase: 'data',
                publication: { state: 'waiting' },
            }),
        );
        expect(steps.map(({ key }) => key)).toEqual([
            'data',
            'launch',
            'publication',
        ]);
    });

    it('shows no model step for a data add with a model id', () => {
        const steps = getDisplayedSteps(
            buildView({
                kind: 'addData',
                modelId: 'hal2lodex',
                settings: undefined,
                phase: 'data',
                publication: { state: 'waiting' },
            }),
        );
        expect(steps.map(({ key }) => key)).toEqual([
            'data',
            'launch',
            'publication',
        ]);
    });

    it('shows only the data step of a data add without launch nor publication', () => {
        const steps = getDisplayedSteps(
            buildView({
                kind: 'addData',
                modelId: undefined,
                settings: undefined,
                phase: 'data',
                launch: null,
            }),
        );
        expect(steps.map(({ key }) => key)).toEqual(['data']);
    });

    it('shows the launch step of a data add in error in its launch phase without steps', () => {
        const steps = getDisplayedSteps(
            buildView({
                kind: 'addData',
                modelId: undefined,
                settings: undefined,
                phase: 'launch',
                status: 'error',
                launch: null,
            }),
        );
        expect(steps).toEqual([
            { key: 'data', state: 'done' },
            { key: 'launch', state: 'error' },
        ]);
    });

    it('shows every step of a whole generation, the current one running', () => {
        const steps = getDisplayedSteps(buildView());
        expect(steps).toEqual([
            { key: 'data', state: 'done' },
            { key: 'model', state: 'running' },
            { key: 'settings', state: 'waiting' },
            { key: 'launch', state: 'waiting' },
        ]);
    });

    it('starts with the data step running', () => {
        const steps = getDisplayedSteps(buildView({ phase: 'data' }));
        expect(steps.map(({ state }) => state)).toEqual([
            'running',
            'waiting',
            'waiting',
            'waiting',
        ]);
    });

    it('leaves out the settings step without settings', () => {
        const steps = getDisplayedSteps(buildView({ settings: undefined }));
        expect(steps.map(({ key }) => key)).toEqual([
            'data',
            'model',
            'launch',
        ]);
    });

    it('leaves out the launch step without anything to launch', () => {
        const steps = getDisplayedSteps(buildView({ launch: null }));
        expect(steps.map(({ key }) => key)).toEqual([
            'data',
            'model',
            'settings',
        ]);
    });

    it('puts the step of the current phase in error', () => {
        const steps = getDisplayedSteps(
            buildView({ status: 'error', phase: 'launch' }),
        );
        expect(steps).toEqual([
            { key: 'data', state: 'done' },
            { key: 'model', state: 'done' },
            { key: 'settings', state: 'done' },
            { key: 'launch', state: 'error' },
        ]);
    });

    it('ends with every step done', () => {
        const steps = getDisplayedSteps(
            buildView({ status: 'done', phase: 'launch' }),
        );
        expect(steps.every(({ state }) => state === 'done')).toBe(true);
    });

    it('only shows the launch of a generation without the wizard', () => {
        const steps = getDisplayedSteps(
            buildView({
                phase: 'launch',
                modelId: undefined,
                importedLines: undefined,
                settings: undefined,
            }),
        );
        expect(steps).toEqual([{ key: 'launch', state: 'running' }]);
    });
});

const step = (
    name: string,
    type: ModelLaunchStepType,
    position: number,
    state: SiteGenerationStepState = 'waiting',
): SiteGenerationStepView => ({ name, type, position, state });

describe('getLaunchGroups', () => {
    it('has no group without steps', () => {
        expect(getLaunchGroups([])).toEqual([]);
    });

    it('puts the precomputation of theses-fr before its enrichments', () => {
        const groups = getLaunchGroups([
            step('xml', 'enrichment', 2),
            step('resume', 'enrichment', 3),
            step('clusterRameau', 'precomputed', 1),
        ]);
        expect(groups.map(({ type }) => type)).toEqual([
            'precomputed',
            'enrichment',
        ]);
        expect(groups.map(({ total }) => total)).toEqual([1, 2]);
        expect(groups[1].steps.map(({ name }) => name)).toEqual([
            'xml',
            'resume',
        ]);
    });

    it('splits the launch into consecutive groups of a type', () => {
        const groups = getLaunchGroups([
            step('p1', 'precomputed', 1),
            step('e1', 'enrichment', 2),
            step('e2', 'enrichment', 3),
            step('p2', 'precomputed', 4),
            step('p3', 'precomputed', 4),
            step('e3', 'enrichment', 5),
        ]);
        expect(groups.map(({ type }) => type)).toEqual([
            'precomputed',
            'enrichment',
            'precomputed',
            'enrichment',
        ]);
        expect(groups.map(({ total }) => total)).toEqual([1, 2, 2, 1]);
    });

    it('puts a precomputation before an enrichment of the same position', () => {
        const groups = getLaunchGroups([
            step('a', 'enrichment', 1, 'done'),
            step('b', 'enrichment', 2, 'running'),
            step('x', 'precomputed', 2, 'running'),
        ]);
        expect(groups.map(({ type }) => type)).toEqual([
            'enrichment',
            'precomputed',
            'enrichment',
        ]);
        expect(
            groups.map((group) => group.steps.map(({ name }) => name)),
        ).toEqual([['a'], ['x'], ['b']]);
        expect(groups.map(({ running }) => running)).toEqual([0, 1, 1]);
    });

    it('ranks the steps among those of their type over the whole launch', () => {
        const groups = getLaunchGroups([
            step('p1', 'precomputed', 1),
            step('e1', 'enrichment', 2),
            step('e2', 'enrichment', 3),
            step('p2', 'precomputed', 4),
            step('e3', 'enrichment', 5),
        ]);
        const ranks = (type: ModelLaunchStepType) =>
            groups
                .filter((group) => group.type === type)
                .flatMap((group) => group.steps.map(({ rank }) => rank));
        expect(ranks('enrichment')).toEqual([1, 2, 3]);
        expect(ranks('precomputed')).toEqual([1, 2]);
    });

    it('counts the running step, a step tried again included, but not one in error', () => {
        const [group] = getLaunchGroups([
            step('a', 'enrichment', 1, 'done'),
            step('b', 'enrichment', 2, 'done'),
            step('c', 'enrichment', 3, 'error'),
            {
                ...step('d', 'enrichment', 4, 'running'),
                retry: { attempt: 1, max: 3 },
            },
            step('e', 'enrichment', 5),
        ]);
        expect(group).toMatchObject({
            total: 5,
            done: 2,
            running: 1,
            error: 1,
        });
    });
});
