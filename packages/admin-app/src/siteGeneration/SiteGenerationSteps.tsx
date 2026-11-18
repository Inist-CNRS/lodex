import type { ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
    getModelNameKey,
    type SiteGenerationCounter,
    type SiteGenerationStepState,
    type SiteGenerationView,
} from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { ErrorWithDetail } from '@lodex/frontend-common/components/ErrorWithDetail';
import { hasTranslation } from '../siteWizard/hasTranslation';
import type { DisplayedStep } from './displayedSteps';

type Translate = ReturnType<typeof useTranslate>['translate'];

const ICON_SIZE = 24;

const StepIcon = ({ state }: { state: SiteGenerationStepState }) => {
    switch (state) {
        case 'done':
            return <CheckCircleIcon color="primary" aria-label={state} />;
        case 'running':
            return (
                <RadioButtonUncheckedIcon color="primary" aria-label={state} />
            );
        case 'error':
            return <CancelIcon color="warning" aria-label={state} />;
        default:
            return (
                <Box
                    aria-label={state}
                    sx={{
                        width: ICON_SIZE,
                        height: ICON_SIZE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: '2px dashed',
                            borderColor: 'text.disabled',
                        }}
                    />
                </Box>
            );
    }
};

// the short name of the catalog model when it has one, its id otherwise
const getModelName = (translate: Translate, modelId?: string) => {
    if (!modelId) {
        return '';
    }
    const nameKey = getModelNameKey(modelId);
    return hasTranslation(nameKey) ? translate(nameKey) : modelId;
};

const getSettingsDescriptionKey = (
    settings: SiteGenerationView['settings'],
) => {
    if (settings?.siteName && settings.siteDescription) {
        return 'site_generation_settings_name_description';
    }
    if (settings?.siteName) {
        return 'site_generation_settings_name';
    }
    if (settings?.siteDescription) {
        return 'site_generation_settings_description';
    }
    return 'site_generation_settings_theme';
};

const LaunchCounter = ({
    counter,
    countKey,
    errorKey,
}: {
    counter: SiteGenerationCounter;
    countKey: string;
    errorKey: string;
}) => {
    const { translate } = useTranslate();
    if (counter.total === 0) {
        return null;
    }
    return (
        <li>
            {translate(countKey, {
                smart_count: counter.total,
                done: counter.done,
                total: counter.total,
            })}
            {counter.error > 0 && (
                <>
                    {' - '}
                    <Box component="span" sx={{ color: 'warning.main' }}>
                        {translate(errorKey, { smart_count: counter.error })}
                    </Box>
                </>
            )}
        </li>
    );
};

type StepContent = { title: string; description?: ReactNode };

const useStepContent = (
    step: DisplayedStep,
    view: SiteGenerationView | undefined,
    uploadProgress: number | null | undefined,
): StepContent => {
    const { translate, locale } = useTranslate();
    switch (step.key) {
        case 'data':
            return {
                title: translate('site_generation_step_data'),
                description:
                    step.state === 'running' && uploadProgress != null
                        ? translate('site_wizard_uploading', {
                              progress: uploadProgress,
                          })
                        : view?.importedLines != null
                          ? translate('site_generation_imported_lines', {
                                smart_count: view.importedLines,
                                count: view.importedLines.toLocaleString(
                                    locale,
                                ),
                            })
                          : undefined,
            };
        case 'model':
            return {
                title: translate('site_generation_step_model', {
                    name: getModelName(translate, view?.modelId),
                }),
                description: translate(
                    'site_generation_step_model_description',
                ),
            };
        case 'settings':
            return {
                title: translate('site_generation_step_settings'),
                description: translate(
                    getSettingsDescriptionKey(view?.settings),
                ),
            };
        case 'launch':
            return {
                title: translate('site_generation_step_launch'),
                description: view?.launch && (
                    <>
                        {translate('site_generation_launch_intro')}
                        <Box component="ul" sx={{ m: 0, pl: 3 }}>
                            <LaunchCounter
                                counter={view.launch.enrichment}
                                countKey="site_generation_enrichments"
                                errorKey="site_generation_enrichments_error"
                            />
                            <LaunchCounter
                                counter={view.launch.precomputed}
                                countKey="site_generation_precomputed"
                                errorKey="site_generation_precomputed_error"
                            />
                        </Box>
                    </>
                ),
            };
        case 'publication':
            return { title: translate('site_generation_step_publication') };
    }
};

type ErrorMessage = { message: string; detail?: string };

// the error of the generation, and those of its launch steps or of its
// publication
const getErrorMessages = (
    translate: Translate,
    step: DisplayedStep,
    view: SiteGenerationView | undefined,
): ErrorMessage[] => {
    if (step.state !== 'error' || !view) {
        return [];
    }
    if (step.key === 'publication') {
        const message = view.publication?.message;
        return message ? [{ message: translate(message) }] : [];
    }
    const launchErrors =
        step.key === 'launch'
            ? view.steps
                  .filter(
                      (launchStep) =>
                          launchStep.state === 'error' && launchStep.message,
                  )
                  .map((launchStep) => ({
                      message: `${launchStep.name} — ${translate(launchStep.message!)}`,
                  }))
            : [];
    // the server sends a translation key, or the raw error
    return [
        ...(view.message
            ? [{ message: translate(view.message), detail: view.detail }]
            : []),
        ...launchErrors,
    ];
};

const Step = ({
    step,
    view,
    uploadProgress,
    onRetry,
    retryDisabled,
}: {
    step: DisplayedStep;
    view?: SiteGenerationView;
    uploadProgress?: number | null;
    onRetry?: () => void;
    retryDisabled?: boolean;
}) => {
    const { translate } = useTranslate();
    const { title, description } = useStepContent(step, view, uploadProgress);
    const errors = getErrorMessages(translate, step, view);
    return (
        <Box component="li" sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ flexShrink: 0, height: ICON_SIZE }}>
                <StepIcon state={step.state} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight="bold">{title}</Typography>
                {description && (
                    <Typography component="div" sx={{ mt: 0.5 }}>
                        {description}
                    </Typography>
                )}
                {errors.map(({ message, detail }) => (
                    <Typography
                        key={message}
                        component="div"
                        sx={{ mt: 0.5, color: 'warning.main' }}
                    >
                        <ErrorWithDetail message={message} detail={detail} />
                    </Typography>
                ))}
            </Box>
            {step.state === 'error' && onRetry && (
                <Box sx={{ alignSelf: 'center', flexShrink: 0 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onRetry}
                        disabled={retryDisabled}
                    >
                        {translate('site_generation_retry')}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

type SiteGenerationStepsProps = {
    steps: DisplayedStep[];
    view?: SiteGenerationView;
    // percentage of the file being uploaded, on the running data step
    uploadProgress?: number | null;
    onRetry?: () => void;
    retryDisabled?: boolean;
};

export const SiteGenerationSteps = ({
    steps,
    view,
    uploadProgress,
    onRetry,
    retryDisabled,
}: SiteGenerationStepsProps) => (
    <Box
        component="ol"
        sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
        }}
    >
        {steps.map((step) => (
            <Step
                key={step.key}
                step={step}
                view={view}
                uploadProgress={uploadProgress}
                onRetry={onRetry}
                retryDisabled={retryDisabled}
            />
        ))}
    </Box>
);
