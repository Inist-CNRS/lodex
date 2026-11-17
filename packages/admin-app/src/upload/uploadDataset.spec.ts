import fetch from '@lodex/frontend-common/fetch/fetch';
import { loadDatasetFile } from '@lodex/frontend-common/utils/loadFile';
import { uploadDataset } from './uploadDataset';

jest.mock('@lodex/frontend-common/fetch/fetch', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('@lodex/frontend-common/utils/loadFile', () => ({
    loadDatasetFile: jest.fn(),
}));
jest.mock('@lodex/frontend-common/getUserSessionStorageInfo', () => ({
    getUserSessionStorageInfo: () => ({ token: 'tok' }),
}));

describe('uploadDataset', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockResolvedValue({ response: {} });
        (loadDatasetFile as jest.Mock).mockResolvedValue('ok');
    });

    it('uploads a file with loadDatasetFile', async () => {
        const file = new File(['a'], 'a.csv');
        await uploadDataset({ type: 'file', file }, 'csv');
        expect(loadDatasetFile).toHaveBeenCalledWith(
            file,
            'tok',
            'csv',
            null,
            expect.not.objectContaining({ query: expect.anything() }),
        );
        expect(fetch).not.toHaveBeenCalled();
    });

    it('passes the progress and cancel options to the file upload', async () => {
        const file = new File(['a'], 'a.csv');
        const options = {
            onProgress: jest.fn(),
            signal: new AbortController().signal,
        };
        await uploadDataset({ type: 'file', file }, 'csv', options);
        expect(loadDatasetFile).toHaveBeenCalledWith(
            file,
            'tok',
            'csv',
            null,
            options,
        );
    });

    it('sends the choice as query fields with a file', async () => {
        const file = new File(['a'], 'a.csv');
        await uploadDataset({ type: 'file', file }, 'csv', {
            choice: {
                modelId: 'a',
                siteName: 'Site',
                siteDescription: 'Desc',
                theme: 'dark',
            },
        });
        expect(loadDatasetFile).toHaveBeenCalledWith(
            file,
            'tok',
            'csv',
            null,
            expect.objectContaining({
                query: {
                    modelId: 'a',
                    siteName: 'Site',
                    siteDescription: 'Desc',
                    theme: 'dark',
                },
            }),
        );
    });

    it('leaves out the choice fields not given with a file', async () => {
        const file = new File(['a'], 'a.csv');
        await uploadDataset({ type: 'file', file }, 'csv', {
            choice: { modelId: 'a', siteName: undefined },
        });
        expect((loadDatasetFile as jest.Mock).mock.calls[0][4].query).toEqual({
            modelId: 'a',
        });
    });

    it.each([
        ['url', { type: 'url' as const, url: 'http://x/a.csv' }],
        ['text', { type: 'text' as const, text: 'a,b' }],
    ])('sends the choice with a %s', async (_, source) => {
        const choice = { modelId: 'a', siteName: 'Site', theme: 'dark' };
        await uploadDataset(source, 'csv', { choice });
        const request = (fetch as jest.Mock).mock.calls[0][0];
        expect(JSON.parse(request.body).siteGeneration).toEqual(choice);
    });

    it('uploads an url', async () => {
        await uploadDataset({ type: 'url', url: 'http://x/a.csv' }, 'csv');
        const request = (fetch as jest.Mock).mock.calls[0][0];
        expect(request.url).toBe('/api/upload/url');
        expect(JSON.parse(request.body)).toMatchObject({
            url: 'http://x/a.csv',
            loaderName: 'csv',
        });
    });

    it('uploads a text', async () => {
        await uploadDataset({ type: 'text', text: 'a,b' }, 'csv');
        const request = (fetch as jest.Mock).mock.calls[0][0];
        expect(request.url).toBe('/api/upload/text');
        expect(JSON.parse(request.body)).toMatchObject({
            text: 'a,b',
            loaderName: 'csv',
        });
    });

    it('rejects when fetch returns an error', async () => {
        (fetch as jest.Mock).mockResolvedValue({ error: new Error('boom') });
        await expect(
            uploadDataset({ type: 'text', text: 'a' }, 'csv'),
        ).rejects.toThrow('boom');
    });
});
