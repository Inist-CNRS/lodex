import { render, userEvent } from '../test-utils';
import { screen, waitFor, within } from '@testing-library/react';
import type { CatalogModel } from '@lodex/common';
import { useGenerateSite } from './useGenerateSite';
import { SiteWizard } from './SiteWizard';

// injected by vite at build time
// @ts-expect-error TS7017
global.UPLOAD_LIMIT = 1;

jest.mock('./hasTranslation', () => ({ hasTranslation: () => true }));

const models: CatalogModel[] = [
    {
        id: 'a',
        url: 'http://a.tar',
        loader: 'la',
        doc: 'http://a.doc',
        demo: 'http://a.demo',
    },
    { id: 'b', url: 'http://b.tar', loader: 'lb' },
];

jest.mock('./useDisplayableModels', () => ({
    useDisplayableModels: () => models,
}));
jest.mock('./useGenerateSite', () => ({ useGenerateSite: jest.fn() }));

const button = (name: string) => screen.getByRole('button', { name });

const selectModel = async (title: string) => {
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(within(screen.getByRole('listbox')).getByText(title));
};

const goToDataStep = async (title = 'mc_a_title') => {
    await selectModel(title);
    await userEvent.click(button('site_wizard_next'));
};

const typeUrl = async (url: string) => {
    await userEvent.click(screen.getByRole('tab', { name: 'upload_by_url' }));
    await userEvent.type(screen.getByLabelText('use_url'), url);
};

describe('SiteWizard', () => {
    let generate: jest.Mock;
    let cancelImport: jest.Mock;
    let clearError: jest.Mock;

    beforeEach(() => {
        generate = jest.fn(() => new Promise(() => {}));
        cancelImport = jest.fn();
        clearError = jest.fn();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: false,
            isWaitingForImport: false,
            cancelImport,
            error: null,
        });
    });

    it('displays the title and the progress on the first step', () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        expect(screen.getByText('site_wizard_title')).toBeInTheDocument();
        expect(screen.getByText('1/2')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute(
            'aria-valuenow',
            '50',
        );
        expect(
            screen.queryByRole('button', { name: 'site_wizard_previous' }),
        ).not.toBeInTheDocument();
        expect(button('site_wizard_next')).toBeDisabled();
    });

    it('goes to the data step once a model is chosen', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await selectModel('mc_a_title');
        expect(button('site_wizard_next')).toBeEnabled();
        await userEvent.click(button('site_wizard_next'));
        expect(screen.getByText('2/2')).toBeInTheDocument();
        expect(screen.getByText('site_wizard_title')).toBeInTheDocument();
        expect(
            screen.getByText('site_wizard_data_subtitle+{"name":"mc_a_title"}'),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', {
                name: 'site_wizard_documentation_link',
            }),
        ).toHaveAttribute('href', 'http://a.doc');
        expect(
            screen.getByRole('link', { name: 'site_wizard_demo_link' }),
        ).toBeInTheDocument();
    });

    it('displays no link for a model without doc nor demo', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep('mc_b_title');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('goes back to the first step with the model still selected', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        await userEvent.click(button('site_wizard_previous'));
        expect(screen.getByText('1/2')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveTextContent('mc_a_title');
        expect(button('site_wizard_next')).toBeEnabled();
    });

    it('generates the site with the chosen model and data, only once', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        expect(button('site_wizard_generate')).toBeDisabled();
        await typeUrl('https://x');
        expect(button('site_wizard_generate')).toBeEnabled();
        await userEvent.click(button('site_wizard_generate'));
        expect(generate).toHaveBeenCalledWith(models[0], {
            type: 'url',
            url: 'https://x',
        });
        await userEvent.click(button('site_wizard_generate'), {
            pointerEventsCheck: 0,
        });
        expect(generate).toHaveBeenCalledTimes(1);
    });

    it('displays a loader and disables the navigation while generating', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(screen.getByText('site_wizard_generating')).toBeInTheDocument();
        expect(
            screen.queryByRole('tab', { name: 'upload_by_url' }),
        ).not.toBeInTheDocument();
        expect(button('site_wizard_cancel')).toBeDisabled();
        expect(button('site_wizard_previous')).toBeDisabled();
        expect(button('site_wizard_generate')).toBeDisabled();
        expect(
            screen.queryByRole('button', { name: 'site_wizard_cancel_import' }),
        ).not.toBeInTheDocument();
    });

    it('offers to cancel the import while waiting for it', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            isWaitingForImport: true,
            uploadProgress: null,
            canCancel: true,
            cancelImport,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        await userEvent.click(button('site_wizard_cancel_import'));
        expect(cancelImport).toHaveBeenCalledTimes(1);
    });

    it('shows the upload progress of a file and offers to cancel it', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            isWaitingForImport: false,
            uploadProgress: 42,
            canCancel: true,
            cancelImport,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(
            screen.getByText('site_wizard_uploading+{"progress":42}'),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('progressbar', {
                name: 'site_wizard_uploading+{"progress":42}',
            }),
        ).toHaveAttribute('aria-valuenow', '42');
        await userEvent.click(button('site_wizard_cancel_import'));
        expect(cancelImport).toHaveBeenCalledTimes(1);
    });

    it('labels the cancel button as the manual configuration on the first step only', async () => {
        const onClose = jest.fn();
        render(<SiteWizard open onClose={onClose} />);
        expect(button('site_wizard_manual')).toBeEnabled();
        expect(
            screen.queryByRole('button', { name: 'site_wizard_cancel' }),
        ).not.toBeInTheDocument();
        await userEvent.click(button('site_wizard_manual'));
        expect(
            screen.getByText('site_wizard_cancel_title'),
        ).toBeInTheDocument();
        await userEvent.click(button('confirm'));
        expect(onClose).toHaveBeenCalledWith('dismissed');
    });

    it('labels the cancel button as a plain cancel on the data step', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        expect(button('site_wizard_cancel')).toBeEnabled();
        expect(
            screen.queryByRole('button', { name: 'site_wizard_manual' }),
        ).not.toBeInTheDocument();
    });

    it('closes the wizard when the generation succeeds', async () => {
        generate.mockResolvedValue(undefined);
        const onClose = jest.fn();
        render(<SiteWizard open onClose={onClose} />);
        await goToDataStep();
        await typeUrl('https://x');
        await userEvent.click(button('site_wizard_generate'));
        await waitFor(() => expect(onClose).toHaveBeenCalledWith('generated'));
    });

    it('asks for a confirmation before cancelling', async () => {
        const onClose = jest.fn();
        render(<SiteWizard open onClose={onClose} />);
        await goToDataStep();
        await userEvent.click(button('site_wizard_cancel'));
        expect(
            screen.getByText('site_wizard_cancel_title'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('site_wizard_cancel_description'),
        ).toBeInTheDocument();
        await userEvent.click(button('cancel'));
        await waitFor(() =>
            expect(
                screen.queryByText('site_wizard_cancel_title'),
            ).not.toBeInTheDocument(),
        );
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByText('2/2')).toBeInTheDocument();

        await userEvent.click(button('site_wizard_cancel'));
        await userEvent.click(button('confirm'));
        // leaving the data step is not the choice of the manual configuration
        expect(onClose).toHaveBeenCalledWith('cancelled');
    });

    it('clears the error once the inputs change', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        clearError.mockClear();
        await typeUrl('https://x');
        expect(clearError).toHaveBeenCalled();
    });

    it('clears the error when closed after a failure, so that it can close', async () => {
        const onClose = jest.fn();
        const { rerender } = render(<SiteWizard open onClose={onClose} />);
        await goToDataStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: false,
            error: 'boom',
        });
        rerender(<SiteWizard open onClose={onClose} />);
        await userEvent.click(button('site_wizard_cancel'));
        await userEvent.click(button('confirm'));
        expect(clearError).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it('displays the error and keeps the inputs when the generation fails', async () => {
        const onClose = jest.fn();
        generate.mockRejectedValue(new Error('boom'));
        const { rerender } = render(<SiteWizard open onClose={onClose} />);
        await goToDataStep();
        await typeUrl('https://x');
        await userEvent.click(button('site_wizard_generate'));
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: false,
            error: 'site_wizard_generation_error+{"error":"boom"}',
        });
        rerender(<SiteWizard open onClose={onClose} />);
        expect(await screen.findByRole('alert')).toHaveTextContent(
            'site_wizard_generation_error+{"error":"boom"}',
        );
        expect(screen.getByLabelText('use_url')).toHaveValue('https://x');
        expect(onClose).not.toHaveBeenCalled();
        await waitFor(() =>
            expect(button('site_wizard_generate')).toBeEnabled(),
        );
    });
});
