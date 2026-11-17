import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient } from '@tanstack/react-query';
import {
    toast,
    type SiteGenerationStepState,
    type SiteGenerationView,
} from '@lodex/common';
import { loginSuccess } from '@lodex/frontend-common/user/reducer';
import { I18NContext } from '@lodex/frontend-common/i18n/I18NContext';
import { getStore, Wrapper } from '../test-utils';
import {
    getSiteGeneration,
    relaunchSiteGeneration,
    stopSiteGeneration,
} from '../api/siteGeneration';
import { LOAD_ENRICHMENTS } from '../enrichment';
import { LOAD_PRECOMPUTED } from '../precomputed';
import { LOAD_PARSING_RESULT } from '../parsing';
import { LOAD_PUBLICATION } from '../publication';
import { SiteGenerationDialog } from './SiteGenerationDialog';
import {
    getRefetchInterval,
    SITE_GENERATION_QUERY_KEY,
} from './useSiteGeneration';

jest.mock('@lodex/common', () => ({
    ...jest.requireActual('@lodex/common'),
    toast: jest.fn(),
}));
jest.mock('../api/siteGeneration', () => ({
    getSiteGeneration: jest.fn(),
    relaunchSiteGeneration: jest.fn(),
    stopSiteGeneration: jest.fn(),
}));

const buildGeneration = (
    status: SiteGenerationView['status'],
    states: SiteGenerationStepState[] = [],
    message?: string,
): SiteGenerationView => ({
    status,
    steps: states.map((state, index) => ({
        name: `step${index}`,
        type: index % 2 ? 'enrichment' : 'precomputed',
        position: index,
        state,
        ...(state === 'error' ? { message } : {}),
    })),
});

describe('SiteGenerationDialog', () => {
    let dispatched: string[];
    let client: QueryClient;

    const renderDialog = (
        generation: SiteGenerationView | null,
        {
            isLoggedIn = true,
            translate,
        }: {
            isLoggedIn?: boolean;
            translate?: (label: string, options?: unknown) => string;
        } = {},
    ) => {
        (getSiteGeneration as jest.Mock).mockResolvedValue({ generation });
        const store = getStore();
        const login = () =>
            store.dispatch(loginSuccess({ token: 'token', role: 'admin' }));
        if (isLoggedIn) {
            login();
        }
        jest.spyOn(store, 'dispatch').mockImplementation((action) => {
            dispatched.push(action.type);
            return action;
        });
        const result = render(<SiteGenerationDialog />, {
            wrapper: ({ children }) => (
                <Wrapper store={store} client={client}>
                    {translate ? (
                        <I18NContext.Provider
                            value={{
                                translate,
                                locale: 'en',
                                setLanguage: () => {},
                            }}
                        >
                            {children}
                        </I18NContext.Provider>
                    ) : (
                        children
                    )}
                </Wrapper>
            ),
        });
        return {
            ...result,
            login: () => {
                (store.dispatch as jest.Mock).mockRestore();
                act(() => {
                    login();
                });
            },
        };
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // the store persists the logged-in user in the local storage
        window.localStorage.clear();
        dispatched = [];
        client = new QueryClient({
            // the hook sets its own retry: retry at once in tests
            defaultOptions: { queries: { retry: false, retryDelay: 0 } },
        });
        (relaunchSiteGeneration as jest.Mock).mockResolvedValue(undefined);
        (stopSiteGeneration as jest.Mock).mockResolvedValue(undefined);
    });

    it.each([
        ['null', null],
        ['done', buildGeneration('done', ['done'])],
        ['stopped', buildGeneration('stopped', ['done', 'waiting'])],
    ])('shows nothing for %s', async (_name, generation) => {
        renderDialog(generation);
        await waitFor(() => expect(getSiteGeneration).toHaveBeenCalled());
        await waitFor(() =>
            expect(
                client.isFetching({ queryKey: SITE_GENERATION_QUERY_KEY }),
            ).toBe(0),
        );
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('shows the progress of a running generation', async () => {
        const states: SiteGenerationStepState[] = [
            'done',
            'done',
            'done',
            'running',
            ...Array<SiteGenerationStepState>(7).fill('waiting'),
        ];
        renderDialog(buildGeneration('running', states));
        expect(
            await screen.findByText('site_generation_title'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('site_generation_progress+{"done":3,"total":11}'),
        ).toBeInTheDocument();
        for (let i = 0; i < 11; i++) {
            expect(screen.getByText(`step${i}`)).toBeInTheDocument();
        }
        expect(
            screen.getAllByText(/site_generation_type_enrichment/).length,
        ).toBeGreaterThan(0);
        expect(
            screen.getAllByText(/site_generation_type_precomputed/).length,
        ).toBeGreaterThan(0);
        expect(
            screen.queryByText('site_generation_relaunch'),
        ).not.toBeInTheDocument();
    });

    it('shows the error and relaunches the generation', async () => {
        renderDialog(
            buildGeneration(
                'error',
                ['done', 'error'],
                'precomputed_no_response',
            ),
        );
        expect(
            await screen.findByText(/precomputed_no_response/),
        ).toBeInTheDocument();
        await userEvent.click(screen.getByText('site_generation_relaunch'));
        await waitFor(() => expect(relaunchSiteGeneration).toHaveBeenCalled());
    });

    it('asks for a confirmation before stopping', async () => {
        renderDialog(buildGeneration('running', ['running']));
        await userEvent.click(await screen.findByText('site_generation_stop'));
        expect(
            await screen.findByText('site_generation_stop_title'),
        ).toBeInTheDocument();
        expect(screen.queryByRole('link')).toBeNull();
        expect(stopSiteGeneration).not.toHaveBeenCalled();
        await userEvent.click(screen.getByText('confirm'));
        await waitFor(() => expect(stopSiteGeneration).toHaveBeenCalled());
    });

    it('shows that the stop is in progress until the API answers', async () => {
        let answer: () => void = () => {};
        (stopSiteGeneration as jest.Mock).mockReturnValue(
            new Promise<void>((resolve) => {
                answer = resolve;
            }),
        );
        renderDialog(buildGeneration('running', ['running']));
        await userEvent.click(await screen.findByText('site_generation_stop'));
        expect(screen.queryByText('site_generation_stopping')).toBeNull();
        await userEvent.click(await screen.findByText('confirm'));
        expect(
            await screen.findByText('site_generation_stopping'),
        ).toBeInTheDocument();
        expect(screen.getByText('confirm').closest('button')).toBeDisabled();
        answer();
        await waitFor(() =>
            expect(screen.queryByText('site_generation_stopping')).toBeNull(),
        );
    });

    it('gives the support contact when a step is in error', async () => {
        renderDialog(buildGeneration('error', ['error'], 'oops'));
        await userEvent.click(await screen.findByText('site_generation_stop'));
        expect(await screen.findByRole('link')).toHaveAttribute(
            'href',
            'mailto:support-lodex@listes.istex.fr',
        );
    });

    it('reloads the admin data and closes once the generation is done', async () => {
        renderDialog(buildGeneration('running', ['running']));
        await screen.findByText('site_generation_title');
        (getSiteGeneration as jest.Mock).mockResolvedValue({
            generation: buildGeneration('done', ['done']),
        });
        await client.invalidateQueries({ queryKey: SITE_GENERATION_QUERY_KEY });
        await waitFor(() =>
            expect(screen.queryByText('site_generation_title')).toBeNull(),
        );
        expect(dispatched).toEqual(
            expect.arrayContaining([
                LOAD_ENRICHMENTS,
                LOAD_PRECOMPUTED,
                LOAD_PARSING_RESULT,
            ]),
        );
    });

    it('reloads the admin data when the generation is stopped', async () => {
        renderDialog(buildGeneration('error', ['error'], 'oops'));
        await screen.findByText('site_generation_title');
        (getSiteGeneration as jest.Mock).mockResolvedValue({
            generation: buildGeneration('stopped', ['done']),
        });
        await client.invalidateQueries({ queryKey: SITE_GENERATION_QUERY_KEY });
        await waitFor(() =>
            expect(screen.queryByText('site_generation_title')).toBeNull(),
        );
        expect(dispatched).toEqual(
            expect.arrayContaining([
                LOAD_ENRICHMENTS,
                LOAD_PRECOMPUTED,
                LOAD_PARSING_RESULT,
            ]),
        );
    });

    describe('publication at the end', () => {
        const withPublication = (
            generation: SiteGenerationView,
            publication: SiteGenerationView['publication'],
        ) => ({ ...generation, publication });

        it('shows the publication after the steps, outside of the count', async () => {
            renderDialog(
                withPublication(buildGeneration('running', ['running']), {
                    state: 'waiting',
                }),
            );
            expect(
                await screen.findByText('site_generation_publication'),
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    'site_generation_progress+{"done":0,"total":1}',
                ),
            ).toBeInTheDocument();
        });

        it('stays open while publishing and can stop the publication', async () => {
            renderDialog(
                withPublication(buildGeneration('publishing', ['done']), {
                    state: 'running',
                }),
            );
            expect(
                await screen.findByText('site_generation_publication'),
            ).toBeInTheDocument();
            expect(
                screen.getByText('site_generation_running'),
            ).toBeInTheDocument();
            expect(
                getRefetchInterval(
                    { generation: buildGeneration('publishing', ['done']) },
                    { state: { status: 'success', error: null } },
                ),
            ).toBe(5_000);
            await userEvent.click(screen.getByText('site_generation_stop'));
            expect(
                await screen.findByText(
                    'site_generation_stop_publication_description',
                ),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByText('confirm'));
            await waitFor(() => expect(stopSiteGeneration).toHaveBeenCalled());
        });

        it('shows a failed publication and relaunches it', async () => {
            renderDialog(
                withPublication(buildGeneration('error', ['done']), {
                    state: 'error',
                    message: 'site_generation_publication_lost',
                }),
            );
            expect(
                await screen.findByText('site_generation_publication_lost'),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByText('site_generation_relaunch'));
            await waitFor(() =>
                expect(relaunchSiteGeneration).toHaveBeenCalled(),
            );
        });

        it('reloads the publication once published', async () => {
            renderDialog(
                withPublication(buildGeneration('publishing', ['done']), {
                    state: 'running',
                }),
            );
            await screen.findByText('site_generation_title');
            (getSiteGeneration as jest.Mock).mockResolvedValue({
                generation: withPublication(buildGeneration('done', ['done']), {
                    state: 'done',
                }),
            });
            await client.invalidateQueries({
                queryKey: SITE_GENERATION_QUERY_KEY,
            });
            await waitFor(() =>
                expect(screen.queryByText('site_generation_title')).toBeNull(),
            );
            expect(dispatched).toEqual(
                expect.arrayContaining([LOAD_PUBLICATION, LOAD_ENRICHMENTS]),
            );
        });
    });

    it('shows a toast when relaunching fails', async () => {
        (relaunchSiteGeneration as jest.Mock).mockRejectedValue(
            new Error('boom'),
        );
        renderDialog(buildGeneration('error', ['error'], 'oops'));
        await userEvent.click(
            await screen.findByText('site_generation_relaunch'),
        );
        await waitFor(() =>
            expect(toast).toHaveBeenCalledWith(
                'site_generation_action_error+{"error":"boom"}',
                { type: 'error' },
            ),
        );
    });

    it('shows a toast when stopping fails and closes the confirmation', async () => {
        (stopSiteGeneration as jest.Mock).mockRejectedValue(new Error('boom'));
        renderDialog(buildGeneration('running', ['running']));
        await userEvent.click(await screen.findByText('site_generation_stop'));
        await userEvent.click(await screen.findByText('confirm'));
        await waitFor(() => expect(toast).toHaveBeenCalled());
        await waitFor(() =>
            expect(screen.queryByText('site_generation_stop_title')).toBeNull(),
        );
    });
    it('waits for an admin login before fetching the generation', async () => {
        const { login } = renderDialog(
            buildGeneration('running', ['running']),
            {
                isLoggedIn: false,
            },
        );
        // let a fetch that would wrongly start settle
        await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
        expect(getSiteGeneration).not.toHaveBeenCalled();
        expect(screen.queryByRole('dialog')).toBeNull();

        login();
        expect(
            await screen.findByText('site_generation_title'),
        ).toBeInTheDocument();
        expect(getSiteGeneration).toHaveBeenCalled();
    });

    it.each([401, 403])(
        'hides the progress when the session is refused (%s)',
        async (code) => {
            renderDialog(buildGeneration('running', ['running']));
            await screen.findByText('site_generation_title');
            (getSiteGeneration as jest.Mock).mockRejectedValue(
                Object.assign(new Error('unauthorized'), { code }),
            );
            await client.invalidateQueries({
                queryKey: SITE_GENERATION_QUERY_KEY,
            });
            await waitFor(() =>
                expect(screen.queryByText('site_generation_title')).toBeNull(),
            );
        },
    );

    it.each([401, 403])(
        'stops polling once the session is refused (%s)',
        (code) => {
            const running = { generation: buildGeneration('running') };
            expect(
                getRefetchInterval(running, {
                    state: {
                        status: 'error',
                        error: Object.assign(new Error('unauthorized'), {
                            code,
                        }),
                    },
                }),
            ).toBe(false);
            expect(
                getRefetchInterval(running, {
                    state: {
                        status: 'error',
                        error: Object.assign(new Error('down'), { code: 502 }),
                    },
                }),
            ).toBe(5000);
        },
    );

    it('keeps the progress after another failed fetch', async () => {
        renderDialog(buildGeneration('running', ['running']));
        await screen.findByText('site_generation_title');
        (getSiteGeneration as jest.Mock).mockRejectedValue(
            Object.assign(new Error('down'), { code: 502 }),
        );
        await client.invalidateQueries({ queryKey: SITE_GENERATION_QUERY_KEY });
        await waitFor(() =>
            expect(
                client.getQueryState([...SITE_GENERATION_QUERY_KEY, true])
                    ?.status,
            ).toBe('error'),
        );
        expect(screen.getByText('site_generation_title')).toBeInTheDocument();
    });

    it('translates the error of a refused action', async () => {
        (relaunchSiteGeneration as jest.Mock).mockRejectedValue(
            new Error('no_site_generation'),
        );
        renderDialog(buildGeneration('error', ['error'], 'oops'), {
            translate: (label, options) =>
                options
                    ? `${label}+${JSON.stringify(options)}`
                    : `translated:${label}`,
        });
        await userEvent.click(
            await screen.findByText('translated:site_generation_relaunch'),
        );
        await waitFor(() =>
            expect(toast).toHaveBeenCalledWith(
                'site_generation_action_error+{"error":"translated:no_site_generation"}',
                { type: 'error' },
            ),
        );
    });
});
