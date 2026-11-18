import fs from 'fs';
import { resolve } from 'path';
import type { ReactNode } from 'react';
import CSV from 'csv-string';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { toast, type SiteGenerationView } from '@lodex/common';
import { LOAD_FIELD } from '@lodex/frontend-common/fields/reducer';
import { loginSuccess } from '@lodex/frontend-common/user/reducer';
import {
    I18NComponent,
    I18NContext,
} from '@lodex/frontend-common/i18n/I18NContext';
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
import { LOAD_SUBRESOURCES } from '../subresource';
import { hasTranslation } from '../siteWizard/hasTranslation';
import { SiteGenerationDialog } from './SiteGenerationDialog';
import { SiteGenerationSteps } from './SiteGenerationSteps';
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
// the handlers of the events pushed by the server, by event name
const mockSocketHandlers = new Map<string, (data: unknown) => void>();
const mockSocket = {
    on: jest.fn((event: string, handler: (data: unknown) => void) =>
        mockSocketHandlers.set(event, handler),
    ),
    disconnect: jest.fn(),
};
jest.mock('socket.io-client', () => ({ io: jest.fn(() => mockSocket) }));
jest.mock('../siteWizard/hasTranslation', () => ({
    hasTranslation: jest.fn(() => false),
}));

// the real French phrases, to check the texts of the mock-up
const frenchPhrases: Record<string, string> = Object.fromEntries(
    (
        CSV.parse(
            fs.readFileSync(
                resolve(
                    __dirname,
                    '../../../../src/app/custom/translations.tsv',
                ),
                'utf8',
            ),
            '\t',
            '"',
        ) as unknown as string[][]
    ).map(([key, , french]) => [key, french]),
);

const French = ({ children }: { children: ReactNode }) => (
    <I18NComponent locale="fr" phrases={frenchPhrases} setLanguage={() => {}}>
        {children}
    </I18NComponent>
);

// fr formats the numbers with narrow no-break spaces
const normalize = (text: string | null) =>
    (text ?? '').replace(/\s+/g, ' ').trim();
// the deepest element whose whole text is the expected one
const byText = (expected: string) => (_: string, element: Element | null) =>
    !!element &&
    normalize(element.textContent) === expected &&
    Array.from(element.children).every(
        (child) => normalize(child.textContent) !== expected,
    );

const counter = (total: number, done = 0, error = 0) => ({
    done,
    total,
    error,
});

const buildGeneration = (
    overrides: Partial<SiteGenerationView> = {},
): SiteGenerationView => ({
    status: 'running',
    phase: 'model',
    steps: [],
    modelId: 'hal2lodex',
    importedLines: 13483,
    settings: { siteName: true, siteDescription: true },
    launch: {
        enrichment: counter(7),
        precomputed: counter(3),
    },
    ...overrides,
});

const LocationDisplay = () => {
    const location = useLocation();
    return (
        <div
            data-testid="location"
            data-state={JSON.stringify(location.state ?? null)}
        >
            {location.pathname}
        </div>
    );
};

const RELOADS = [
    LOAD_FIELD,
    LOAD_PUBLICATION,
    LOAD_SUBRESOURCES,
    LOAD_ENRICHMENTS,
    LOAD_PRECOMPUTED,
    LOAD_PARSING_RESULT,
];

describe('SiteGenerationDialog', () => {
    let dispatched: string[];
    let client: QueryClient;

    const renderDialog = (
        generation: SiteGenerationView | null,
        {
            isLoggedIn = true,
            translate,
            french = false,
        }: {
            isLoggedIn?: boolean;
            translate?: (label: string, options?: unknown) => string;
            french?: boolean;
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
        const withI18N = (children: ReactNode) => {
            if (french) {
                return <French>{children}</French>;
            }
            if (translate) {
                return (
                    <I18NContext.Provider
                        value={{
                            translate,
                            locale: 'en',
                            setLanguage: () => {},
                        }}
                    >
                        {children}
                    </I18NContext.Provider>
                );
            }
            return children;
        };
        const result = render(
            <>
                <SiteGenerationDialog />
                <LocationDisplay />
            </>,
            {
                wrapper: ({ children }) => (
                    <Wrapper store={store} client={client}>
                        {withI18N(children)}
                    </Wrapper>
                ),
            },
        );
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

    const changeGeneration = async (generation: SiteGenerationView | null) => {
        (getSiteGeneration as jest.Mock).mockResolvedValue({ generation });
        await client.invalidateQueries({ queryKey: SITE_GENERATION_QUERY_KEY });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockSocketHandlers.clear();
        (hasTranslation as jest.Mock).mockReturnValue(false);
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
        ['done', buildGeneration({ status: 'done', phase: 'launch' })],
        ['stopped', buildGeneration({ status: 'stopped' })],
    ])('shows nothing for %s', async (_name, generation) => {
        renderDialog(generation);
        await waitFor(() => expect(getSiteGeneration).toHaveBeenCalled());
        await waitFor(() =>
            expect(
                client.isFetching({ queryKey: SITE_GENERATION_QUERY_KEY }),
            ).toBe(0),
        );
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(dispatched).not.toContain(LOAD_FIELD);
    });

    it('shows every step of a running generation as in the mock-up', async () => {
        (hasTranslation as jest.Mock).mockImplementation(
            (key: string) => !!frenchPhrases[key],
        );
        renderDialog(buildGeneration(), { french: true });
        expect(
            await screen.findByText('Configuration du site en cours…'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('La configuration peut prendre du temps'),
        ).toBeInTheDocument();
        expect(screen.getByText('2/4')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute(
            'aria-valuenow',
            '50',
        );
        expect(
            screen.getByText('Import du jeu de données'),
        ).toBeInTheDocument();
        expect(
            screen.getByText(byText('13 483 lignes importées')),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Import du modèle HAL2LODEX'),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Import du modèle, des enrichissements et des précalculs',
            ),
        ).toBeInTheDocument();
        expect(screen.getByText('Paramétrage du site')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Configuration du nom, de la description et du thème du site',
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Lancement des enrichissements et précalculs'),
        ).toBeInTheDocument();
        expect(screen.getByText('Lancement de')).toBeInTheDocument();
        expect(
            screen.getByText(byText('0/7 enrichissements')),
        ).toBeInTheDocument();
        expect(screen.getByText(byText('0/3 précalculs'))).toBeInTheDocument();
        expect(screen.queryByText('Réessayer')).toBeNull();
        expect(
            screen.getByText('Arrêter la configuration'),
        ).toBeInTheDocument();
    });

    it('tells which launch steps are tried again, and why', async () => {
        renderDialog(
            buildGeneration({
                phase: 'launch',
                steps: [
                    {
                        name: 'Auteurs',
                        type: 'enrichment',
                        position: 1,
                        state: 'running',
                        retry: { attempt: 2, max: 3, message: 'timeout' },
                    },
                    {
                        name: 'Résumé',
                        type: 'enrichment',
                        position: 1,
                        state: 'running',
                    },
                ],
            }),
            { french: true },
        );
        expect(
            await screen.findByText(
                byText('Auteurs : nouvelle tentative (2/3) - timeout'),
            ),
        ).toBeInTheDocument();
        expect(screen.queryByText(/Résumé : nouvelle tentative/)).toBeNull();
    });

    it('names the model with its short name when it has one', async () => {
        (hasTranslation as jest.Mock).mockImplementation(
            (key: string) => key === 'mc_hal2lodex_name',
        );
        renderDialog(buildGeneration());
        expect(
            await screen.findByText(
                'site_generation_step_model+{"name":"mc_hal2lodex_name"}',
            ),
        ).toBeInTheDocument();
    });

    it('names a model without a short name by its id', async () => {
        (hasTranslation as jest.Mock).mockImplementation(
            (key: string) => !!frenchPhrases[key],
        );
        renderDialog(buildGeneration({ modelId: 'my-model' }), {
            french: true,
        });
        expect(
            await screen.findByText('Import du modèle my-model'),
        ).toBeInTheDocument();
    });

    it('shows the launch in error with its counters', async () => {
        renderDialog(
            buildGeneration({
                status: 'error',
                phase: 'launch',
                launch: {
                    enrichment: counter(7, 2, 1),
                    precomputed: counter(3, 2),
                },
                steps: [
                    {
                        name: 'lienHAL',
                        type: 'enrichment',
                        position: 0,
                        state: 'error',
                        message: 'precomputed_no_response',
                    },
                ],
            }),
            { french: true },
        );
        expect(
            await screen.findByText(
                byText('2/7 enrichissements - 1 enrichissement en erreur'),
            ),
        ).toBeInTheDocument();
        expect(screen.getByText(byText('2/3 précalculs'))).toBeInTheDocument();
        expect(screen.getByText('4/4')).toBeInTheDocument();
        expect(screen.getByText(/lienHAL/)).toBeInTheDocument();
        expect(screen.getByText('Réessayer')).toBeInTheDocument();
    });

    it('leaves out a launch counter without anything to launch', async () => {
        renderDialog(
            buildGeneration({
                launch: {
                    enrichment: counter(2),
                    precomputed: counter(0),
                },
            }),
            { french: true },
        );
        expect(
            await screen.findByText(byText('0/2 enrichissements')),
        ).toBeInTheDocument();
        expect(screen.queryByText(/^\d+\/\d+ précalcul/)).toBeNull();
    });

    it.each([
        [
            { siteName: true, siteDescription: false },
            'Configuration du nom et du thème du site',
        ],
        [
            { siteName: false, siteDescription: true },
            'Configuration de la description et du thème du site',
        ],
        [
            { siteName: false, siteDescription: false },
            'Configuration du thème du site',
        ],
    ])('describes the settings %j', async (settings, description) => {
        renderDialog(buildGeneration({ settings }), { french: true });
        expect(await screen.findByText(description)).toBeInTheDocument();
    });

    it('shows the translated error of the data import', async () => {
        renderDialog(
            buildGeneration({
                status: 'error',
                phase: 'data',
                importedLines: undefined,
                message: 'import_failed',
            }),
            { french: true },
        );
        expect(
            await screen.findByText("L'import des données a échoué."),
        ).toBeInTheDocument();
        expect(screen.getByText('1/4')).toBeInTheDocument();
    });

    it('hides the technical detail of a failed data import behind an arrow', async () => {
        renderDialog(
            buildGeneration({
                status: 'error',
                phase: 'data',
                message: 'import_error_source_unavailable',
                detail: 'Maintenance en cours',
            }),
        );
        expect(
            await screen.findByText('import_error_source_unavailable'),
        ).toBeInTheDocument();
        expect(screen.getByText('Maintenance en cours')).not.toBeVisible();
        await userEvent.click(
            screen.getByRole('button', { name: 'error_detail' }),
        );
        expect(screen.getByText('Maintenance en cours')).toBeVisible();
    });

    it('relaunches and reopens the wizard on a retry of the data import', async () => {
        renderDialog(
            buildGeneration({
                status: 'error',
                phase: 'data',
                message: 'import_failed',
            }),
        );
        await userEvent.click(await screen.findByText('site_generation_retry'));
        await waitFor(() =>
            expect(screen.getByTestId('location')).toHaveTextContent(
                '/data/existing',
            ),
        );
        expect(relaunchSiteGeneration).toHaveBeenCalled();
        expect(screen.getByTestId('location')).toHaveAttribute(
            'data-state',
            JSON.stringify({ reopenSiteWizard: true }),
        );
    });

    it('does not reopen the wizard when the relaunch fails', async () => {
        (relaunchSiteGeneration as jest.Mock).mockRejectedValue(
            new Error('boom'),
        );
        renderDialog(
            buildGeneration({
                status: 'error',
                phase: 'data',
                message: 'import_failed',
            }),
        );
        await userEvent.click(await screen.findByText('site_generation_retry'));
        await waitFor(() =>
            expect(toast).toHaveBeenCalledWith(
                'site_generation_action_error+{"error":"boom"}',
                { type: 'error' },
            ),
        );
        expect(screen.getByTestId('location')).not.toHaveTextContent(
            '/data/existing',
        );
    });

    it('only relaunches on a retry of the model import', async () => {
        renderDialog(
            buildGeneration({ status: 'error', message: 'model_not_found' }),
        );
        expect(await screen.findByText('model_not_found')).toBeInTheDocument();
        await userEvent.click(screen.getByText('site_generation_retry'));
        await waitFor(() => expect(relaunchSiteGeneration).toHaveBeenCalled());
        expect(screen.getByTestId('location')).not.toHaveTextContent(
            '/data/existing',
        );
    });

    it('asks for a confirmation before stopping', async () => {
        renderDialog(buildGeneration());
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
        renderDialog(buildGeneration());
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

    it('stays open while the generation stops', async () => {
        renderDialog(buildGeneration({ status: 'stopping' }), {
            french: true,
        });
        expect(await screen.findByText(/^Arrêt en cours…/)).toBeInTheDocument();
        expect(
            screen.getByText('Arrêter la configuration').closest('button'),
        ).toBeDisabled();
    });

    it('gives the support contact when a step is in error', async () => {
        renderDialog(buildGeneration({ status: 'error', message: 'oops' }));
        await userEvent.click(await screen.findByText('site_generation_stop'));
        expect(await screen.findByRole('link')).toHaveAttribute(
            'href',
            'mailto:support-lodex@listes.istex.fr',
        );
    });

    it('reloads the admin data and closes once the generation is done', async () => {
        renderDialog(buildGeneration());
        // the model import changes the name, description and theme
        client.setQueryData(['get-config-tenant'], { theme: 'default' });
        await screen.findByText('site_generation_title');
        await changeGeneration(
            buildGeneration({ status: 'done', phase: 'launch' }),
        );
        await waitFor(() =>
            expect(screen.queryByText('site_generation_title')).toBeNull(),
        );
        expect(dispatched).toEqual(expect.arrayContaining(RELOADS));
        expect(client.getQueryData(['get-config-tenant'])).toBeUndefined();
        expect(toast).not.toHaveBeenCalled();
    });

    it('tells when the theme was not found once the generation is done', async () => {
        renderDialog(buildGeneration());
        await screen.findByText('site_generation_title');
        await changeGeneration(
            buildGeneration({
                status: 'done',
                phase: 'launch',
                themeNotFound: 'nougat',
            }),
        );
        await waitFor(() =>
            expect(toast).toHaveBeenCalledWith(
                'site_wizard_theme_not_found+{"theme":"nougat"}',
                expect.anything(),
            ),
        );
    });

    it('shows a generation pushed by the server without waiting for the poll', async () => {
        sessionStorage.setItem('lodex-tenant', 'my-tenant');
        sessionStorage.setItem('lodex-dbName', 'lodex');
        renderDialog(buildGeneration({ phase: 'model' }));
        expect(await screen.findByText('2/4')).toBeInTheDocument();
        // the next poll would answer late: a task blocks the server
        (getSiteGeneration as jest.Mock).mockReturnValue(new Promise(() => {}));
        const handler = mockSocketHandlers.get(
            'lodex_my-tenant-site-generation',
        );
        expect(handler).toBeDefined();

        act(() =>
            handler!({ generation: buildGeneration({ phase: 'launch' }) }),
        );

        expect(await screen.findByText('4/4')).toBeInTheDocument();
    });

    it('shows the dataset being saved on the data step, as the app bar', async () => {
        sessionStorage.setItem('lodex-tenant', 'my-tenant');
        sessionStorage.setItem('lodex-dbName', 'lodex');
        renderDialog(
            buildGeneration({ phase: 'data', importedLines: undefined }),
            { french: true },
        );
        expect(
            await screen.findByText('Import du jeu de données'),
        ).toBeInTheDocument();
        const handler = mockSocketHandlers.get('lodex_my-tenant-progress');
        expect(handler).toBeDefined();

        act(() =>
            handler!({
                type: 'import',
                status: 'SAVING_DATASET',
                progress: 1200,
            }),
        );

        expect(
            await screen.findByText(
                byText('Sauvegarde du jeu de données — 1 200 lignes importées'),
            ),
        ).toBeInTheDocument();
    });

    it('follows the import on the data step until it ends', async () => {
        sessionStorage.setItem('lodex-tenant', 'my-tenant');
        sessionStorage.setItem('lodex-dbName', 'lodex');
        renderDialog(
            buildGeneration({ phase: 'data', importedLines: undefined }),
            { french: true },
        );
        expect(
            await screen.findByText('Import du jeu de données'),
        ).toBeInTheDocument();
        const pushProgress = mockSocketHandlers.get(
            'lodex_my-tenant-progress',
        )!;
        const reconnect = mockSocketHandlers.get('connect')!;
        const saving = byText(
            'Sauvegarde du jeu de données — 1 200 lignes importées',
        );
        const savingProgress = {
            type: 'import',
            status: 'SAVING_DATASET',
            progress: 1200,
        };

        act(() => pushProgress({ type: 'import', status: 'INDEXATION' }));
        expect(await screen.findByText('Indexation...')).toBeInTheDocument();

        act(() => pushProgress({ type: 'import', status: 'PENDING' }));
        await waitFor(() =>
            expect(screen.queryByText('Indexation...')).toBeNull(),
        );

        // a progress missed while disconnected does not stay on screen
        act(() => pushProgress(savingProgress));
        expect(await screen.findByText(saving)).toBeInTheDocument();
        act(() => reconnect(undefined));
        await waitFor(() => expect(screen.queryByText(saving)).toBeNull());
    });

    it('shows the final count once the data step is done', async () => {
        sessionStorage.setItem('lodex-tenant', 'my-tenant');
        sessionStorage.setItem('lodex-dbName', 'lodex');
        renderDialog(buildGeneration({ phase: 'model' }), { french: true });
        expect(
            await screen.findByText(byText('13 483 lignes importées')),
        ).toBeInTheDocument();

        act(() =>
            mockSocketHandlers.get('lodex_my-tenant-progress')!({
                type: 'import',
                status: 'SAVING_DATASET',
                progress: 1200,
            }),
        );

        expect(
            screen.getByText(byText('13 483 lignes importées')),
        ).toBeInTheDocument();
        expect(screen.queryByText(/Sauvegarde du jeu de données/)).toBeNull();
    });

    it('listens to the pushes only once an admin is logged in', async () => {
        const { login, unmount } = renderDialog(null, { isLoggedIn: false });
        expect(mockSocket.on).not.toHaveBeenCalled();
        login();
        await waitFor(() => expect(mockSocket.on).toHaveBeenCalled());
        unmount();
        expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    describe('publication at the end', () => {
        const publishing = (
            status: SiteGenerationView['status'],
            publication: SiteGenerationView['publication'],
        ) =>
            buildGeneration({
                status,
                phase: 'launch',
                launch: {
                    enrichment: counter(7, 7),
                    precomputed: counter(3, 3),
                },
                publication,
            });

        it('shows the publication as a last step, counted', async () => {
            renderDialog(
                buildGeneration({ publication: { state: 'waiting' } }),
            );
            expect(
                await screen.findByText('site_generation_step_publication'),
            ).toBeInTheDocument();
            expect(screen.getByText('2/5')).toBeInTheDocument();
        });

        it('stays open while publishing, the other steps done, and can stop it', async () => {
            renderDialog(publishing('publishing', { state: 'running' }));
            expect(
                await screen.findByText('site_generation_step_publication'),
            ).toBeInTheDocument();
            expect(screen.getByText('5/5')).toBeInTheDocument();
            expect(screen.getAllByLabelText('done')).toHaveLength(4);
            expect(
                getRefetchInterval(
                    {
                        generation: publishing('publishing', {
                            state: 'running',
                        }),
                    },
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

        it('shows a failed publication and publishes again on a retry', async () => {
            renderDialog(
                publishing('error', {
                    state: 'error',
                    message: 'site_generation_publication_lost',
                }),
            );
            expect(
                await screen.findByText('site_generation_publication_lost'),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByText('site_generation_retry'));
            await waitFor(() =>
                expect(relaunchSiteGeneration).toHaveBeenCalled(),
            );
        });

        it('does not send to the support when only the publication failed', async () => {
            renderDialog(publishing('error', { state: 'error' }));
            await userEvent.click(
                await screen.findByText('site_generation_stop'),
            );
            expect(
                await screen.findByText(
                    'site_generation_stop_failed_publication_description',
                ),
            ).toBeInTheDocument();
            expect(screen.queryByRole('link')).toBeNull();
        });

        it('reloads the publication once published', async () => {
            renderDialog(publishing('publishing', { state: 'running' }));
            await screen.findByText('site_generation_title');
            await changeGeneration(publishing('done', { state: 'done' }));
            await waitFor(() =>
                expect(screen.queryByText('site_generation_title')).toBeNull(),
            );
            expect(dispatched).toEqual(expect.arrayContaining(RELOADS));
        });
    });

    it('reloads the admin data once a stopping generation is stopped', async () => {
        renderDialog(buildGeneration({ status: 'stopping' }));
        client.setQueryData(['get-config-tenant'], { theme: 'default' });
        await screen.findByText('site_generation_title');
        await changeGeneration(buildGeneration({ status: 'stopped' }));
        await waitFor(() =>
            expect(screen.queryByText('site_generation_title')).toBeNull(),
        );
        expect(dispatched).toEqual(expect.arrayContaining(RELOADS));
        // a model imported before the stop is kept
        expect(client.getQueryData(['get-config-tenant'])).toBeUndefined();
    });

    it('does not close with Escape', async () => {
        renderDialog(buildGeneration());
        await screen.findByText('site_generation_title');
        await userEvent.keyboard('{Escape}');
        expect(screen.getByText('site_generation_title')).toBeInTheDocument();
    });

    it('shows a toast when stopping fails and closes the confirmation', async () => {
        (stopSiteGeneration as jest.Mock).mockRejectedValue(new Error('boom'));
        renderDialog(buildGeneration());
        await userEvent.click(await screen.findByText('site_generation_stop'));
        await userEvent.click(await screen.findByText('confirm'));
        await waitFor(() => expect(toast).toHaveBeenCalled());
        await waitFor(() =>
            expect(screen.queryByText('site_generation_stop_title')).toBeNull(),
        );
    });

    it('waits for an admin login before fetching the generation', async () => {
        const { login } = renderDialog(buildGeneration(), {
            isLoggedIn: false,
        });
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
            renderDialog(buildGeneration());
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
            const running = { generation: buildGeneration() };
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

    it.each([
        ['running', 5000],
        ['error', 5000],
        ['stopping', 5000],
        ['done', false],
        ['stopped', false],
    ] as const)('polls a %s generation: %s', (status, interval) => {
        expect(
            getRefetchInterval(
                { generation: buildGeneration({ status }) },
                { state: { status: 'success', error: null } },
            ),
        ).toBe(interval);
    });

    it('keeps the progress after another failed fetch', async () => {
        renderDialog(buildGeneration());
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
        renderDialog(buildGeneration({ status: 'error', message: 'oops' }), {
            translate: (label, options) =>
                options
                    ? `${label}+${JSON.stringify(options)}`
                    : `translated:${label}`,
        });
        await userEvent.click(
            await screen.findByText('translated:site_generation_retry'),
        );
        await waitFor(() =>
            expect(toast).toHaveBeenCalledWith(
                'site_generation_action_error+{"error":"translated:no_site_generation"}',
                { type: 'error' },
            ),
        );
    });
});

describe('SiteGenerationSteps', () => {
    it('shows the progress of the upload on the data step', () => {
        render(
            <French>
                <SiteGenerationSteps
                    steps={[
                        { key: 'data', state: 'running' },
                        { key: 'model', state: 'waiting' },
                    ]}
                    view={buildGeneration({
                        phase: 'data',
                        importedLines: undefined,
                    })}
                    uploadProgress={45}
                />
            </French>,
        );
        expect(
            screen.getByText(byText('Envoi des données : 45 %')),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Import du modèle hal2lodex'),
        ).toBeInTheDocument();
    });
});
