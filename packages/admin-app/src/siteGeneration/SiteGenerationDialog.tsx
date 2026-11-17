import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SyncIcon from '@mui/icons-material/Sync';
import { toast, type SiteGenerationStepState } from '@lodex/common';
import { ConfirmPopup } from '@lodex/frontend-common/components/ConfirmPopup';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { loadEnrichments } from '../enrichment';
import { loadParsingResult } from '../parsing';
import { loadPrecomputed } from '../precomputed';
import { loadPublication } from '../publication';
import { useSiteGeneration } from './useSiteGeneration';

const SUPPORT_EMAIL = 'support-lodex@listes.istex.fr';
// the statuses shown in the dialog
const ACTIVE_STATUSES = ['running', 'publishing', 'error'];

const StateIcon = ({ state }: { state: SiteGenerationStepState }) => {
    switch (state) {
        case 'done':
            return <CheckCircleIcon color="success" />;
        case 'running':
            return <SyncIcon color="primary" />;
        case 'error':
            return <ErrorIcon color="error" />;
        default:
            return <HourglassEmptyIcon color="disabled" />;
    }
};

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
    const { generation, relaunch, stop, isActing, isStopping } =
        useSiteGeneration();
    const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);
    const previousStatus = useRef(generation?.status);

    const status = generation?.status;
    const isOpen = !!status && ACTIVE_STATUSES.includes(status);
    useEffect(() => {
        if (!isOpen) {
            setIsStopConfirmOpen(false);
        }
    }, [isOpen]);
    useEffect(() => {
        const previous = previousStatus.current;
        // a stopped generation keeps the columns of its finished steps
        const isEnded =
            status === 'done'
                ? previous === 'running' || previous === 'publishing'
                : status === 'stopped';
        if (isEnded && previous && ACTIVE_STATUSES.includes(previous)) {
            dispatch(loadEnrichments());
            dispatch(loadPrecomputed());
            dispatch(loadParsingResult());
            // the site may have been published at the end
            dispatch(loadPublication());
        }
        previousStatus.current = status;
    }, [status, dispatch]);

    if (!generation || !isOpen) {
        return null;
    }

    const total = generation.steps.length;
    const done = generation.steps.filter(
        (step) => step.state === 'done',
    ).length;
    const hasStepError = generation.steps.some(
        (step) => step.state === 'error',
    );
    const stopDescription =
        status === 'publishing'
            ? 'site_generation_stop_publication_description'
            : generation.publication?.state === 'error' && !hasStepError
              ? 'site_generation_stop_failed_publication_description'
              : 'site_generation_stop_description';
    const steps = [...generation.steps].sort((a, b) => a.position - b.position);

    const run = async (action: () => Promise<void>) => {
        try {
            await action();
        } catch (error) {
            toast(
                translate('site_generation_action_error', {
                    // the API answers with a translation key (e.g. a 409)
                    error: translate(
                        error instanceof Error ? error.message : String(error),
                    ),
                }),
                { type: 'error' },
            );
        }
    };

    const handleStop = async () => {
        await run(stop);
        setIsStopConfirmOpen(false);
    };

    return (
        <Dialog open fullWidth maxWidth="sm" disableEscapeKeyDown>
            <DialogTitle>{translate('site_generation_title')}</DialogTitle>
            <DialogContent>
                <Typography>
                    {translate('site_generation_progress', { done, total })}
                </Typography>
                <List dense>
                    {steps.map((step) => (
                        <ListItem key={`${step.type}-${step.name}`}>
                            <ListItemIcon>
                                <StateIcon state={step.state} />
                            </ListItemIcon>
                            <ListItemText
                                primary={step.name}
                                secondary={
                                    <>
                                        {translate(
                                            `site_generation_type_${step.type}`,
                                        )}
                                        {step.state === 'running' &&
                                            ` (${translate('site_generation_running')})`}
                                        {step.state === 'error' &&
                                            step.message && (
                                                <Box component="span">
                                                    {' — '}
                                                    {translate(step.message)}
                                                </Box>
                                            )}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                    {generation.publication && (
                        <ListItem>
                            <ListItemIcon>
                                <StateIcon
                                    state={generation.publication.state}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={translate(
                                    'site_generation_publication',
                                )}
                                secondary={
                                    <>
                                        {generation.publication.state ===
                                            'running' &&
                                            translate(
                                                'site_generation_running',
                                            )}
                                        {generation.publication.state ===
                                            'error' &&
                                            generation.publication.message &&
                                            translate(
                                                generation.publication.message,
                                            )}
                                    </>
                                }
                            />
                        </ListItem>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                {status === 'error' && (
                    <Button
                        variant="contained"
                        onClick={() => run(relaunch)}
                        disabled={isActing}
                    >
                        {translate('site_generation_relaunch')}
                    </Button>
                )}
                <Button
                    color="warning"
                    onClick={() => setIsStopConfirmOpen(true)}
                    disabled={isActing}
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
