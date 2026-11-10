import fetch from '@lodex/frontend-common/fetch/fetch';
import { loadDatasetFile } from '@lodex/frontend-common/utils/loadFile';
import { clearDataset, uploadDataset } from './uploadDataset';

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
            undefined,
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

    it('clears the dataset, keeping the model', async () => {
        await clearDataset();
        const request = (fetch as jest.Mock).mock.calls[0][0];
        expect(request.url).toBe('/api/upload/clear');
        expect(request.method).toBe('DELETE');
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
