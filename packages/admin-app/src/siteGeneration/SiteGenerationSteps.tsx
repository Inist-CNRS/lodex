import { Fragment, useEffect, useRef, type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
    getModelLaunchStepLabelKey,
    getModelNameKey,
    MODEL_LAUNCH_STEP_TYPES,
    type ModelLaunchStepType,
    ProgressStatus,
    type SiteGenerationStepState,
    type SiteGenerationView,
} from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { ErrorWithDetail } from '@lodex/frontend-common/components/ErrorWithDetail';
import { hasTranslation } from '../siteWizard/hasTranslation';
import {
    getLaunchGroups,
    type DisplayedStep,
    type LaunchGroup,
    type RankedLaunchStep,
} from './displayedSteps';
import type { ImportProgress } from './useSiteGeneration';

type Translate = ReturnType<typeof useTranslate>['translate'];

const ICON_SIZE = 24;

const StepIcon = ({ state }: { state: SiteGenerationStepState }) => {
    switch (state) {
        case 'done':
            return <CheckCircleIcon color="primary" aria-label={state} />;
        case 'running':
            // a halo spreads from the circle while the step runs
            return (
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 2,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            animation: 'lodex-step-halo 1.6s ease-out infinite',
                            pointerEvents: 'none',
                        },
                        '@keyframes lodex-step-halo': {
                            from: { transform: 'scale(1)', opacity: 0.6 },
                            to: { transform: 'scale(1.9)', opacity: 0 },
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                            '&::after': { animation: 'none', opacity: 0 },
                        },
                    }}
                >
                    <RadioButtonUncheckedIcon
                        color="primary"
                        aria-label={state}
                    />
                </Box>
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

// the label of a launch step for its model when it has one, its rank among
// the steps of its type otherwise
const getStepLabel = (
    translate: Translate,
    modelId: string | undefined,
    step: RankedLaunchStep,
) => {
    const labelKey =
        modelId && getModelLaunchStepLabelKey(modelId, step.type, step.name);
    return labelKey && hasTranslation(labelKey)
        ? translate(labelKey)
        : translate(`site_generation_step_fallback_${step.type}`, {
              rank: step.rank,
          });
};

// the label of a launch step, with its name to find it in the model
const getStepFullLabel = (
    translate: Translate,
    modelId: string | undefined,
    step: RankedLaunchStep,
) => `${getStepLabel(translate, modelId, step)} (${step.name})`;

// before the launch, its steps are unknown: the counts of the model
const COUNT_KEYS: Record<ModelLaunchStepType, string> = {
    enrichment: 'site_generation_enrichments',
    precomputed: 'site_generation_precomputed',
};

const ERROR_KEYS: Record<ModelLaunchStepType, string> = {
    enrichment: 'site_generation_enrichments_error',
    precomputed: 'site_generation_precomputed_error',
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

// next to its counter, the enrichments or precomputations running now: a
// new name slides in, a dot beats while they run
const LaunchRunning = ({ names }: { names: string[] }) => {
    const { translate } = useTranslate();
    if (!names.length) {
        return null;
    }
    const label = names.join(', ');
    return (
        <Box
            component="span"
            role="status"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                ml: 1.5,
                color: 'text.secondary',
                '@keyframes lodex-launch-beat': {
                    '0%, 100%': { transform: 'scale(0.7)', opacity: 0.5 },
                    '50%': { transform: 'scale(1)', opacity: 1 },
                },
                '@keyframes lodex-launch-in': {
                    from: { transform: 'translateY(6px)', opacity: 0 },
                    to: { transform: 'none', opacity: 1 },
                },
                '@media (prefers-reduced-motion: reduce)': {
                    '& *': { animation: 'none !important' },
                },
            }}
        >
            <Box
                component="span"
                aria-hidden
                sx={{
                    width: 8,
                    height: 8,
                    flexShrink: 0,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    animation: 'lodex-launch-beat 1.6s ease-in-out infinite',
                }}
            />
            <Box
                component="span"
                // a new key replays the slide in
                key={label}
                sx={{
                    animation:
                        'lodex-launch-in 320ms cubic-bezier(0.2, 0, 0, 1)',
                }}
            >
                {translate('site_generation_launch_running', { names: label })}
            </Box>
        </Box>
    );
};

// a line of the launch: its count, its steps in error, and those running now
const LaunchLine = ({
    count,
    error,
    type,
    running = [],
}: {
    count: string;
    error: number;
    type: ModelLaunchStepType;
    // the labels of its steps running now
    running?: string[];
}) => {
    const { translate } = useTranslate();
    return (
        <li>
            <span>
                {count}
                {error > 0 && (
                    <>
                        {' - '}
                        <Box component="span" sx={{ color: 'warning.main' }}>
                            {translate(ERROR_KEYS[type], {
                                smart_count: error,
                            })}
                        </Box>
                    </>
                )}
            </span>
            <LaunchRunning names={running} />
        </li>
    );
};

// a launch step relaunched after a failure: which one, its attempt, and why
// the previous run failed
const LaunchRetry = ({
    name,
    retry,
}: {
    name: string;
    retry: NonNullable<SiteGenerationView['steps'][number]['retry']>;
}) => {
    const { translate } = useTranslate();
    return (
        <li>
            {translate('site_generation_step_retrying', {
                name,
                attempt: retry.attempt,
                max: retry.max,
            })}
            {retry.message && (
                <>
                    {' - '}
                    <Box component="span" sx={{ color: 'warning.main' }}>
                        {/* the server sends a translation key, or the raw error */}
                        {translate(retry.message)}
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
    // the groups of the launch step, empty for the other steps
    launchGroups: LaunchGroup[],
    uploadProgress: number | null | undefined,
    importProgress: ImportProgress | null | undefined,
): StepContent => {
    const { translate, locale } = useTranslate();
    const importedLines = (lines: number) =>
        translate('site_generation_imported_lines', {
            smart_count: lines,
            count: lines.toLocaleString(locale),
        });
    // a data add reports the whole dataset, not only the lines it imported
    const datasetLines = (lines: number) =>
        translate('site_generation_dataset_lines', {
            smart_count: lines,
            count: lines.toLocaleString(locale),
        });
    const isRunning = step.state === 'running';
    const getRunningLabels = (group: LaunchGroup) =>
        isRunning
            ? group.steps
                  .filter(
                      (launchStep) =>
                          launchStep.state === 'running' &&
                          // shown with its attempt
                          !launchStep.retry,
                  )
                  .map((launchStep) =>
                      getStepLabel(translate, view?.modelId, launchStep),
                  )
            : [];
    switch (step.key) {
        case 'data':
            return {
                title: translate('site_generation_step_data'),
                description:
                    isRunning && uploadProgress != null
                        ? translate('site_wizard_uploading', {
                              progress: uploadProgress,
                          })
                        : isRunning && importProgress
                          ? importProgress.status ===
                            ProgressStatus.SAVING_DATASET
                              ? `${translate(importProgress.status)} — ${importedLines(importProgress.lines)}`
                              : translate(importProgress.status)
                          : view?.importedLines != null
                            ? view.kind === 'addData'
                                ? datasetLines(view.importedLines)
                                : importedLines(view.importedLines)
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
                description: view?.launch &&
                    view.launch.enrichment.total +
                        view.launch.precomputed.total >
                        0 && (
                        <>
                            {translate('site_generation_launch_intro')}
                            <Box component="ul" sx={{ m: 0, pl: 3 }}>
                                {launchGroups.length > 0
                                    ? launchGroups.map((group) => (
                                          <Fragment
                                              key={`${group.type}-${group.steps[0].rank}`}
                                          >
                                              <LaunchLine
                                                  count={translate(
                                                      `site_generation_launch_group_${group.type}`,
                                                      {
                                                          smart_count:
                                                              group.total,
                                                          // the steps launched, so that
                                                          // the count never goes back
                                                          current:
                                                              group.done +
                                                              group.running +
                                                              group.error,
                                                          total: group.total,
                                                      },
                                                  )}
                                                  error={group.error}
                                                  type={group.type}
                                                  running={getRunningLabels(
                                                      group,
                                                  )}
                                              />
                                              {/* under the line of its group */}
                                              {group.steps
                                                  .filter(
                                                      (launchStep) =>
                                                          launchStep.retry,
                                                  )
                                                  .map((launchStep) => (
                                                      <LaunchRetry
                                                          key={`${launchStep.type}-${launchStep.rank}`}
                                                          name={getStepFullLabel(
                                                              translate,
                                                              view.modelId,
                                                              launchStep,
                                                          )}
                                                          retry={
                                                              launchStep.retry!
                                                          }
                                                      />
                                                  ))}
                                          </Fragment>
                                      ))
                                    : MODEL_LAUNCH_STEP_TYPES.map(
                                          (type) =>
                                              [
                                                  type,
                                                  view.launch![type],
                                              ] as const,
                                      )
                                          .filter(
                                              ([, counter]) =>
                                                  counter.total > 0,
                                          )
                                          .map(([type, counter]) => (
                                              <LaunchLine
                                                  key={type}
                                                  count={translate(
                                                      COUNT_KEYS[type],
                                                      {
                                                          smart_count:
                                                              counter.total,
                                                          done: counter.done,
                                                          total: counter.total,
                                                      },
                                                  )}
                                                  error={counter.error}
                                                  type={type}
                                              />
                                          ))}
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
    launchGroups: LaunchGroup[],
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
            ? launchGroups
                  .flatMap(({ steps }) => steps)
                  .filter(
                      (launchStep) =>
                          launchStep.state === 'error' && launchStep.message,
                  )
                  .map((launchStep) => ({
                      message: `${getStepFullLabel(translate, view.modelId, launchStep)} — ${translate(launchStep.message!)}`,
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

// the line down to the next step, filled once the step is done: the list
// shows its own progress, in place
const Connector = ({ isFilled }: { isFilled: boolean }) => (
    <Box
        aria-hidden
        sx={{
            flex: 1,
            width: 2,
            my: 0.5,
            borderRadius: 1,
            bgcolor: 'divider',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                bgcolor: 'primary.main',
                transformOrigin: 'top',
                transform: isFilled ? 'none' : 'scaleY(0)',
                transition: 'transform 600ms cubic-bezier(0.2, 0, 0, 1)',
            },
            '@media (prefers-reduced-motion: reduce)': {
                '&::after': { transition: 'none' },
            },
        }}
    />
);

const Step = ({
    step,
    index,
    isLast,
    appear,
    view,
    uploadProgress,
    importProgress,
    onRetry,
    retryDisabled,
}: {
    step: DisplayedStep;
    index: number;
    isLast: boolean;
    appear?: boolean;
    view?: SiteGenerationView;
    uploadProgress?: number | null;
    importProgress?: ImportProgress | null;
    onRetry?: () => void;
    retryDisabled?: boolean;
}) => {
    const { translate } = useTranslate();
    const launchGroups =
        step.key === 'launch' && view ? getLaunchGroups(view.steps) : [];
    const { title, description } = useStepContent(
        step,
        view,
        launchGroups,
        uploadProgress,
        importProgress,
    );
    const errors = getErrorMessages(translate, step, view, launchGroups);
    const isRetryShown = step.state === 'error' && !!onRetry;
    // the dialog keeps one height: on a small screen, a failed last step and
    // its Retry button can be below the fold
    const ref = useRef<HTMLLIElement>(null);
    useEffect(() => {
        if (isRetryShown) {
            ref.current?.scrollIntoView?.({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [isRetryShown]);
    return (
        <Box
            component="li"
            ref={ref}
            sx={{
                display: 'flex',
                gap: 1.5,
                ...(appear && {
                    // one after the other, from the top
                    animation: `lodex-step-appear 400ms ${index * 70}ms cubic-bezier(0.2, 0, 0, 1) both`,
                }),
            }}
        >
            <Box
                sx={{
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ height: ICON_SIZE }}>
                    <StepIcon state={step.state} />
                </Box>
                {!isLast && <Connector isFilled={step.state === 'done'} />}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 3 }}>
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
            {isRetryShown && (
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
    // lines saved so far, on the running data step
    importProgress?: ImportProgress | null;
    onRetry?: () => void;
    retryDisabled?: boolean;
    // the steps come in one after the other: the wizard turns into them
    appear?: boolean;
};

export const SiteGenerationSteps = ({
    steps,
    appear,
    view,
    uploadProgress,
    importProgress,
    onRetry,
    retryDisabled,
}: SiteGenerationStepsProps) => (
    <Box
        component="ol"
        sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            '@keyframes lodex-step-appear': {
                from: { transform: 'translateY(12px)', opacity: 0 },
                to: { transform: 'none', opacity: 1 },
            },
            '@media (prefers-reduced-motion: reduce)': {
                '& > li': { animation: 'none' },
            },
        }}
    >
        {steps.map((step, index) => (
            <Step
                key={step.key}
                step={step}
                index={index}
                isLast={index === steps.length - 1}
                appear={appear}
                view={view}
                uploadProgress={uploadProgress}
                importProgress={importProgress}
                onRetry={onRetry}
                retryDisabled={retryDisabled}
            />
        ))}
    </Box>
);
