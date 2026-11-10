import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { toast, type CatalogModel } from '@lodex/common';
import { loadField } from '@lodex/frontend-common/fields/reducer';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { importCatalogModel } from '../api/field';
import jobsApi from '../api/job';
import { loadEnrichments } from '../enrichment';
import { loadPrecomputed } from '../precomputed';
import { loadPublication } from '../publication';
import { loadSubresources } from '../subresource';
import { uploadDataset, type DatasetSource } from '../upload/uploadDataset';
import { allowUnload, preventUnload } from '../upload/sagas/unload';
import { useImportJobEnd } from './useImportJobEnd';

const getErrorDetail = (error: unknown): string =>
    error instanceof Error
        ? error.message
        : typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : String(error);

const IMPORT_JOB_TYPE = 'import';
// the error of an import cancelled by the user, as sent by the server
const CANCELLED_IMPORT = 'cancelled_import';
const CANCEL_FALLBACK_DELAY = 15_000;

export const useGenerateSite = () => {
    const { translate } = useTranslate();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const {
        waitForImportEnd,
        stopWaitingForImportEnd,
        giveUpWaitingForImportEnd,
    } = useImportJobEnd();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isWaitingForImport, setIsWaitingForImport] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isMountedRef = useRef(true);
    const isGeneratingRef = useRef(false);
    // a cancelled import may end as a plain failure, without cancelled_import
    const isCancellingRef = useRef(false);
    // percentage of the file being uploaded, null when no file is uploading
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const uploadAbortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            // a file still uploading goes on, as the import after it
            // a pending wait never settles once unmounted: release the page
            if (isGeneratingRef.current) {
                allowUnload();
            }
        };
    }, []);

    // the model replaces fields, subresources, enrichments and precomputed
    // data, and the import changes the publication
    const reloadAdminData = useCallback(() => {
        dispatch(loadField());
        dispatch(loadPublication());
        dispatch(loadSubresources());
        dispatch(loadEnrichments());
        dispatch(loadPrecomputed());
        queryClient.invalidateQueries({ queryKey: ['fetchPrecomputations'] });
    }, [dispatch, queryClient]);

    const generate = useCallback(
        async (model: CatalogModel, source: DatasetSource) => {
            setError(null);
            isCancellingRef.current = false;
            setIsGenerating(true);
            isGeneratingRef.current = true;
            preventUnload();
            try {
                const { themeNotFound } = await importCatalogModel(model.id);
                if (themeNotFound) {
                    toast(
                        translate('site_wizard_theme_not_found', {
                            theme: themeNotFound,
                        }),
                        { type: 'warning' },
                    );
                }
                queryClient.resetQueries({ queryKey: ['get-config-tenant'] });
                // listen before uploading: a small import can end before the
                // upload request resolves, and the server only notifies
                // connected sockets
                const { connected, ended } = waitForImportEnd();
                // if the upload fails, nobody awaits ended (see finally)
                ended.catch(() => {});
                await connected;
                if (source.type === 'file') {
                    // the only source long to upload: show its progress and
                    // let it be cancelled
                    const uploadAbort = new AbortController();
                    uploadAbortRef.current = uploadAbort;
                    setUploadProgress(0);
                    await uploadDataset(source, model.loader, {
                        signal: uploadAbort.signal,
                        onProgress: (progress) => {
                            if (isMountedRef.current) {
                                setUploadProgress(Math.round(progress * 100));
                            }
                        },
                    });
                    // from now on, cancelling cancels the import job
                    uploadAbortRef.current = null;
                    if (isMountedRef.current) {
                        setUploadProgress(null);
                    }
                } else {
                    await uploadDataset(source, model.loader);
                }
                // the import job is queued: it can now be cancelled
                if (isMountedRef.current) {
                    setIsWaitingForImport(true);
                }
                await ended;
            } catch (e) {
                const detail = getErrorDetail(e);
                // a cancel asked by the user is not a failure: JobProgress
                // already confirms it
                const isCancel =
                    detail === CANCELLED_IMPORT || isCancellingRef.current;
                if (isMountedRef.current && !isCancel) {
                    setError(
                        translate('site_wizard_generation_error', {
                            error: translate(detail),
                        }),
                    );
                }
                throw e;
            } finally {
                uploadAbortRef.current = null;
                stopWaitingForImportEnd();
                // even on a failure: the server may have replaced the model,
                // or deleted it before failing
                reloadAdminData();
                isGeneratingRef.current = false;
                allowUnload();
                if (isMountedRef.current) {
                    setIsGenerating(false);
                    setIsWaitingForImport(false);
                    setUploadProgress(null);
                }
            }
        },
        [
            translate,
            queryClient,
            waitForImportEnd,
            stopWaitingForImportEnd,
            reloadAdminData,
        ],
    );

    const clearError = useCallback(() => setError(null), []);

    const cancelImport = useCallback(async () => {
        isCancellingRef.current = true;
        // a file still uploading: stop it, loadFile tells the server to drop
        // it, so that its import never starts
        const uploadAbort = uploadAbortRef.current;
        uploadAbort?.abort();
        try {
            // also stops an import queued by a last chunk racing the cancel
            await jobsApi.cancelJob(IMPORT_JOB_TYPE, undefined);
        } catch {
            // the fallback below still frees the wizard
        }
        if (uploadAbort) {
            // the generation already ended with the stopped upload
            return;
        }
        // the server answers before stopping the job, then drops its data and
        // sends cancelled_import: wait for it, but give up if it never comes
        // (job already over, event missed)
        giveUpWaitingForImportEnd(
            CANCEL_FALLBACK_DELAY,
            new Error(CANCELLED_IMPORT),
        );
    }, [giveUpWaitingForImportEnd]);

    return {
        generate,
        isGenerating,
        isWaitingForImport,
        uploadProgress,
        // during the file upload, then while the import job runs
        canCancel: isWaitingForImport || uploadProgress !== null,
        cancelImport,
        error,
        clearError,
    };
};
