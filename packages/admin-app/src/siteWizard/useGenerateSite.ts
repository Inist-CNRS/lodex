import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    type CatalogModel,
    type SiteDataAddChoice,
    type SiteInfo,
} from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    uploadDataset,
    type DatasetSource,
    type DatasetChoiceOptions,
} from '../upload/uploadDataset';
import { allowUnload, preventUnload } from '../upload/sagas/unload';
import { SITE_GENERATION_QUERY_KEY } from '../siteGeneration/useSiteGeneration';
import { getErrorDetail } from '../commons/getErrorDetail';
import { stopSiteGeneration } from '../api/siteGeneration';

// a file upload cancelled after its last chunk queued the import
const UPLOAD_IMPORT_STARTED = 'upload_import_started';

// The import queued by the last chunk started the generation: the cancel is
// honoured by stopping it. True when it is stopped, or already over (409).
const stopStartedGeneration = async () => {
    try {
        await stopSiteGeneration();
        return true;
    } catch (e) {
        return (e as { code?: number })?.code === 409;
    }
};

/**
 * Sends the dataset with the wizard's choice: the server then runs the whole
 * generation, which the global progress dialog follows.
 */
export const useGenerateSite = () => {
    const { translate } = useTranslate();
    const queryClient = useQueryClient();
    const [isGenerating, setIsGenerating] = useState(false);
    // between a click on cancel and the end of the upload
    const [isCancelling, setIsCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isMountedRef = useRef(true);
    const isUnloadPreventedRef = useRef(false);
    const isCancellingRef = useRef(false);
    // percentage of the file being uploaded, null when no file is uploading
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const uploadAbortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            // a file still uploading goes on, as the import after it
            if (isUnloadPreventedRef.current) {
                allowUnload();
            }
        };
    }, []);

    // the send path shared by the wizard's generation and a data add
    const send = useCallback(
        async (
            model: CatalogModel,
            source: DatasetSource,
            uploadOptions: DatasetChoiceOptions,
        ) => {
            setError(null);
            isCancellingRef.current = false;
            setIsCancelling(false);
            setIsGenerating(true);
            try {
                try {
                    if (source.type === 'file') {
                        // the only source long to upload: show its progress,
                        // let it be cancelled and keep the page open
                        const uploadAbort = new AbortController();
                        uploadAbortRef.current = uploadAbort;
                        isUnloadPreventedRef.current = true;
                        preventUnload();
                        setUploadProgress(0);
                        await uploadDataset(source, model.loader, {
                            ...uploadOptions,
                            signal: uploadAbort.signal,
                            onProgress: (progress) => {
                                if (isMountedRef.current) {
                                    setUploadProgress(
                                        Math.round(progress * 100),
                                    );
                                }
                            },
                        });
                    } else {
                        await uploadDataset(
                            source,
                            model.loader,
                            uploadOptions,
                        );
                    }
                } catch (uploadError) {
                    if (getErrorDetail(uploadError) !== UPLOAD_IMPORT_STARTED) {
                        throw uploadError;
                    }
                    // the cancel came after the last chunk queued the import,
                    // which started the generation: it is stopped, and the
                    // cancel ends as any other. A generation that cannot be
                    // stopped goes on: its progress dialog can stop it.
                    if (await stopStartedGeneration()) {
                        // a progress already fetched must not stay on screen
                        await queryClient.invalidateQueries({
                            queryKey: SITE_GENERATION_QUERY_KEY,
                        });
                        throw uploadError;
                    }
                }
                // the server started the generation: wait for its progress
                // dialog before closing the wizard, so that nothing is left
                // on screen in between (a failed fetch does not throw)
                await queryClient.invalidateQueries({
                    queryKey: SITE_GENERATION_QUERY_KEY,
                });
            } catch (e) {
                // a cancel asked by the user is not a failure
                if (isMountedRef.current && !isCancellingRef.current) {
                    setError(
                        translate('site_wizard_generation_error', {
                            error: translate(getErrorDetail(e)),
                        }),
                    );
                }
                throw e;
            } finally {
                uploadAbortRef.current = null;
                if (isUnloadPreventedRef.current) {
                    isUnloadPreventedRef.current = false;
                    allowUnload();
                }
                if (isMountedRef.current) {
                    setIsGenerating(false);
                    setIsCancelling(false);
                    setUploadProgress(null);
                }
            }
        },
        [translate, queryClient],
    );

    const generate = useCallback(
        (model: CatalogModel, source: DatasetSource, siteInfo: SiteInfo = {}) =>
            send(model, source, {
                choice: { modelId: model.id, ...siteInfo },
            }),
        [send],
    );

    const addData = useCallback(
        (
            model: CatalogModel,
            source: DatasetSource,
            choice: SiteDataAddChoice,
        ) => send(model, source, { dataAdd: choice }),
        [send],
    );

    const clearError = useCallback(() => setError(null), []);

    // only a file still uploading can be cancelled: loadFile tells the server
    // to drop it
    const cancelImport = useCallback(async () => {
        if (!uploadAbortRef.current) {
            return;
        }
        isCancellingRef.current = true;
        setIsCancelling(true);
        uploadAbortRef.current.abort();
    }, []);

    return {
        generate,
        addData,
        isGenerating,
        uploadProgress,
        // during the file upload only
        canCancel: uploadProgress !== null,
        isCancelling,
        cancelImport,
        error,
        clearError,
    };
};
