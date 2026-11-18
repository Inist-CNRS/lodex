import { type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { type CatalogModel } from '@lodex/common';
import { Wrapper, getStore } from '../test-utils';
import { getSiteModel } from '../api/siteModel';
import { useDisplayableModels } from '../siteWizard/useDisplayableModels';
import { SITE_MODEL_QUERY_KEY, useSiteModel } from './useSiteModel';

jest.mock('../api/siteModel', () => ({ getSiteModel: jest.fn() }));
jest.mock('../siteWizard/useDisplayableModels', () => ({
    useDisplayableModels: jest.fn(),
}));

const model: CatalogModel = {
    id: 'a',
    url: 'http://a.tar',
    loader: 'la',
    importTypes: ['file'],
};

describe('useSiteModel', () => {
    const loadedState = {
        loaders: {
            error: false,
            loading: false,
            loaded: true,
            loaders: [{ name: 'la' }],
        },
    };
    const renderSiteModel = (
        initialState: object = loadedState,
        client = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        }),
    ) =>
        renderHook(() => useSiteModel(), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <Wrapper store={getStore(initialState)} client={client}>
                    {children}
                </Wrapper>
            ),
        });

    beforeEach(() => {
        jest.clearAllMocks();
        (useDisplayableModels as jest.Mock).mockReturnValue([model]);
    });

    it('returns null without memory', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({ siteModel: null });
        const { result } = renderSiteModel();
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.siteModel).toBeNull();
    });

    it('returns the model of a known model', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({
            siteModel: { modelId: 'a' },
        });
        const { result } = renderSiteModel();
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.siteModel).toEqual({ model });
    });

    it('returns null for a model missing from the catalog', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({
            siteModel: { modelId: 'zzz' },
        });
        const { result } = renderSiteModel();
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.siteModel).toBeNull();
    });

    it('is loading while the loaders are not loaded', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({ siteModel: null });
        const { result } = renderSiteModel({});
        await waitFor(() => expect(getSiteModel).toHaveBeenCalled());
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(result.current.isLoading).toBe(true);
    });

    it('stops loading when the loaders failed to load', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({ siteModel: null });
        const { result } = renderSiteModel({
            loaders: {
                error: 'boom',
                loading: false,
                loaded: false,
                loaders: [],
            },
        });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.siteModel).toBeNull();
    });

    it('returns null when the site model query fails', async () => {
        (getSiteModel as jest.Mock).mockRejectedValue(new Error('boom'));
        const { result } = renderSiteModel();
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.siteModel).toBeNull();
    });

    it('settles at once when the loaders loaded an empty list', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({ siteModel: null });
        const { result } = renderSiteModel({
            loaders: {
                error: false,
                loading: false,
                loaded: true,
                loaders: [],
            },
        });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.siteModel).toBeNull();
    });

    it('does not retry a failing query', async () => {
        (getSiteModel as jest.Mock).mockRejectedValue(new Error('boom'));
        // the default client of the app retries: the hook must not
        const client = new QueryClient();
        const { result } = renderSiteModel(loadedState, client);
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(getSiteModel).toHaveBeenCalledTimes(1);
    });

    it('does not let a cached value decide while the mount fetch is pending', async () => {
        const client = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        client.setQueryData(SITE_MODEL_QUERY_KEY, {
            siteModel: { modelId: 'a' },
        });
        let resolve: (value: unknown) => void = () => {};
        (getSiteModel as jest.Mock).mockReturnValue(
            new Promise((r) => {
                resolve = r;
            }),
        );
        const { result } = renderSiteModel(loadedState, client);
        await waitFor(() => expect(getSiteModel).toHaveBeenCalled());
        expect(result.current.isLoading).toBe(true);

        resolve({ siteModel: null });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.siteModel).toBeNull();
    });
});
