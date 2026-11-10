import { useContext } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getStore, Wrapper } from '../test-utils';
import { loadParsingResultSuccess } from '../parsing';
import { loadPublicationSuccess } from '@lodex/frontend-common/fields/reducer';
import { SiteWizardContext } from './SiteWizardContext';
import { SiteWizardHost } from './SiteWizardHost';

const mockMounts = jest.fn();

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
                <button onClick={() => onClose('generated')}>generated</button>
                <button onClick={() => onClose('cancelled')}>cancelled</button>
            </div>
        );
    },
}));

const OpenButton = () => {
    const { openWizard } = useContext(SiteWizardContext);
    return <button onClick={openWizard}>open wizard</button>;
};

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
) => {
    const store = getStore(initialState);
    render(
        <Wrapper store={store}>
            <SiteWizardHost active={active}>
                <OpenButton />
            </SiteWizardHost>
        </Wrapper>,
    );
    return store;
};

const wizard = () => screen.getByTestId('wizard');

describe('SiteWizardHost', () => {
    beforeEach(() => {
        mockMounts.mockClear();
        localStorage.clear();
        sessionStorage.clear();
    });

    it('opens the wizard on an empty instance', () => {
        renderHost();
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

    it('does not remember a generated site', async () => {
        renderHost();
        await userEvent.click(screen.getByText('generated'));
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
});
