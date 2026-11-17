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
import { WIZARD_DIALOG_PAPER_PROPS } from '../siteWizard/wizardDialogPaper';

const SUPPORT_EMAIL = 'support-lodex@listes.istex.fr';

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
    useSiteGenerationPush();
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

    const handleRetry = async () => {
        // a failed data import leaves the instance empty: the wizard opens
        // again, on the data screen, to send the data anew
        const isDataRetry = generation.phase === 'data';
        const isRelaunched = await run(relaunch);
        if (isRelaunched && isDataRetry) {
            history.push('/data/existing', { reopenSiteWizard: true });
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
            PaperProps={WIZARD_DIALOG_PAPER_PROPS}
        >
            <DialogContent sx={{ px: 0 }}>
                <SiteGenerationHeader steps={steps} />
                <SiteGenerationSteps
                    steps={steps}
                    view={generation}
                    onRetry={handleRetry}
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
