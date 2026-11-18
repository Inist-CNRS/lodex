import { type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { Wrapper, getStore } from '../test-utils';
import { getSiteModelLaunch } from '../api/siteModel';
import { useSiteModelLaunch } from './useSiteModelLaunch';

jest.mock('../api/siteModel', () => ({ getSiteModelLaunch: jest.fn() }));

describe('useSiteModelLaunch', () => {
    const renderLaunch = (enabled: boolean) => {
        // the default client of the app retries: the hook must not
        const client = new QueryClient();
        return renderHook(() => useSiteModelLaunch(enabled), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <Wrapper store={getStore({})} client={client}>
                    {children}
                </Wrapper>
            ),
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not fetch while disabled', async () => {
        const { result } = renderLaunch(false);
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(getSiteModelLaunch).not.toHaveBeenCalled();
        expect(result.current).toEqual({
            isLoading: false,
            isError: false,
            launch: null,
        });
    });

    it('loads the counts once enabled', async () => {
        (getSiteModelLaunch as jest.Mock).mockResolvedValue({
            launch: { enrichment: 2, precomputed: 1 },
        });
        const { result } = renderLaunch(true);
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.launch).toEqual({
            enrichment: 2,
            precomputed: 1,
        });
        expect(result.current.isError).toBe(false);
    });

    it('has no counts when the site has no model', async () => {
        (getSiteModelLaunch as jest.Mock).mockResolvedValue({ launch: null });
        const { result } = renderLaunch(true);
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.launch).toBeNull();
    });

    it('reports a failure at once, without retry', async () => {
        (getSiteModelLaunch as jest.Mock).mockRejectedValue(new Error('boom'));
        const { result } = renderLaunch(true);
        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.isLoading).toBe(false);
        expect(result.current.launch).toBeNull();
        expect(getSiteModelLaunch).toHaveBeenCalledTimes(1);
    });
});
