import { startDataAddGeneration } from './dataAddGeneration';

jest.mock('../catalogModel', () => ({
    findCatalogModel: (models: any[], id: string) =>
        models.find((model) => model.id === id) ?? null,
}));

const mockReadLaunchSteps = jest.fn();
jest.mock('./wizardGeneration', () => ({
    readLaunchSteps: (...args: unknown[]) => mockReadLaunchSteps(...args),
}));

const launchOrder = [{ name: 'a', type: 'enrichment', position: 0 }];
const catalogModels = [
    {
        id: 'm',
        loader: 'csv',
        importTypes: ['file', 'url'],
        url: 'https://h/m.tar',
        launchOrder,
    },
];
const steps = [{ type: 'enrichment', name: 'a', position: 0 }];

describe('startDataAddGeneration', () => {
    let ctx: any;
    beforeEach(() => {
        mockReadLaunchSteps.mockReset().mockResolvedValue(steps);
        ctx = {
            catalogModels,
            availableLoaders: ['csv'],
            siteModel: {
                findCurrent: jest.fn().mockResolvedValue({ modelId: 'm' }),
            },
            siteGeneration: {
                findCurrent: jest.fn().mockResolvedValue(null),
                startDataAdd: jest.fn().mockResolvedValue({ runId: 'run-1' }),
            },
        };
    });
    const choice = { relaunch: true, autoPublish: false };
    const request = { loaderName: 'csv', importType: 'file' as const };

    it('refuses a site without memory', async () => {
        ctx.siteModel.findCurrent.mockResolvedValue(null);
        expect(await startDataAddGeneration(ctx, choice, request, 'j')).toEqual(
            {
                status: 409,
                error: 'not_simplified',
            },
        );
        expect(ctx.siteGeneration.startDataAdd).not.toHaveBeenCalled();
    });

    it('refuses a model out of the catalog', async () => {
        ctx.siteModel.findCurrent.mockResolvedValue({ modelId: 'gone' });
        expect(await startDataAddGeneration(ctx, choice, request, 'j')).toEqual(
            {
                status: 409,
                error: 'not_simplified',
            },
        );
    });

    it('refuses another loader than the one of the model', async () => {
        expect(
            await startDataAddGeneration(
                ctx,
                choice,
                { ...request, loaderName: 'json' },
                'j',
            ),
        ).toEqual({
            status: 400,
            error: 'loader_not_allowed',
        });
    });

    it.each(['running', 'publishing', 'error', 'stopping'])(
        'refuses while a generation is %s',
        async (status) => {
            ctx.siteGeneration.findCurrent.mockResolvedValue({ status });
            expect(
                await startDataAddGeneration(ctx, choice, request, 'j'),
            ).toEqual({ status: 409, error: 'site_generation_in_progress' });
            expect(ctx.siteGeneration.startDataAdd).not.toHaveBeenCalled();
        },
    );

    it.each(['done', 'stopped'])(
        'starts after a %s generation',
        async (status) => {
            ctx.siteGeneration.findCurrent.mockResolvedValue({ status });
            expect(
                await startDataAddGeneration(ctx, choice, request, 'j'),
            ).toEqual({
                runId: 'run-1',
            });
        },
    );

    it('gives the launch steps when relaunching', async () => {
        await startDataAddGeneration(ctx, choice, request, 'j');
        expect(mockReadLaunchSteps).toHaveBeenCalledWith(ctx, launchOrder);
        expect(ctx.siteGeneration.startDataAdd).toHaveBeenCalledWith({
            modelId: 'm',
            importJobId: 'j',
            autoPublish: false,
            steps,
            estimate: { enrichment: 1, precomputed: 0 },
        });
    });

    it.each([null, undefined])(
        'accepts a customLoader of %s',
        async (customLoader) => {
            expect(
                await startDataAddGeneration(
                    ctx,
                    choice,
                    { ...request, customLoader },
                    'j',
                ),
            ).toEqual({ runId: 'run-1' });
        },
    );

    it('refuses a custom loader', async () => {
        expect(
            await startDataAddGeneration(
                ctx,
                choice,
                { ...request, customLoader: 'x => x' },
                'j',
            ),
        ).toEqual({ status: 400, error: 'loader_not_allowed' });
        expect(ctx.siteGeneration.startDataAdd).not.toHaveBeenCalled();
    });

    it('refuses an import type out of the ones of the model', async () => {
        expect(
            await startDataAddGeneration(
                ctx,
                choice,
                { ...request, importType: 'text' },
                'j',
            ),
        ).toEqual({ status: 400, error: 'import_type_not_allowed' });
        expect(ctx.siteGeneration.startDataAdd).not.toHaveBeenCalled();
    });

    it('accepts another import type of the model', async () => {
        expect(
            await startDataAddGeneration(
                ctx,
                choice,
                { ...request, importType: 'url' },
                'j',
            ),
        ).toEqual({ runId: 'run-1' });
    });

    it('gives no step without relaunch, and passes autoPublish', async () => {
        const result = await startDataAddGeneration(
            ctx,
            { relaunch: false, autoPublish: true },
            request,
            'j',
        );
        expect(mockReadLaunchSteps).not.toHaveBeenCalled();
        expect(ctx.siteGeneration.startDataAdd).toHaveBeenCalledWith({
            modelId: 'm',
            importJobId: 'j',
            autoPublish: true,
            steps: [],
            estimate: undefined,
        });
        expect(result).toEqual({ runId: 'run-1' });
    });
});
