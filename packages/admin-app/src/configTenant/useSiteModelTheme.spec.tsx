import { type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { Wrapper, getStore } from '../test-utils';
import { getSiteModel } from '../api/siteModel';
import { SITE_MODEL_QUERY_KEY } from '../upload/useSiteModel';
import { useSiteModelTheme } from './useSiteModelTheme';

jest.mock('../api/siteModel', () => ({ getSiteModel: jest.fn() }));
jest.mock('../../../../src/app/custom/models/models-catalog.json', () => [
    {
        id: 'a',
        url: 'http://a.tar',
        loader: 'la',
        importTypes: ['file'],
        theme: 'nougat',
    },
    { id: 'b', url: 'http://b.tar', loader: 'lb', importTypes: ['file'] },
]);

describe('useSiteModelTheme', () => {
    // no loaders in the store: the configuration page does not load them
    const renderSiteModelTheme = () => {
        const client = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        const { result } = renderHook(() => useSiteModelTheme(), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <Wrapper store={getStore({})} client={client}>
                    {children}
                </Wrapper>
            ),
        });
        // resolves once the site model request succeeded or failed
        const settled = () =>
            waitFor(() =>
                expect(
                    client.getQueryState(SITE_MODEL_QUERY_KEY)?.status,
                ).not.toBe('pending'),
            );
        return { result, settled };
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the theme of the remembered model', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({
            siteModel: { modelId: 'a' },
        });
        const { result } = renderSiteModelTheme();
        await waitFor(() => expect(result.current).toBe('nougat'));
    });

    it('returns undefined without memory', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({ siteModel: null });
        const { result, settled } = renderSiteModelTheme();
        await settled();
        expect(result.current).toBeUndefined();
    });

    it('returns undefined for a model without theme', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({
            siteModel: { modelId: 'b' },
        });
        const { result, settled } = renderSiteModelTheme();
        await settled();
        expect(result.current).toBeUndefined();
    });

    it('returns undefined for a model missing from the catalog', async () => {
        (getSiteModel as jest.Mock).mockResolvedValue({
            siteModel: { modelId: 'zz' },
        });
        const { result, settled } = renderSiteModelTheme();
        await settled();
        expect(result.current).toBeUndefined();
    });

    // the memory changes outside of this page (manual model import, clear)
    describe('with a cached site model', () => {
        const renderWithCache = () => {
            const client = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            client.setQueryData(SITE_MODEL_QUERY_KEY, {
                siteModel: { modelId: 'a' },
            });
            const { result } = renderHook(() => useSiteModelTheme(), {
                wrapper: ({ children }: { children: ReactNode }) => (
                    <Wrapper store={getStore({})} client={client}>
                        {children}
                    </Wrapper>
                ),
            });
            return { result, client };
        };

        it('ignores the cached model until the request is done', () => {
            (getSiteModel as jest.Mock).mockReturnValue(new Promise(() => {}));
            const { result } = renderWithCache();
            expect(result.current).toBeUndefined();
        });

        it('ignores the cached model when the request fails', async () => {
            (getSiteModel as jest.Mock).mockRejectedValue(new Error('boom'));
            const { result, client } = renderWithCache();
            await waitFor(() =>
                expect(client.getQueryState(SITE_MODEL_QUERY_KEY)?.status).toBe(
                    'error',
                ),
            );
            expect(result.current).toBeUndefined();
        });
    });

    it('returns undefined when the request fails', async () => {
        (getSiteModel as jest.Mock).mockRejectedValue(new Error('boom'));
        const { result, settled } = renderSiteModelTheme();
        await settled();
        expect(result.current).toBeUndefined();
    });
});
