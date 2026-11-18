import type { SiteGenerationView } from '@lodex/common';
import { getCurrentRank, getDisplayedSteps } from './displayedSteps';

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

    it('shows every step of a whole generation, the current one running', () => {
        const steps = getDisplayedSteps(buildView());
        expect(steps).toEqual([
            { key: 'data', state: 'done' },
            { key: 'model', state: 'running' },
            { key: 'settings', state: 'waiting' },
            { key: 'launch', state: 'waiting' },
        ]);
        expect(getCurrentRank(steps)).toBe(2);
    });

    it('starts with the data step running', () => {
        const steps = getDisplayedSteps(buildView({ phase: 'data' }));
        expect(steps.map(({ state }) => state)).toEqual([
            'running',
            'waiting',
            'waiting',
            'waiting',
        ]);
        expect(getCurrentRank(steps)).toBe(1);
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
        expect(getCurrentRank(steps)).toBe(4);
    });

    it('ends with every step done', () => {
        const steps = getDisplayedSteps(
            buildView({ status: 'done', phase: 'launch' }),
        );
        expect(steps.every(({ state }) => state === 'done')).toBe(true);
        expect(getCurrentRank(steps)).toBe(4);
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
        expect(getCurrentRank(steps)).toBe(1);
    });
});
