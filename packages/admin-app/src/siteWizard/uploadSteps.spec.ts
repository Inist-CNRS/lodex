import type { CatalogModel } from '@lodex/common';
import { getDataAddUploadView, getUploadView } from './uploadSteps';

const waiting = (
    name: string,
    type: 'enrichment' | 'precomputed',
    position: number,
) => ({ name, type, position, state: 'waiting' });

describe('getUploadView', () => {
    const siteInfo = { siteName: '', siteDescription: '', autoPublish: false };

    it('shows the launch steps of the model, waiting and in run order', () => {
        const view = getUploadView(
            {
                id: 'theses-fr',
                launchOrder: [
                    { name: 'xml', type: 'enrichment', position: 2 },
                    { name: 'cluster', type: 'precomputed', position: 1 },
                ],
            } as CatalogModel,
            siteInfo,
        );
        expect(view.steps).toEqual([
            waiting('cluster', 'precomputed', 1),
            waiting('xml', 'enrichment', 2),
        ]);
    });

    it('has no launch steps for a model without launch order', () => {
        const view = getUploadView(
            { id: 'openalex' } as CatalogModel,
            siteInfo,
        );
        expect(view.steps).toEqual([]);
    });
});

describe('getDataAddUploadView', () => {
    it('estimates the steps to relaunch', () => {
        const view = getDataAddUploadView(
            {
                enrichment: 3,
                precomputed: 0,
                steps: [
                    { name: 'c', type: 'enrichment', position: 3 },
                    { name: 'a', type: 'enrichment', position: 1 },
                    { name: 'b', type: 'enrichment', position: 2 },
                ],
            },
            { relaunch: true, autoPublish: false },
        );
        expect(view.kind).toBe('addData');
        expect(view.phase).toBe('data');
        expect(view.status).toBe('running');
        expect(view.launch?.enrichment.total).toBe(3);
        expect(view.launch?.precomputed.total).toBe(0);
        expect(view.steps).toEqual([
            waiting('a', 'enrichment', 1),
            waiting('b', 'enrichment', 2),
            waiting('c', 'enrichment', 3),
        ]);
        expect(view.publication).toBeUndefined();
    });

    it('has no launch step without relaunch', () => {
        const view = getDataAddUploadView(
            {
                enrichment: 1,
                precomputed: 0,
                steps: [{ name: 'a', type: 'enrichment', position: 1 }],
            },
            { relaunch: false, autoPublish: false },
        );
        expect(view.launch).toBeNull();
        expect(view.steps).toEqual([]);
    });

    it('has no launch step when there is nothing to relaunch', () => {
        const view = getDataAddUploadView(
            { enrichment: 0, precomputed: 0, steps: [] },
            { relaunch: true, autoPublish: false },
        );
        expect(view.launch).toBeNull();
    });

    it('shows the launch step without counts when they are unknown', () => {
        const view = getDataAddUploadView(null, {
            relaunch: true,
            autoPublish: false,
        });
        expect(view.launch).toEqual({
            enrichment: { done: 0, error: 0, total: 0 },
            precomputed: { done: 0, error: 0, total: 0 },
        });
    });

    it('has no launch step without relaunch when the counts are unknown', () => {
        const view = getDataAddUploadView(null, {
            relaunch: false,
            autoPublish: false,
        });
        expect(view.launch).toBeNull();
    });

    it('waits to publish with autoPublish', () => {
        const view = getDataAddUploadView(
            { enrichment: 0, precomputed: 0, steps: [] },
            { relaunch: false, autoPublish: true },
        );
        expect(view.publication).toEqual({ state: 'waiting' });
    });
});
