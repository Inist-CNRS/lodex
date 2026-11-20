import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
} from '@mui/material';
import { isSiteGenerationActive, toast } from '@lodex/common';
import { ConfirmPopup } from '@lodex/frontend-common/components/ConfirmPopup';
import { loadField } from '@lodex/frontend-common/fields/reducer';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { loadEnrichments } from '../enrichment';
import { loadParsingResult } from '../parsing';
import { loadPrecomputed } from '../precomputed';
import { loadPublication } from '../publication';
import { loadSubresources } from '../subresource';
import { getErrorDetail } from '../commons/getErrorDetail';
import { getDisplayedSteps } from './displayedSteps';
import { SiteGenerationHeader } from './SiteGenerationHeader';
import { SiteGenerationSteps } from './SiteGenerationSteps';
import { useSiteGeneration, useSiteGenerationPush } from './useSiteGeneration';
import { SITE_MODEL_QUERY_KEY } from '../upload/useSiteModel';
import { GENERATION_DIALOG_PAPER_PROPS } from '../siteWizard/wizardDialogPaper';
import type { SiteWizardLocationState } from '../siteWizard/SiteWizardHost';

const SUPPORT_EMAIL = 'support-lodex@listes.istex.fr';

// the import errors that the same data would meet again: the data (or the
// loader) must change. The others (source unavailable, timeout…) may pass.
const DATA_ERRORS = [
    'import_error_no_line',
    'import_error_invalid_query',
    'import_error_source_not_found',
    'import_error_invalid_format',
    'import_error_loader',
];

// turns the support email of a translated text into a mailto link
const WithEmailLink = ({ text }: { text: string }) => {
    const [before, ...rest] = text.split(SUPPORT_EMAIL);
    return (
        <>
            {before}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            {rest.join(SUPPORT_EMAIL)}
        </>
    );
};

export const SiteGenerationDialog = () => {
    const { translate } = useTranslate();
    const dispatch = useDispatch();
    const history = useHistory();
    const queryClient = useQueryClient();
    const { generation, relaunch, stop, isActing, isStopping } =
        useSiteGeneration();
    const importProgress = useSiteGenerationPush();
    const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);
    const previousStatus = useRef(generation?.status);

    const status = generation?.status;
    const isOpen = isSiteGenerationActive(status);
    useEffect(() => {
        if (!isOpen) {
            setIsStopConfirmOpen(false);
        }
    }, [isOpen]);
    useEffect(() => {
        const previous = previousStatus.current;
        previousStatus.current = status;
        const hasEnded = status === 'done' || status === 'stopped';
        if (!hasEnded || !isSiteGenerationActive(previous)) {
            return;
        }
        // the generation changed the whole instance (a stopped one keeps
        // what its finished steps did)
        dispatch(loadField());
        dispatch(loadPublication());
        dispatch(loadSubresources());
        dispatch(loadEnrichments());
        dispatch(loadPrecomputed());
        dispatch(loadParsingResult());
        // the model import changes the site name, description and theme
        queryClient.resetQueries({ queryKey: ['get-config-tenant'] });
        // the wizard writes the memory of the site model
        queryClient.resetQueries({ queryKey: SITE_MODEL_QUERY_KEY });
        if (status === 'done' && generation?.themeNotFound) {
            toast(
                translate('site_wizard_theme_not_found', {
                    theme: generation.themeNotFound,
                }),
                { type: 'warning' },
            );
        }
    }, [status, generation?.themeNotFound, dispatch, translate, queryClient]);

    if (!generation || !isOpen) {
        return null;
    }

    const steps = getDisplayedSteps(generation);
    const isGenerationStopping = status === 'stopping';
    // only the publication failed: nothing for the support
    const hasPublicationError = generation.publication?.state === 'error';
    const hasStepError = status === 'error' && !hasPublicationError;
    const stopDescription =
        status === 'publishing'
            ? 'site_generation_stop_publication_description'
            : hasPublicationError
              ? 'site_generation_stop_failed_publication_description'
              : 'site_generation_stop_description';

    const run = async (action: () => Promise<void>) => {
        try {
            await action();
            return true;
        } catch (error) {
            toast(
                translate('site_generation_action_error', {
                    // the API answers with a translation key (e.g. a 409)
                    error: translate(getErrorDetail(error)),
                }),
                { type: 'error' },
            );
            return false;
        }
    };

    const isDataRetry = generation.phase === 'data';
    const isDataError =
        isDataRetry &&
        generation.kind !== 'addData' &&
        DATA_ERRORS.includes(generation.message ?? '');
    const handleRetry = async () => {
        // a failed data import of the wizard leaves the instance empty: the
        // wizard, which kept the data, sends them anew in its place, or
        // opens on its data step to change them. A failed data add keeps the
        // dataset: back to the data add page
        const retryTarget =
            generation.kind === 'addData'
                ? { pathname: '/data/add' }
                : {
                      pathname: '/data/existing',
                      state: {
                          reopenSiteWizard: isDataError
                              ? 'changeData'
                              : 'retryImport',
                      } satisfies SiteWizardLocationState,
                  };
        const isRelaunched = await run(relaunch);
        if (isRelaunched && isDataRetry) {
            history.push(retryTarget.pathname, retryTarget.state);
        }
    };

    const handleStop = async () => {
        await run(stop);
        setIsStopConfirmOpen(false);
    };

    return (
        <Dialog
            open
            fullWidth
            maxWidth="md"
            disableEscapeKeyDown
            aria-labelledby="site-generation-title"
            // it takes over from the upload dialog, which shows the same
            // content at the same place: a fade in would flash
            transitionDuration={{ enter: 0 }}
            PaperProps={GENERATION_DIALOG_PAPER_PROPS}
        >
            <SiteGenerationHeader />
            {/* room for the halo of the running step, which the content clips */}
            <DialogContent sx={{ px: 1.5, mx: -1.5 }}>
                <SiteGenerationSteps
                    steps={steps}
                    view={generation}
                    importProgress={importProgress}
                    onRetry={handleRetry}
                    retryLabel={
                        isDataError
                            ? 'site_generation_change_data'
                            : 'site_generation_retry'
                    }
                    retryDisabled={isActing || isGenerationStopping}
                />
                {isGenerationStopping && (
                    <Box
                        role="status"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 3,
                        }}
                    >
                        <CircularProgress size={20} />
                        {translate('site_generation_stopping')}
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 0, pb: 0 }}>
                <Button
                    color="inherit"
                    onClick={() => setIsStopConfirmOpen(true)}
                    disabled={isActing || isGenerationStopping}
                >
                    {translate('site_generation_stop')}
                </Button>
            </DialogActions>
            <ConfirmPopup
                isOpen={isStopConfirmOpen}
                title={translate('site_generation_stop_title')}
                description={
                    <>
                        {translate(stopDescription)}
                        {hasStepError && (
                            <>
                                {' '}
                                <WithEmailLink
                                    text={translate(
                                        'site_generation_stop_support',
                                        { email: SUPPORT_EMAIL },
                                    )}
                                />
                            </>
                        )}
                        {isStopping && (
                            <Box
                                role="status"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 2,
                                }}
                            >
                                <CircularProgress size={20} />
                                {translate('site_generation_stopping')}
                            </Box>
                        )}
                    </>
                }
                cancelLabel={translate('cancel')}
                confirmLabel={translate('confirm')}
                isLoading={isActing}
                // the backdrop must not hide the popup while it stops
                onCancel={() => !isStopping && setIsStopConfirmOpen(false)}
                onConfirm={handleStop}
            />
        </Dialog>
    );
};
