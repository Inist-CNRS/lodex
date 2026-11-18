import { getSiteModelLaunchView, getSiteModelView } from './siteModel';
import { findCatalogModel } from './catalogModel';
import { readLaunchSteps } from './siteGeneration/wizardGeneration';

jest.mock('./catalogModel', () => ({ findCatalogModel: jest.fn() }));
jest.mock('./siteGeneration/wizardGeneration', () => ({
    readLaunchSteps: jest.fn(),
}));

describe('getSiteModelView', () => {
    const forget = jest.fn();
    const findCurrent = jest.fn();
    const ctx: any = {
        siteModel: { findCurrent, forget },
        catalogModels: ['models'],
        availableLoaders: ['csv'],
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns null when the site has no remembered model', async () => {
        findCurrent.mockResolvedValue(null);
        expect(await getSiteModelView(ctx)).toBeNull();
    });

    it('returns null without forgetting when the model left the catalog', async () => {
        findCurrent.mockResolvedValue({ modelId: 'gone' });
        (findCatalogModel as jest.Mock).mockReturnValue(null);
        expect(await getSiteModelView(ctx)).toBeNull();
        expect(findCatalogModel).toHaveBeenCalledWith(['models'], 'gone', [
            'csv',
        ]);
        expect(forget).not.toHaveBeenCalled();
    });

    it('returns the model id without reading the launch steps', async () => {
        findCurrent.mockResolvedValue({ modelId: 'm' });
        (findCatalogModel as jest.Mock).mockReturnValue({ id: 'm' });
        expect(await getSiteModelView(ctx)).toEqual({ modelId: 'm' });
        expect(readLaunchSteps).not.toHaveBeenCalled();
    });
});

describe('getSiteModelLaunchView', () => {
    const findCurrent = jest.fn();
    const ctx: any = {
        siteModel: { findCurrent },
        catalogModels: ['models'],
        availableLoaders: ['csv'],
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns null when the site has no remembered model', async () => {
        findCurrent.mockResolvedValue(null);
        expect(await getSiteModelLaunchView(ctx)).toBeNull();
        expect(readLaunchSteps).not.toHaveBeenCalled();
    });

    it('returns null when the model left the catalog', async () => {
        findCurrent.mockResolvedValue({ modelId: 'gone' });
        (findCatalogModel as jest.Mock).mockReturnValue(null);
        expect(await getSiteModelLaunchView(ctx)).toBeNull();
        expect(readLaunchSteps).not.toHaveBeenCalled();
    });

    it('counts the launch steps by type', async () => {
        findCurrent.mockResolvedValue({ modelId: 'm' });
        (findCatalogModel as jest.Mock).mockReturnValue({
            id: 'm',
            launchOrder: [],
        });
        (readLaunchSteps as jest.Mock).mockResolvedValue([
            { type: 'enrichment' },
            { type: 'precomputed' },
            { type: 'enrichment' },
        ]);
        expect(await getSiteModelLaunchView(ctx)).toEqual({
            enrichment: 2,
            precomputed: 1,
        });
        expect(readLaunchSteps).toHaveBeenCalledWith(ctx, []);
    });

    it('counts zero when there is no step', async () => {
        findCurrent.mockResolvedValue({ modelId: 'm' });
        (findCatalogModel as jest.Mock).mockReturnValue({ id: 'm' });
        (readLaunchSteps as jest.Mock).mockResolvedValue([]);
        expect(await getSiteModelLaunchView(ctx)).toEqual({
            enrichment: 0,
            precomputed: 0,
        });
    });
});
