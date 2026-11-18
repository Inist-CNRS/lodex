import { getDataAddUploadView } from './uploadSteps';

describe('getDataAddUploadView', () => {
    it('estimates the steps to relaunch', () => {
        const view = getDataAddUploadView(
            { enrichment: 3, precomputed: 0 },
            { relaunch: true, autoPublish: false },
        );
        expect(view.kind).toBe('addData');
        expect(view.phase).toBe('data');
        expect(view.status).toBe('running');
        expect(view.launch?.enrichment.total).toBe(3);
        expect(view.launch?.precomputed.total).toBe(0);
        expect(view.publication).toBeUndefined();
    });

    it('has no launch step without relaunch', () => {
        const view = getDataAddUploadView(
            { enrichment: 3, precomputed: 1 },
            { relaunch: false, autoPublish: false },
        );
        expect(view.launch).toBeNull();
    });

    it('has no launch step when there is nothing to relaunch', () => {
        const view = getDataAddUploadView(
            { enrichment: 0, precomputed: 0 },
            { relaunch: true, autoPublish: false },
        );
        expect(view.launch).toBeNull();
    });

    it('has no launch step when the counts are unknown', () => {
        const view = getDataAddUploadView(null, {
            relaunch: true,
            autoPublish: false,
        });
        expect(view.launch).toBeNull();
    });

    it('waits to publish with autoPublish', () => {
        const view = getDataAddUploadView(
            { enrichment: 0, precomputed: 0 },
            { relaunch: false, autoPublish: true },
        );
        expect(view.publication).toEqual({ state: 'waiting' });
    });
});
