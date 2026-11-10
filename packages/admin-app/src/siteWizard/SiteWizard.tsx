import { useRef, useState, type ComponentType } from 'react';
import {
    Alert,
    Box,
    Button,
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
import type { CatalogModel } from '@lodex/common';
import { ConfirmPopup } from '@lodex/frontend-common/components/ConfirmPopup';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    getDatasetSource,
    type DatasetSourceTab,
} from '../upload/DatasetSourceInput';
import { DataStep, DataStepHeader } from './DataStep';
import { ModelStep } from './ModelStep';
import { useDisplayableModels } from './useDisplayableModels';
import { useGenerateSite } from './useGenerateSite';

type WizardState = {
    modelId: string;
    tab: DatasetSourceTab;
    files: FileObject[];
    url: string;
    text: string;
};

type StepProps = {
    state: WizardState;
    onChange: (patch: Partial<WizardState>) => void;
    models: CatalogModel[];
};

type WizardStep = {
    // shown under the wizard title
    Header: ComponentType<StepProps>;
    Component: ComponentType<StepProps>;
    canContinue: (state: WizardState) => boolean;
};

const INITIAL_STATE: WizardState = {
    modelId: '',
    tab: 'file',
    files: [],
    url: '',
    text: '',
};

const findModel = (models: CatalogModel[], id: string) =>
    models.find((model) => model.id === id);

const ModelStepContent = ({ state, onChange, models }: StepProps) => (
    <ModelStep
        models={models}
        selectedId={state.modelId}
        onSelect={(modelId) => onChange({ modelId })}
    />
);

const ModelStepHeader = () => {
    const { translate } = useTranslate();
    return (
        <Typography color="text.secondary">
            {translate('site_wizard_subtitle')}
        </Typography>
    );
};

const modelStep: WizardStep = {
    Header: ModelStepHeader,
    Component: ModelStepContent,
    canContinue: (state) => !!state.modelId,
};

const DataStepHeaderContent = ({ state, models }: StepProps) => {
    const model = findModel(models, state.modelId);
    return model ? <DataStepHeader model={model} /> : null;
};

const DataStepContent = ({ state, onChange }: StepProps) => (
    <DataStep
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
    Header: DataStepHeaderContent,
    Component: DataStepContent,
    canContinue: (state) => getDatasetSource(state) !== null,
};

const STEPS: WizardStep[] = [modelStep, dataStep];

type SiteWizardProps = {
    open: boolean;
    onClose: () => void;
};

export const SiteWizard = ({ open, onClose }: SiteWizardProps) => {
    const { translate } = useTranslate();
    const models = useDisplayableModels();
    const {
        generate,
        isGenerating,
        isWaitingForImport,
        cancelImport,
        error,
        clearError,
    } = useGenerateSite();
    const [index, setIndex] = useState(0);
    const [state, setState] = useState<WizardState>(INITIAL_STATE);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const isSubmittingRef = useRef(false);

    const step = STEPS[index];
    const isLastStep = index === STEPS.length - 1;
    const { Header, Component } = step;

    const handleChange = (patch: Partial<WizardState>) => {
        // the displayed error is about the previous inputs
        clearError();
        setState((current) => ({ ...current, ...patch }));
    };

    const close = () => {
        setIndex(0);
        setState(INITIAL_STATE);
        setIsCancelConfirmOpen(false);
        // the dialog stays open while an error is displayed
        clearError();
        onClose();
    };

    const handleGenerate = async () => {
        const model = findModel(models, state.modelId);
        const source = getDatasetSource(state);
        if (isSubmittingRef.current || !model || !source) {
            return;
        }
        isSubmittingRef.current = true;
        try {
            await generate(model, source);
            close();
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
            disableEscapeKeyDown
            onClose={(_, reason) => {
                if (reason !== 'backdropClick' && !isGenerating) {
                    setIsCancelConfirmOpen(true);
                }
            }}
        >
            <DialogTitle
                component="div"
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={4}
            >
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
                    {!isGenerating && (
                        <Header
                            state={state}
                            onChange={handleChange}
                            models={models}
                        />
                    )}
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
            <DialogContent>
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
                        {isWaitingForImport && (
                            <Button color="primary" onClick={cancelImport}>
                                {translate('site_wizard_cancel_import')}
                            </Button>
                        )}
                    </Box>
                ) : (
                    <>
                        {error && isLastStep && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Component
                            state={state}
                            onChange={handleChange}
                            models={models}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between' }}>
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
                onConfirm={close}
            />
        </Dialog>
    );
};
