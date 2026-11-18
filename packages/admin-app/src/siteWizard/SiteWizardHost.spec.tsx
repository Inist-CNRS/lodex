import { useContext } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getStore, Wrapper } from '../test-utils';
import { loadParsingResultSuccess } from '../parsing';
import { loadPublicationSuccess } from '@lodex/frontend-common/fields/reducer';
import { SiteWizardContext } from './SiteWizardContext';
import { MemoryRouter, useHistory, useLocation } from 'react-router-dom';
import type { MemoryHistory } from 'history';
import { SiteWizardHost } from './SiteWizardHost';

const mockMounts = jest.fn();
// undefined: the generation query has not answered yet
let mockGeneration: { status: string; phase?: string } | null | undefined;

jest.mock('../siteGeneration/useSiteGeneration', () => ({
    useSiteGeneration: () => ({ generation: mockGeneration }),
}));

jest.mock('./SiteWizard', () => ({
    SiteWizard: ({
        open,
        onClose,
    }: {
        open: boolean;
        onClose: (reason: string) => void;
    }) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('react').useEffect(() => {
            mockMounts();
        }, []);
        return (
            <div data-testid="wizard" data-open={String(open)}>
                <button onClick={() => onClose('dismissed')}>
                    close wizard
                </button>
                <button onClick={() => onClose('handedOver')}>
                    handed over
                </button>
                <button onClick={() => onClose('cancelled')}>cancelled</button>
            </div>
        );
    },
}));

const OpenButton = () => {
    const { openWizard } = useContext(SiteWizardContext);
    return <button onClick={openWizard}>open wizard</button>;
};

let history: MemoryHistory;
// shows the state of the current history entry
const HistoryProbe = () => {
    history = useHistory() as MemoryHistory;
    const location = useLocation();
    return (
        <div
            data-testid="location"
            data-state={JSON.stringify(location.state ?? null)}
        />
    );
};

const REOPEN = { reopenSiteWizard: true };

// what the progress dialog does on a retry of a failed data import
const requestReopen = () => act(() => history.push('/data/existing', REOPEN));

const emptyInstance = {
    parsing: {
        initialized: true,
        loading: false,
        allowUpload: true,
        totalLoadedLines: 0,
    },
    loaders: { loaders: [{ name: 'csv' }] },
    publication: { initialized: true, loading: false },
    // the default field of an empty instance
    fields: { byName: { uri: { name: 'uri' } }, list: ['uri'] },
};

const withModel = {
    ...emptyInstance,
    fields: {
        byName: { uri: { name: 'uri' }, title: { name: 'title' } },
        list: ['uri', 'title'],
    },
};

const renderHost = (
    active = true,
    initialState: Record<string, unknown> = emptyInstance,
    locationState?: object,
) => {
    const store = getStore(initialState);
    const ui = () => (
        <Wrapper store={store}>
            <MemoryRouter
                initialEntries={[
                    { pathname: '/data/existing', state: locationState },
                ]}
            >
                <HistoryProbe />
                <SiteWizardHost active={active}>
                    <OpenButton />
                </SiteWizardHost>
            </MemoryRouter>
        </Wrapper>
    );
    const { rerender } = render(ui());
    // a change of the generation, as the polling would bring it
    const changeGeneration = (
        generation: { status: string; phase?: string } | null | undefined,
    ) => {
        mockGeneration = generation;
        rerender(ui());
    };
    return Object.assign(store, { changeGeneration });
};

const wizard = () => screen.getByTestId('wizard');

describe('SiteWizardHost', () => {
    beforeEach(() => {
        mockMounts.mockClear();
        mockGeneration = null;
        localStorage.clear();
        sessionStorage.clear();
    });

    it('opens the wizard on an empty instance', () => {
        renderHost();
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('does not open the wizard before the generation is known', () => {
        mockGeneration = undefined;
        renderHost();
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it.each(['running', 'error', 'stopping'])(
        'does not open the wizard over a generation %s in its data phase',
        (status) => {
            // a reload during the data import: the instance is still empty
            mockGeneration = { status, phase: 'data' };
            renderHost();
            expect(wizard()).toHaveAttribute('data-open', 'false');
        },
    );

    it('does not open the wizard once the generation it waited for is done', () => {
        mockGeneration = { status: 'running', phase: 'data' };
        const { changeGeneration } = renderHost();
        // the instance is reloaded after the end: until then, it looks empty
        changeGeneration({ status: 'done', phase: 'launch' });
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it('opens the wizard once the generation it waited for is stopped', () => {
        // « Arrêter » during the data import leaves the instance empty
        mockGeneration = { status: 'stopping', phase: 'data' };
        const { changeGeneration } = renderHost();
        changeGeneration({ status: 'stopped', phase: 'data' });
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('opens the wizard once the generation is known and none is active', () => {
        mockGeneration = undefined;
        const { changeGeneration } = renderHost();
        changeGeneration(null);
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('opens the wizard on an empty instance after a stopped generation', () => {
        mockGeneration = { status: 'stopped', phase: 'data' };
        renderHost();
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('opens the wizard on a retry of a data import in error', () => {
        mockGeneration = { status: 'error', phase: 'data' };
        const { changeGeneration } = renderHost();
        expect(wizard()).toHaveAttribute('data-open', 'false');
        // the dialog's « Réessayer » stops the generation, then asks for the
        // wizard, before the polling brings the stop
        requestReopen();
        expect(wizard()).toHaveAttribute('data-open', 'true');
        changeGeneration({ status: 'stopped', phase: 'data' });
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('does not open the wizard outside the data screen', () => {
        renderHost(false);
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it('does not open the wizard while the parsing result is loading', () => {
        renderHost(true, {
            ...emptyInstance,
            parsing: { ...emptyInstance.parsing, loading: true },
        });
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it('does not open the wizard before the loaders are loaded', () => {
        // the model list depends on them: it would say there is no model
        renderHost(true, { ...emptyInstance, loaders: { loaders: [] } });
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it('does not open the wizard on an instance with a model', () => {
        // a model set up by hand would be replaced by the generated site
        renderHost(true, withModel);
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it('does not open the wizard before the publication is loaded', () => {
        renderHost(true, {
            ...emptyInstance,
            publication: { initialized: false, loading: false },
        });
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it('keeps the wizard open once the generation imports a model', () => {
        const store = renderHost();
        act(() => {
            // the reload of the fields after the model import
            store.dispatch(
                loadPublicationSuccess({
                    fields: [{ name: 'uri' }, { name: 'title' }],
                    characteristics: [],
                    published: false,
                }),
            );
        });
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('does not open the wizard when the model failed to load', () => {
        renderHost(true, {
            ...emptyInstance,
            publication: {
                initialized: true,
                loading: false,
                error: 'Network error',
            },
        });
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it('does not count the field being added as a model', () => {
        renderHost(true, {
            ...emptyInstance,
            fields: {
                byName: { uri: { name: 'uri' }, new: { name: 'new' } },
                list: ['uri', 'new'],
            },
        });
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('remembers that the user chose to configure the site manually', async () => {
        renderHost();
        await userEvent.click(screen.getByText('close wizard'));
        expect(
            localStorage.getItem('lodex-site-wizard-dismissed-default'),
        ).toBe('true');
    });

    it('does not remember a wizard cancelled from a later step', async () => {
        renderHost();
        await userEvent.click(screen.getByText('cancelled'));
        expect(
            localStorage.getItem('lodex-site-wizard-dismissed-default'),
        ).toBeNull();
    });

    it('does not remember a wizard handed over to the progress dialog', async () => {
        renderHost();
        await userEvent.click(screen.getByText('handed over'));
        expect(
            localStorage.getItem('lodex-site-wizard-dismissed-default'),
        ).toBeNull();
    });

    it('does not open the wizard by itself once dismissed, but on demand', async () => {
        localStorage.setItem('lodex-site-wizard-dismissed-default', 'true');
        renderHost();
        expect(wizard()).toHaveAttribute('data-open', 'false');
        await userEvent.click(screen.getByText('open wizard'));
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('remembers the dismissal per instance', () => {
        localStorage.setItem('lodex-site-wizard-dismissed-other', 'true');
        renderHost();
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('opens the wizard on demand even with a model', async () => {
        renderHost(true, withModel);
        await userEvent.click(screen.getByText('open wizard'));
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('keeps the same wizard mounted and open when the instance gets data', () => {
        const store = renderHost();
        act(() => {
            // what JobProgress triggers once the first lines are saved
            store.dispatch(loadParsingResultSuccess({ totalLoadedLines: 200 }));
        });
        // the generation is still running, or its error must stay readable
        expect(wizard()).toHaveAttribute('data-open', 'true');
        expect(mockMounts).toHaveBeenCalledTimes(1);
    });

    it('closes the wizard and reopens a new one on demand', async () => {
        renderHost();
        await userEvent.click(screen.getByText('close wizard'));
        expect(wizard()).toHaveAttribute('data-open', 'false');

        await userEvent.click(screen.getByText('open wizard'));
        expect(wizard()).toHaveAttribute('data-open', 'true');
        expect(mockMounts).toHaveBeenCalledTimes(2);
    });

    it('reopens the same wizard, with its choices, on a retry request', async () => {
        renderHost();
        await userEvent.click(screen.getByText('handed over'));
        expect(wizard()).toHaveAttribute('data-open', 'false');

        requestReopen();
        expect(wizard()).toHaveAttribute('data-open', 'true');
        // not a new wizard: it would restart empty
        expect(mockMounts).toHaveBeenCalledTimes(1);
    });

    it('serves a retry requested before the host is mounted', () => {
        renderHost(true, withModel, REOPEN);
        expect(wizard()).toHaveAttribute('data-open', 'true');
    });

    it('clears the retry request from the history entry', async () => {
        renderHost(true, withModel);
        requestReopen();
        expect(screen.getByTestId('location')).toHaveAttribute(
            'data-state',
            '{}',
        );
        expect(history.location.pathname).toBe('/data/existing');
        expect(history.length).toBe(2);
        // a later visit of the entry does not reopen the wizard
        await userEvent.click(screen.getByText('close wizard'));
        act(() => history.goBack());
        act(() => history.goForward());
        expect(wizard()).toHaveAttribute('data-open', 'false');
    });

    it('restarts empty on a classic open after a hand over', async () => {
        renderHost();
        await userEvent.click(screen.getByText('handed over'));
        await userEvent.click(screen.getByText('open wizard'));
        expect(wizard()).toHaveAttribute('data-open', 'true');
        expect(mockMounts).toHaveBeenCalledTimes(2);
    });
});
