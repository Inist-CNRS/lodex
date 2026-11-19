import { Route } from 'react-router';
import { Wrapper, getStore, render, userEvent } from '../test-utils';
import { loadPublicationSuccess } from '../publication';
import {
    act,
    render as rtlRender,
    screen,
    waitFor,
    within,
} from '@testing-library/react';
import type { CatalogModel } from '@lodex/common';
import { useGenerateSite } from '../siteWizard/useGenerateSite';
import { SimplifiedUpload } from './SimplifiedUpload';
import { useSiteModelLaunch } from './useSiteModelLaunch';

// injected by vite at build time
// @ts-expect-error TS7017
global.UPLOAD_LIMIT = 1;

jest.mock('../siteWizard/hasTranslation', () => ({
    hasTranslation: (key: string) => key === 'mc_a_import_help',
}));
jest.mock('../siteWizard/useGenerateSite', () => ({
    useGenerateSite: jest.fn(),
}));

jest.mock('./useSiteModelLaunch', () => ({ useSiteModelLaunch: jest.fn() }));

const model: CatalogModel = {
    id: 'a',
    url: 'http://a.tar',
    loader: 'la',
    doc: 'http://a.doc',
    importTypes: ['url', 'text', 'file'],
};
const launch = {
    enrichment: 2,
    precomputed: 1,
    steps: [
        { name: 'p', type: 'precomputed' as const, position: 1 },
        { name: 'e1', type: 'enrichment' as const, position: 2 },
        { name: 'e2', type: 'enrichment' as const, position: 3 },
    ],
};
const noLaunch = { enrichment: 0, precomputed: 0, steps: [] };

describe('SimplifiedUpload', () => {
    const addData = jest.fn();
    const mockGenerateSite = (overrides = {}) =>
        (useGenerateSite as jest.Mock).mockReturnValue({
            addData,
            isGenerating: false,
            uploadProgress: null,
            canCancel: false,
            isCancelling: false,
            cancelImport: jest.fn(),
            error: null,
            clearError: jest.fn(),
            ...overrides,
        });

    const mockLaunch = (overrides = {}) =>
        (useSiteModelLaunch as jest.Mock).mockReturnValue({
            isLoading: false,
            isError: false,
            launch,
            ...overrides,
        });

    beforeEach(() => {
        jest.clearAllMocks();
        mockLaunch();
        addData.mockResolvedValue(undefined);
        mockGenerateSite();
    });

    const renderPage = (
        props: Partial<Parameters<typeof SimplifiedUpload>[0]> = {},
        published = true,
    ) =>
        render(
            <>
                <SimplifiedUpload model={model} hasData {...props} />
                <Route
                    path="*"
                    render={({ location }) => (
                        <div data-testid="location">{location.pathname}</div>
                    )}
                />
            </>,
            { initialState: { publication: { published } } },
        );

    const fillUrl = async () => {
        await userEvent.type(screen.getByLabelText('use_url'), 'http://d.org');
    };

    const submit = async () => {
        await fillUrl();
        await userEvent.click(
            screen.getByRole('button', { name: 'upload_data' }),
        );
    };

    it('offers the import types of the model, in order', () => {
        renderPage();
        expect(
            screen.getAllByRole('tab').map((tab) => tab.textContent),
        ).toEqual(['upload_by_url', 'upload_by_text', 'upload_by_file']);
    });

    it('shows no tab for a single import type', () => {
        renderPage({ model: { ...model, importTypes: ['text'] } });
        expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('shows the model sentence, the doc link and the import help', () => {
        renderPage();
        expect(
            screen.getByText('simplified_upload_model+{"name":"mc_a_name"}', {
                exact: false,
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'simplified_upload_doc' }),
        ).toHaveAttribute('href', 'http://a.doc');
        expect(screen.getByText('mc_a_import_help')).toBeInTheDocument();
    });

    it('ends the model sentence without colon nor link when there is no doc', () => {
        renderPage({ model: { ...model, doc: undefined } });
        expect(
            screen.getByText(
                'simplified_upload_model_no_doc+{"name":"mc_a_name"}',
                { exact: false },
            ),
        ).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('omits the import help without translation', () => {
        renderPage({ model: { ...model, id: 'b' } });
        expect(screen.queryByText('mc_b_import_help')).not.toBeInTheDocument();
    });

    it('has no loader choice', () => {
        renderPage({ model: { ...model, importTypes: ['file'] } });
        expect(screen.queryByText('loader_select')).not.toBeInTheDocument();
        expect(screen.queryByText(/loader/i)).not.toBeInTheDocument();
        expect(
            screen.getByText('import_dataset_file_text'),
        ).toBeInTheDocument();
        expect(screen.getByText(/upload_size_limit/)).toBeInTheDocument();
    });

    it('keeps the button back to the wizard', async () => {
        const onOpenWizard = jest.fn();
        renderPage({ onOpenWizard });
        await userEvent.click(
            screen.getByRole('button', { name: 'site_wizard_open' }),
        );
        expect(onOpenWizard).toHaveBeenCalled();
    });

    it('asks for a confirmation with the replace warning when there is data', async () => {
        renderPage();
        await submit();
        const dialog = within(screen.getByRole('dialog'));
        expect(dialog.getByText('info_upload')).toBeInTheDocument();
        expect(dialog.getByText('info_publish_desc')).toBeInTheDocument();
        expect(addData).not.toHaveBeenCalled();
    });

    it('does not show the replace warning without data', async () => {
        renderPage({ hasData: false });
        await submit();
        const dialog = within(screen.getByRole('dialog'));
        expect(dialog.getByText('info_upload')).toBeInTheDocument();
        expect(dialog.queryByText('info_publish_desc')).not.toBeInTheDocument();
    });

    it('checks the relaunch switch by default', async () => {
        renderPage();
        await submit();
        expect(
            screen.getByRole('checkbox', {
                name: 'simplified_upload_relaunch',
            }),
        ).toBeChecked();
    });

    it('has no relaunch switch when there is nothing to relaunch', async () => {
        mockLaunch({ launch: noLaunch });
        renderPage();
        await submit();
        expect(
            screen.queryByRole('checkbox', {
                name: 'simplified_upload_relaunch',
            }),
        ).not.toBeInTheDocument();
    });

    it('fetches the counts only once the confirmation is open', async () => {
        renderPage();
        expect(useSiteModelLaunch).toHaveBeenLastCalledWith(false);
        await submit();
        expect(useSiteModelLaunch).toHaveBeenLastCalledWith(true);
    });

    it('shows a progress instead of the relaunch switch and disables Accept while the counts load', async () => {
        mockLaunch({ isLoading: true, launch: null });
        renderPage();
        await submit();
        const dialog = within(screen.getByRole('dialog'));
        expect(dialog.getByRole('progressbar')).toBeInTheDocument();
        expect(
            dialog.queryByRole('checkbox', {
                name: 'simplified_upload_relaunch',
            }),
        ).not.toBeInTheDocument();
        expect(dialog.getByRole('button', { name: 'Accept' })).toBeDisabled();
        expect(dialog.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    });

    it('offers the relaunch switch, on, when the counts request fails', async () => {
        mockLaunch({ isError: true, launch: null });
        renderPage();
        await submit();
        expect(
            screen.getByRole('checkbox', {
                name: 'simplified_upload_relaunch',
            }),
        ).toBeChecked();
        await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
        expect(addData).toHaveBeenCalledWith(
            model,
            { type: 'url', url: 'http://d.org' },
            { relaunch: true, autoPublish: true },
        );
    });

    it('checks the publish switch when the dataset is published', async () => {
        renderPage({}, true);
        await submit();
        expect(
            screen.getByRole('checkbox', { name: 'simplified_upload_publish' }),
        ).toBeChecked();
    });

    it('leaves the publish switch unchecked otherwise', async () => {
        renderPage({}, false);
        await submit();
        expect(
            screen.getByRole('checkbox', { name: 'simplified_upload_publish' }),
        ).not.toBeChecked();
    });

    it('sends the data add with the values of the switches', async () => {
        renderPage({}, true);
        await submit();
        await userEvent.click(
            screen.getByRole('checkbox', {
                name: 'simplified_upload_relaunch',
            }),
        );
        await userEvent.click(
            screen.getByRole('checkbox', { name: 'simplified_upload_publish' }),
        );
        await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
        expect(addData).toHaveBeenCalledWith(
            model,
            { type: 'url', url: 'http://d.org' },
            { relaunch: false, autoPublish: false },
        );
    });

    it('sends relaunch false when the switch is absent', async () => {
        mockLaunch({ launch: noLaunch });
        renderPage({}, true);
        await submit();
        await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
        expect(addData).toHaveBeenCalledWith(
            model,
            { type: 'url', url: 'http://d.org' },
            { relaunch: false, autoPublish: true },
        );
    });

    it('closes the confirmation on Cancel', async () => {
        renderPage();
        await submit();
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(addData).not.toHaveBeenCalled();
    });

    it('shows the error of a failed send', () => {
        mockGenerateSite({ error: 'already translated' });
        renderPage();
        expect(screen.getByText('already translated')).toBeInTheDocument();
    });

    it('shows the upload progress while a file is sent', () => {
        mockGenerateSite({
            isGenerating: true,
            uploadProgress: 40,
            canCancel: true,
        });
        renderPage();
        expect(screen.getByText('site_generation_title')).toBeInTheDocument();
    });

    it('goes to the existing data once the add is queued', async () => {
        renderPage();
        await submit();
        await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
        await waitFor(() =>
            expect(screen.getByTestId('location')).toHaveTextContent(
                '/data/existing',
            ),
        );
    });

    it('stays on the page when the send fails', async () => {
        addData.mockRejectedValue(new Error('failed'));
        renderPage();
        await submit();
        await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
        await waitFor(() => expect(addData).toHaveBeenCalled());
        expect(screen.getByTestId('location')).toHaveTextContent('/');
        expect(screen.getByTestId('location')).not.toHaveTextContent(
            '/data/existing',
        );
    });

    it('takes the publish default from the publication loaded after mount', async () => {
        const store = getStore({ publication: { published: false } });
        rtlRender(
            <Wrapper store={store}>
                <SimplifiedUpload model={model} hasData />
            </Wrapper>,
        );
        act(() => {
            store.dispatch(
                loadPublicationSuccess({
                    fields: [],
                    characteristics: [],
                    published: true,
                }),
            );
        });
        await submit();
        expect(
            screen.getByRole('checkbox', { name: 'simplified_upload_publish' }),
        ).toBeChecked();
    });
});
