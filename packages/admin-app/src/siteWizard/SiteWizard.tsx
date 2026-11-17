import { useRef, useState, type ComponentType } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { FileObject } from 'mui-file-dropzone';
import { getModelTitleKey, type CatalogModel } from '@lodex/common';
import { ConfirmPopup } from '@lodex/frontend-common/components/ConfirmPopup';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    getDatasetSource,
    type DatasetSourceTab,
} from '../upload/DatasetSourceInput';
import { DataStep } from './DataStep';
import { GenerationError } from './GenerationError';
import { ModelStep } from './ModelStep';
import { PublishStep } from './PublishStep';
import { SiteInfoStep } from './SiteInfoStep';
import { getPreselectedTheme, ThemeStep } from './ThemeStep';
import { useGetAvailableThemes } from '../configTenant/useGetAvailableThemes';
import { useDisplayableModels } from './useDisplayableModels';
import { useGenerateSite } from './useGenerateSite';

type WizardState = {
    modelId: string;
    tab: DatasetSourceTab;
    files: FileObject[];
    url: string;
    text: string;
    siteName: string;
    siteDescription: string;
    // the theme picked by the user, empty until then
    theme: string;
    autoPublish: boolean;
};

type StepProps = {
    state: WizardState;
    onChange: (patch: Partial<WizardState>) => void;
    models: CatalogModel[];
    // the chosen model, once there is one
    model?: CatalogModel;
    // the only observer of the themes: another one would refetch a failed
    // query with its own options
    themesQuery: ReturnType<typeof useGetAvailableThemes>;
};

type WizardStep = {
    Component: ComponentType<StepProps>;
    canContinue: (state: WizardState) => boolean;
};

// the displayed error is about the model or the data: these cannot fix it
const KEYS_KEEPING_ERROR: (keyof WizardState)[] = [
    'siteName',
    'siteDescription',
    'theme',
    'autoPublish',
];

const INITIAL_STATE: WizardState = {
    modelId: '',
    tab: 'file',
    files: [],
    url: '',
    text: '',
    siteName: '',
    siteDescription: '',
    theme: '',
    autoPublish: false,
};

const ModelStepContent = ({ state, onChange, models }: StepProps) => (
    <ModelStep
        models={models}
        selectedId={state.modelId}
        onSelect={(modelId) =>
            onChange(
                // the catalog dialog also selects the model already selected:
                // its inputs and theme are kept
                modelId === state.modelId
                    ? { modelId }
                    : {
                          modelId,
                          // open the first import type allowed by the model
                          tab:
                              models.find((model) => model.id === modelId)
                                  ?.importTypes[0] ?? INITIAL_STATE.tab,
                          // the inputs of the previous model may not be
                          // offered anymore
                          files: INITIAL_STATE.files,
                          url: INITIAL_STATE.url,
                          text: INITIAL_STATE.text,
                          // forgets the theme picked for the previous model
                          theme: INITIAL_STATE.theme,
                      },
            )
        }
    />
);

const modelStep: WizardStep = {
    Component: ModelStepContent,
    canContinue: (state) => !!state.modelId,
};

const DataStepContent = ({ state, onChange, model }: StepProps) => (
    <DataStep
        model={model}
        tabs={model?.importTypes}
        tab={state.tab}
        onTabChange={(tab) => onChange({ tab })}
        files={state.files}
        onFilesChange={(files) => onChange({ files })}
        url={state.url}
        onUrlChange={(url) => onChange({ url })}
        text={state.text}
        onTextChange={(text) => onChange({ text })}
    />
);

const dataStep: WizardStep = {
    Component: DataStepContent,
    canContinue: (state) => getDatasetSource(state) !== null,
};

const SiteInfoStepContent = ({ state, onChange }: StepProps) => (
    <SiteInfoStep
        siteName={state.siteName}
        onSiteNameChange={(siteName) => onChange({ siteName })}
        siteDescription={state.siteDescription}
        onSiteDescriptionChange={(siteDescription) =>
            onChange({ siteDescription })
        }
    />
);

const siteInfoStep: WizardStep = {
    Component: SiteInfoStepContent,
    // both fields are optional
    canContinue: () => true,
};

const ThemeStepContent = ({
    state,
    onChange,
    model,
    themesQuery,
}: StepProps) => (
    <ThemeStep
        model={model}
        themes={themesQuery.data}
        isLoading={themesQuery.isLoading}
        // a failed refetch keeps the list loaded before
        hasError={!!themesQuery.error && !themesQuery.data}
        theme={state.theme}
        onThemeChange={(theme) => onChange({ theme })}
    />
);

const themeStep: WizardStep = {
    Component: ThemeStepContent,
    // once the themes are loaded, or failed to
    canContinue: (state) => !!state.theme,
};

const PublishStepContent = ({ state, onChange }: StepProps) => (
    <PublishStep
        autoPublish={state.autoPublish}
        onAutoPublishChange={(autoPublish) => onChange({ autoPublish })}
    />
);

const publishStep: WizardStep = {
    Component: PublishStepContent,
    canContinue: () => true,
};

const STEPS: WizardStep[] = [
    modelStep,
    dataStep,
    siteInfoStep,
    themeStep,
    publishStep,
];
// a generation error is mostly about the data: show it from the data step on
const FIRST_STEP_WITH_ERROR = STEPS.indexOf(dataStep);

// dismissed: the user chose to configure the site manually (first step);
// cancelled: the user left a later step
export type SiteWizardCloseReason = 'generated' | 'dismissed' | 'cancelled';

type SiteWizardProps = {
    open: boolean;
    onClose: (reason: SiteWizardCloseReason) => void;
};

export const SiteWizard = ({ open, onClose }: SiteWizardProps) => {
    const { translate } = useTranslate();
    const models = useDisplayableModels();
    const {
        generate,
        isGenerating,
        uploadProgress,
        canCancel,
        isCancelling,
        cancelImport,
        error,
        clearError,
    } = useGenerateSite();
    // fetched once opened, before the theme step that needs it: the host
    // keeps the wizard mounted while closed
    const themesQuery = useGetAvailableThemes({
        enabled: open,
        // the step falls back to a theme without the list: no need to wait
        retry: false,
    });
    const [index, setIndex] = useState(0);
    const [userState, setState] = useState<WizardState>(INITIAL_STATE);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const isSubmittingRef = useRef(false);

    const step = STEPS[index];
    const isLastStep = index === STEPS.length - 1;
    const { Component } = step;
    const model = models.find(({ id }) => id === userState.modelId);
    const state = {
        ...userState,
        theme:
            userState.theme ||
            (themesQuery.isLoading
                ? ''
                : getPreselectedTheme(model, themesQuery.data)),
    };

    const handleChange = (patch: Partial<WizardState>) => {
        if (
            (Object.keys(patch) as (keyof WizardState)[]).some(
                (key) => !KEYS_KEEPING_ERROR.includes(key),
            )
        ) {
            clearError();
        }
        setState((current) => ({ ...current, ...patch }));
    };

    const close = (reason: SiteWizardCloseReason) => {
        setIndex(0);
        setState(INITIAL_STATE);
        setIsCancelConfirmOpen(false);
        // the dialog stays open while an error is displayed
        clearError();
        onClose(reason);
    };

    const handleGenerate = async () => {
        const source = getDatasetSource(state);
        if (isSubmittingRef.current || !model || !source) {
            return;
        }
        isSubmittingRef.current = true;
        try {
            await generate(model, source, {
                siteName: state.siteName,
                siteDescription: state.siteDescription,
                theme: state.theme,
                autoPublish: state.autoPublish,
            });
            close('generated');
        } catch {
            // the error is displayed from useGenerateSite
        } finally {
            isSubmittingRef.current = false;
        }
    };

    const handleNext = () => {
        if (isLastStep) {
            handleGenerate();
            return;
        }
        setIndex(index + 1);
    };

    return (
        <Dialog
            // the host keeps it open until it is closed
            open={open}
            fullWidth
            maxWidth="md"
            // only the cancel buttons close it, after a confirmation
            disableEscapeKeyDown
            // a fixed height: the dialog does not jump between steps, a long
            // step scrolls
            PaperProps={{ sx: { height: 'min(720px, 90vh)', p: 4 } }}
        >
            <DialogTitle
                component="div"
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={4}
                sx={{ p: 0, mb: 2 }}
            >
                {/* the same header on every step */}
                <Box>
                    {/* same heading style as AnnotationHeader */}
                    <Typography
                        variant="h1"
                        fontSize={24}
                        fontWeight={700}
                        color="text.primary"
                    >
                        {translate('site_wizard_title')}
                    </Typography>
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        alignItems="center"
                        columnGap={1.5}
                    >
                        <Typography color="text.secondary">
                            {translate('site_wizard_subtitle')}
                        </Typography>
                        {/* the chosen model, once past its step */}
                        {model && index > 0 && (
                            <Chip
                                size="small"
                                color="primary"
                                variant="outlined"
                                label={translate(getModelTitleKey(model.id))}
                            />
                        )}
                    </Box>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    gap={1}
                    pt={1}
                    flexShrink={0}
                >
                    <LinearProgress
                        variant="determinate"
                        value={((index + 1) / STEPS.length) * 100}
                        sx={{ width: 240, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body1">
                        {`${index + 1}/${STEPS.length}`}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ px: 0 }}>
                {isGenerating ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={2}
                        py={6}
                    >
                        <CircularProgress />
                        <Typography>
                            {translate('site_wizard_generating')}
                        </Typography>
                        {uploadProgress !== null && (
                            <Box width="60%">
                                <LinearProgress
                                    variant="determinate"
                                    value={uploadProgress}
                                    aria-label={translate(
                                        'site_wizard_uploading',
                                        {
                                            progress: uploadProgress,
                                        },
                                    )}
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    textAlign="center"
                                    mt={1}
                                >
                                    {translate('site_wizard_uploading', {
                                        progress: uploadProgress,
                                    })}
                                </Typography>
                            </Box>
                        )}
                        {canCancel && (
                            <Button
                                color="primary"
                                onClick={cancelImport}
                                // the cancel waits for the server (5 s at most)
                                disabled={isCancelling}
                            >
                                {translate(
                                    isCancelling
                                        ? 'site_wizard_cancelling'
                                        : 'site_wizard_cancel_import',
                                )}
                            </Button>
                        )}
                    </Box>
                ) : (
                    <>
                        {error && index >= FIRST_STEP_WITH_ERROR && (
                            <GenerationError error={error} />
                        )}
                        <Component
                            state={state}
                            onChange={handleChange}
                            models={models}
                            model={model}
                            themesQuery={themesQuery}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions
                sx={{ justifyContent: 'space-between', px: 0, pb: 0 }}
            >
                <Box>
                    {index > 0 && (
                        <Button
                            color="inherit"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => setIndex(index - 1)}
                            disabled={isGenerating}
                        >
                            {translate('site_wizard_previous')}
                        </Button>
                    )}
                </Box>
                <Box display="flex" gap={1}>
                    <Button
                        color="inherit"
                        onClick={() => setIsCancelConfirmOpen(true)}
                        disabled={isGenerating}
                    >
                        {translate(
                            index === 0
                                ? 'site_wizard_manual'
                                : 'site_wizard_cancel',
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={isLastStep ? undefined : <ArrowForwardIcon />}
                        onClick={handleNext}
                        disabled={!step.canContinue(state) || isGenerating}
                    >
                        {translate(
                            isLastStep
                                ? 'site_wizard_generate'
                                : 'site_wizard_next',
                        )}
                    </Button>
                </Box>
            </DialogActions>
            <ConfirmPopup
                isOpen={isCancelConfirmOpen}
                title={translate('site_wizard_cancel_title')}
                description={translate('site_wizard_cancel_description')}
                cancelLabel={translate('cancel')}
                confirmLabel={translate('confirm')}
                onCancel={() => setIsCancelConfirmOpen(false)}
                onConfirm={() => close(index === 0 ? 'dismissed' : 'cancelled')}
            />
        </Dialog>
    );
};
