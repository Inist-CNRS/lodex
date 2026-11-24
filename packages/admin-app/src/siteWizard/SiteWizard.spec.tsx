import { render, userEvent } from '../test-utils';
import { screen, waitFor, within } from '@testing-library/react';
import type { CatalogModel } from '@lodex/common';
import { useGenerateSite } from './useGenerateSite';
import { useSiteGeneration } from '../siteGeneration/useSiteGeneration';
import { SiteWizard } from './SiteWizard';
import { useGetAvailableThemes } from '../configTenant/useGetAvailableThemes';

// injected by vite at build time
// @ts-expect-error TS7017
global.UPLOAD_LIMIT = 1;

jest.mock('./hasTranslation', () => ({
    hasTranslation: (key: string) => key !== 'mc_a_import_help',
}));

const models: CatalogModel[] = [
    {
        id: 'a',
        url: 'http://a.tar',
        loader: 'la',
        doc: 'http://a.doc',
        demo: 'http://a.demo',
        importTypes: ['file', 'url', 'text'],
    },
    {
        id: 'b',
        url: 'http://b.tar',
        loader: 'lb',
        importTypes: ['text'],
    },
    {
        id: 'c',
        url: 'http://c.tar',
        loader: 'lc',
        theme: 'nougat',
        importTypes: ['file', 'url', 'text'],
    },
    {
        id: 'd',
        url: 'http://d.tar',
        loader: 'ld',
        theme: 'missing',
        importTypes: ['file', 'url', 'text'],
    },
    {
        id: 'e',
        url: 'http://e.tar',
        loader: 'le',
        importTypes: ['file', 'url', 'text'],
        launchOrder: [
            { name: 'x', type: 'enrichment', position: 1 },
            { name: 'y', type: 'enrichment', position: 2 },
            { name: 'z', type: 'precomputed', position: 1 },
        ],
    },
];

const themes = [
    {
        value: 'default',
        name: { en: 'System', fr: 'Système' },
        description: { en: 'System theme', fr: 'Thème système' },
    },
    {
        value: 'nougat',
        name: { en: 'Nougat', fr: 'Nougat' },
        description: { en: 'Nougat theme', fr: 'Thème Nougat' },
    },
];

jest.mock('./useDisplayableModels', () => ({
    useDisplayableModels: () => models,
}));
jest.mock('./useGenerateSite', () => ({ useGenerateSite: jest.fn() }));
jest.mock('../siteGeneration/useSiteGeneration', () => ({
    ...jest.requireActual('../siteGeneration/useSiteGeneration'),
    useSiteGeneration: jest.fn(),
}));
jest.mock('../configTenant/useGetAvailableThemes', () => ({
    ...jest.requireActual('../configTenant/useGetAvailableThemes'),
    useGetAvailableThemes: jest.fn(),
}));

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

const typeSiteName = async (name: string) => {
    await userEvent.type(screen.getByLabelText('site_wizard_site_title'), name);
};

const goToSiteInfoStep = async (title = 'mc_a_title') => {
    await goToDataStep(title);
    await typeUrl('https://x');
    await userEvent.click(button('site_wizard_next'));
};

const goToThemeStep = async (title = 'mc_a_title') => {
    await goToSiteInfoStep(title);
    await userEvent.click(button('site_wizard_next'));
};

// from the theme step
const generateSite = async () => {
    await userEvent.click(button('site_wizard_next'));
    await userEvent.click(button('site_wizard_generate'));
};

const themeSelect = () =>
    screen.getByRole('combobox', { name: 'site_wizard_theme_title' });

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
        (useGetAvailableThemes as jest.Mock).mockReturnValue({
            data: themes,
            isLoading: false,
            error: null,
        });
        (useSiteGeneration as jest.Mock).mockReturnValue({
            generation: undefined,
        });
    });

    it('leaves as soon as the progress dialog shows the generation it uploads', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        // pushed by the server before the upload request ends
        (useSiteGeneration as jest.Mock).mockReturnValue({
            generation: { status: 'running' },
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        await waitFor(() =>
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
        );
    });

    it('fetches the themes only once opened', () => {
        const { rerender } = render(
            <SiteWizard open={false} onClose={jest.fn()} />,
        );
        expect(useGetAvailableThemes).toHaveBeenLastCalledWith(
            expect.objectContaining({ enabled: false }),
        );
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(useGetAvailableThemes).toHaveBeenLastCalledWith(
            expect.objectContaining({ enabled: true }),
        );
    });

    it('does not retry the themes, even from the theme step: the step falls back without waiting', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        // a new observer would refetch a failed query with its own options
        for (const [options] of (useGetAvailableThemes as jest.Mock).mock
            .calls) {
            expect(options).toEqual(expect.objectContaining({ retry: false }));
        }
    });

    it('displays the title and the progress on the first step', () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        expect(screen.getByText('site_wizard_title')).toBeInTheDocument();
        expect(screen.getByText('1/5')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute(
            'aria-valuenow',
            '20',
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
        expect(screen.getByText('2/5')).toBeInTheDocument();
        expect(screen.getByText('site_wizard_title')).toBeInTheDocument();
        // the same header on every step
        expect(screen.getByText('site_wizard_subtitle')).toBeInTheDocument();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'site_wizard_data_title',
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByText('site_wizard_model_links+{"name":"mc_a_title"}', {
                exact: false,
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'site_wizard_model_links_doc' }),
        ).toHaveAttribute('href', 'http://a.doc');
        expect(
            screen.getByRole('link', { name: 'site_wizard_model_links_demo' }),
        ).toHaveAttribute('href', 'http://a.demo');
    });

    it('displays no link for a model without doc nor demo', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep('mc_b_title');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('hides the tabs and opens the import type of a single-type model', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep('mc_b_title');
        expect(screen.queryByRole('tab')).not.toBeInTheDocument();
        expect(screen.queryByText('upload_drop_file')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('use_url')).not.toBeInTheDocument();
    });

    it('displays the translated import help of the model', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep('mc_b_title');
        expect(screen.getByText('mc_b_import_help')).toBeInTheDocument();
    });

    it('displays no import help for a model without one', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        expect(screen.getAllByRole('tab')).toHaveLength(3);
        expect(screen.queryByText('mc_b_import_help')).not.toBeInTheDocument();
    });

    it('goes back to the first step with the model still selected', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        await userEvent.click(button('site_wizard_previous'));
        expect(screen.getByText('1/5')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveTextContent('mc_a_title');
        expect(button('site_wizard_next')).toBeEnabled();
    });

    it('resets the inputs when another model is chosen', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        await typeUrl('https://x');
        await userEvent.click(button('site_wizard_previous'));
        await selectModel('mc_b_title');
        await goToDataStep('mc_a_title');
        await userEvent.click(
            screen.getByRole('tab', { name: 'upload_by_url' }),
        );
        expect(screen.getByLabelText('use_url')).toHaveValue('');
    });

    it('keeps the inputs when the same model is chosen again from the catalog', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        await typeUrl('https://x');
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_choose_model'));
        await userEvent.click(
            within(
                screen.getByRole('navigation', { name: 'model list' }),
            ).getAllByText('mc_a_title')[0],
        );
        await waitFor(() =>
            expect(
                screen.queryByRole('navigation', { name: 'model list' }),
            ).not.toBeInTheDocument(),
        );
        await userEvent.click(button('site_wizard_next'));
        expect(screen.getByLabelText('use_url')).toHaveValue('https://x');
    });

    it('goes to the theme step after the site title and subtitle', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToDataStep();
        expect(button('site_wizard_next')).toBeDisabled();
        await typeUrl('https://x');
        expect(button('site_wizard_next')).toBeEnabled();
        await userEvent.click(button('site_wizard_next'));
        expect(screen.getByText('3/5')).toBeInTheDocument();
        // the chosen model stays visible next to the title
        expect(screen.getByText('mc_a_title')).toBeInTheDocument();
        expect(screen.getByText('site_wizard_subtitle')).toBeInTheDocument();
        expect(
            screen.getByText('site_wizard_site_info_title'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('site_wizard_site_info_hint'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('site_wizard_site_title')).toHaveValue('');
        expect(screen.getByLabelText('site_wizard_site_subtitle')).toHaveValue(
            '',
        );
        // both fields are optional
        expect(button('site_wizard_next')).toBeEnabled();
    });

    it('goes to the theme step after the site name and description', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        expect(screen.getByText('4/5')).toBeInTheDocument();
        expect(screen.getByText('site_wizard_subtitle')).toBeInTheDocument();
        expect(screen.getByText('site_wizard_theme_title')).toBeInTheDocument();
        expect(screen.getByText('site_wizard_theme_hint')).toBeInTheDocument();
        expect(button('site_wizard_next')).toBeEnabled();
    });

    it('ends with the publication step, the automatic publication being off', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        await userEvent.click(button('site_wizard_next'));
        expect(screen.getByText('5/5')).toBeInTheDocument();
        expect(
            screen.getByText('site_wizard_publish_title'),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('checkbox', { name: 'site_wizard_auto_publish' }),
        ).not.toBeChecked();
        expect(button('site_wizard_generate')).toBeEnabled();
        expect(
            screen.queryByRole('button', { name: 'site_wizard_next' }),
        ).not.toBeInTheDocument();
    });

    it('generates the site to publish automatically once asked to', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        await userEvent.click(button('site_wizard_next'));
        await userEvent.click(
            screen.getByRole('checkbox', { name: 'site_wizard_auto_publish' }),
        );
        await userEvent.click(button('site_wizard_generate'));
        expect(generate).toHaveBeenCalledWith(
            models[0],
            { type: 'url', url: 'https://x' },
            expect.objectContaining({ autoPublish: true }),
        );
    });

    it('lists every theme and preselects the default one for a model without theme', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        expect(themeSelect()).toHaveTextContent('System - System theme');
        await userEvent.click(themeSelect());
        const options = within(screen.getByRole('listbox')).getAllByRole(
            'option',
        );
        expect(options.map((o) => o.textContent)).toEqual([
            'System - System theme',
            'Nougat - Nougat theme',
        ]);
        expect(
            screen.queryByText('site_wizard_theme_recommended'),
        ).not.toBeInTheDocument();
    });

    it('preselects the theme recommended by the model and tags it', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep('mc_c_title');
        expect(themeSelect()).toHaveTextContent('Nougat - Nougat theme');
        // the tag is for the list only
        expect(themeSelect()).not.toHaveTextContent(
            'site_wizard_theme_recommended',
        );
        await userEvent.click(themeSelect());
        const recommended = within(screen.getByRole('listbox')).getByRole(
            'option',
            { name: /Nougat/ },
        );
        expect(recommended).toHaveTextContent('site_wizard_theme_recommended');
    });

    it('preselects the default theme when the recommended one is not available', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep('mc_d_title');
        expect(themeSelect()).toHaveTextContent('System - System theme');
        await userEvent.click(themeSelect());
        expect(
            screen.queryByText('site_wizard_theme_recommended'),
        ).not.toBeInTheDocument();
    });

    it('waits for the themes before generating', async () => {
        (useGetAvailableThemes as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            error: null,
        });
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        expect(button('site_wizard_next')).toBeDisabled();
    });

    it('generates with the recommended theme when the themes cannot be loaded', async () => {
        (useGetAvailableThemes as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error('boom'),
        });
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep('mc_c_title');
        expect(
            screen.getByText('site_wizard_themes_error'),
        ).toBeInTheDocument();
        await generateSite();
        expect(generate).toHaveBeenCalledWith(
            models[2],
            { type: 'url', url: 'https://x' },
            {
                siteName: '',
                siteDescription: '',
                theme: 'nougat',
                autoPublish: false,
            },
        );
    });

    it('keeps the list of themes when a refetch fails after it was loaded', async () => {
        (useGetAvailableThemes as jest.Mock).mockReturnValue({
            data: themes,
            isLoading: false,
            error: new Error('boom'),
        });
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        expect(themeSelect()).toHaveTextContent('System - System theme');
        expect(
            screen.queryByText('site_wizard_themes_error'),
        ).not.toBeInTheDocument();
    });

    it('generates with the default theme when the themes cannot be loaded for a model without theme', async () => {
        (useGetAvailableThemes as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error('boom'),
        });
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        await generateSite();
        expect(generate).toHaveBeenCalledWith(
            models[0],
            { type: 'url', url: 'https://x' },
            {
                siteName: '',
                siteDescription: '',
                theme: 'default',
                autoPublish: false,
            },
        );
    });

    it('keeps the chosen theme when going back and forth', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        await userEvent.click(themeSelect());
        await userEvent.click(
            within(screen.getByRole('listbox')).getByText(/Nougat/),
        );
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_next'));
        expect(themeSelect()).toHaveTextContent('Nougat - Nougat theme');
    });

    it('keeps the chosen theme when the same model is chosen again from the catalog', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        await userEvent.click(themeSelect());
        await userEvent.click(
            within(screen.getByRole('listbox')).getByText(/Nougat/),
        );
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_choose_model'));
        await userEvent.click(
            within(
                screen.getByRole('navigation', { name: 'model list' }),
            ).getAllByText('mc_a_title')[0],
        );
        await waitFor(() =>
            expect(
                screen.queryByRole('navigation', { name: 'model list' }),
            ).not.toBeInTheDocument(),
        );
        await userEvent.click(button('site_wizard_next'));
        await userEvent.click(button('site_wizard_next'));
        await userEvent.click(button('site_wizard_next'));
        expect(themeSelect()).toHaveTextContent('Nougat - Nougat theme');
    });

    it('preselects the theme of the new model when the model changes', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_previous'));
        await selectModel('mc_c_title');
        await userEvent.click(button('site_wizard_next'));
        // the inputs of the previous model are reset
        await typeUrl('https://x');
        await userEvent.click(button('site_wizard_next'));
        await userEvent.click(button('site_wizard_next'));
        expect(themeSelect()).toHaveTextContent('Nougat - Nougat theme');
    });

    it('keeps the error while choosing the theme', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        clearError.mockClear();
        await userEvent.click(themeSelect());
        await userEvent.click(
            within(screen.getByRole('listbox')).getByText(/Nougat/),
        );
        expect(clearError).not.toHaveBeenCalled();
    });

    it('keeps the data and the site name when going back and forth', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToSiteInfoStep();
        await typeSiteName('My site');
        await userEvent.click(button('site_wizard_previous'));
        expect(screen.getByText('2/5')).toBeInTheDocument();
        expect(screen.getByLabelText('use_url')).toHaveValue('https://x');
        await userEvent.click(button('site_wizard_next'));
        expect(screen.getByLabelText('site_wizard_site_title')).toHaveValue(
            'My site',
        );
    });

    it('generates the site with the chosen model, data, name, description and theme, only once', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToSiteInfoStep();
        await typeSiteName('My site');
        await userEvent.type(
            screen.getByLabelText('site_wizard_site_subtitle'),
            'About my site',
        );
        await userEvent.click(button('site_wizard_next'));
        await userEvent.click(themeSelect());
        await userEvent.click(
            within(screen.getByRole('listbox')).getByText(/Nougat/),
        );
        await generateSite();
        expect(generate).toHaveBeenCalledWith(
            models[0],
            { type: 'url', url: 'https://x' },
            {
                siteName: 'My site',
                siteDescription: 'About my site',
                theme: 'nougat',
                autoPublish: false,
            },
        );
        await userEvent.click(button('site_wizard_generate'), {
            pointerEventsCheck: 0,
        });
        expect(generate).toHaveBeenCalledTimes(1);
    });

    it('displays the steps and hides the navigation while generating', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(screen.getByText('site_generation_title')).toBeInTheDocument();
        expect(
            screen.getByText('site_generation_step_data'),
        ).toBeInTheDocument();
        // the model name comes from the wizard's choice
        expect(
            screen.getByText('site_generation_step_model+{"name":"mc_a_name"}'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('site_generation_step_settings'),
        ).toBeInTheDocument();
        // a model without launch order launches nothing
        expect(
            screen.queryByText('site_generation_step_launch'),
        ).not.toBeInTheDocument();
        // the pages counter of the wizard is gone: the steps show progress
        expect(screen.queryByText('1/3')).not.toBeInTheDocument();
        expect(
            screen.queryByRole('tab', { name: 'upload_by_url' }),
        ).not.toBeInTheDocument();
        // it looks like the progress dialog that follows
        expect(
            screen.queryByRole('button', { name: 'site_wizard_cancel' }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'site_wizard_previous' }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'site_wizard_generate' }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'site_generation_stop' }),
        ).not.toBeInTheDocument();
    });

    it('announces the launch groups of a model with a launch order, in run order', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep('mc_e_title');
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(
            screen.getByText('site_generation_step_launch'),
        ).toBeInTheDocument();
        // z (precomputed, 1) runs before x (1) and y (2)
        const precomputed = screen.getByText(
            /site_generation_launch_group_precomputed\+.*"current":0,"total":1/,
        );
        const enrichments = screen.getByText(
            /site_generation_launch_group_enrichment\+.*"current":0,"total":2/,
        );
        expect(
            precomputed.compareDocumentPosition(enrichments) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
    });

    it('offers to stop the configuration while the file is sent', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            uploadProgress: null,
            canCancel: true,
            cancelImport,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(
            screen.queryByRole('button', { name: 'site_wizard_generate' }),
        ).not.toBeInTheDocument();
        await userEvent.click(button('site_generation_stop'));
        // the same confirmation as the stop of the progress dialog
        expect(
            screen.getByText('site_generation_stop_title'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('site_generation_stop_description'),
        ).toBeInTheDocument();
        await userEvent.click(button('cancel'));
        await waitFor(() =>
            expect(
                screen.queryByText('site_generation_stop_title'),
            ).not.toBeInTheDocument(),
        );
        expect(cancelImport).not.toHaveBeenCalled();

        await userEvent.click(button('site_generation_stop'));
        await userEvent.click(button('confirm'));
        expect(cancelImport).toHaveBeenCalledTimes(1);
        await waitFor(() =>
            expect(
                screen.queryByText('site_generation_stop_title'),
            ).not.toBeInTheDocument(),
        );
    });

    it('closes the stop confirmation once the upload cannot be stopped anymore', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        const generating = {
            clearError,
            generate,
            isGenerating: true,
            uploadProgress: null,
            canCancel: true,
            cancelImport,
            error: null,
        };
        (useGenerateSite as jest.Mock).mockReturnValue(generating);
        rerender(<SiteWizard open onClose={jest.fn()} />);
        await userEvent.click(button('site_generation_stop'));
        // the import was queued meanwhile
        (useGenerateSite as jest.Mock).mockReturnValue({
            ...generating,
            canCancel: false,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        await waitFor(() =>
            expect(
                screen.queryByText('site_generation_stop_title'),
            ).not.toBeInTheDocument(),
        );
        expect(cancelImport).not.toHaveBeenCalled();
    });

    it('disables the stop button while cancelling', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            uploadProgress: null,
            canCancel: true,
            isCancelling: true,
            cancelImport,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(button('site_wizard_cancelling')).toBeDisabled();
    });

    it('shows the upload progress of a file on the data step', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: true,
            uploadProgress: 45,
            canCancel: true,
            cancelImport,
            error: null,
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        expect(
            screen.getByText('site_generation_step_data'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('site_wizard_uploading+{"progress":45}'),
        ).toBeInTheDocument();
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

    it('hands over to the progress dialog once the upload is queued, keeping its state', async () => {
        generate.mockResolvedValue(undefined);
        const onClose = jest.fn();
        const { rerender } = render(<SiteWizard open onClose={onClose} />);
        await goToThemeStep();
        await generateSite();
        await waitFor(() => expect(onClose).toHaveBeenCalledWith('handedOver'));
        // reopened on retry: the last step, with the choices kept
        rerender(<SiteWizard open={false} onClose={onClose} />);
        rerender(<SiteWizard open onClose={onClose} />);
        expect(button('site_wizard_generate')).toBeEnabled();
        expect(button('site_wizard_previous')).toBeEnabled();
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_previous'));
        expect(
            screen.getByRole('tab', { name: 'upload_by_url' }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('use_url')).toHaveValue('https://x');
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
        expect(screen.getByText('2/5')).toBeInTheDocument();

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

    it('clears the error when the same model is chosen again from the catalog', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await selectModel('mc_a_title');
        clearError.mockClear();
        await userEvent.click(button('site_wizard_choose_model'));
        await userEvent.click(
            within(
                screen.getByRole('navigation', { name: 'model list' }),
            ).getAllByText('mc_a_title')[0],
        );
        expect(clearError).toHaveBeenCalled();
    });

    it('keeps the error while typing the site name or description', async () => {
        render(<SiteWizard open onClose={jest.fn()} />);
        await goToSiteInfoStep();
        clearError.mockClear();
        await typeSiteName('My site');
        await userEvent.type(
            screen.getByLabelText('site_wizard_site_subtitle'),
            'About',
        );
        expect(clearError).not.toHaveBeenCalled();
    });

    it('clears the error when closed after a failure, so that it can close', async () => {
        const onClose = jest.fn();
        const { rerender } = render(<SiteWizard open onClose={onClose} />);
        await goToSiteInfoStep();
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
        await goToSiteInfoStep();
        await typeSiteName('My site');
        await userEvent.click(button('site_wizard_next'));
        await generateSite();
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
        expect(onClose).not.toHaveBeenCalled();
        await waitFor(() =>
            expect(button('site_wizard_generate')).toBeEnabled(),
        );
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_previous'));
        expect(screen.getByLabelText('site_wizard_site_title')).toHaveValue(
            'My site',
        );
    });

    it('keeps the error displayed on the data step, where a failed import is fixed', async () => {
        const { rerender } = render(<SiteWizard open onClose={jest.fn()} />);
        await goToThemeStep();
        (useGenerateSite as jest.Mock).mockReturnValue({
            clearError,
            generate,
            isGenerating: false,
            error: 'boom',
        });
        rerender(<SiteWizard open onClose={jest.fn()} />);
        await userEvent.click(button('site_wizard_previous'));
        await userEvent.click(button('site_wizard_previous'));
        expect(screen.getByText('2/5')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('boom');
        await userEvent.click(button('site_wizard_previous'));
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('sends the same data again when reopened for a retry of the import', async () => {
        generate.mockResolvedValue(undefined);
        const onClose = jest.fn();
        const { rerender } = render(<SiteWizard open onClose={onClose} />);
        await goToThemeStep();
        await generateSite();
        await waitFor(() => expect(onClose).toHaveBeenCalledWith('handedOver'));
        rerender(<SiteWizard open={false} onClose={onClose} />);
        rerender(
            <SiteWizard
                open
                onClose={onClose}
                reopen={{ action: 'retryImport', count: 1 }}
            />,
        );
        await waitFor(() => expect(generate).toHaveBeenCalledTimes(2));
        expect(generate.mock.calls[1]).toEqual(generate.mock.calls[0]);
    });

    it('opens on the data step when reopened to change the data', async () => {
        generate.mockResolvedValue(undefined);
        const onClose = jest.fn();
        const { rerender } = render(<SiteWizard open onClose={onClose} />);
        await goToThemeStep();
        await generateSite();
        await waitFor(() => expect(onClose).toHaveBeenCalledWith('handedOver'));
        rerender(<SiteWizard open={false} onClose={onClose} />);
        rerender(
            <SiteWizard
                open
                onClose={onClose}
                reopen={{ action: 'changeData', count: 1 }}
            />,
        );
        expect(screen.getByText('2/5')).toBeInTheDocument();
        expect(screen.getByLabelText('use_url')).toHaveValue('https://x');
        expect(generate).toHaveBeenCalledTimes(1);
    });
});
