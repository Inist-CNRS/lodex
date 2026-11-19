import { Fragment, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Box, Button, Link, Typography } from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import type { FileObject } from 'mui-file-dropzone';
import {
    getModelImportHelpKey,
    getModelNameKey,
    type CatalogModel,
} from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { fromPublication } from '../selectors';
import { UploadProgressDialog } from '../siteGeneration/UploadProgressDialog';
import { GenerationError } from '../siteWizard/GenerationError';
import { hasTranslation } from '../siteWizard/hasTranslation';
import { getDataAddUploadView } from '../siteWizard/uploadSteps';
import { useGenerateSite } from '../siteWizard/useGenerateSite';
import {
    DatasetSourceInput,
    getDatasetSource,
    type DatasetSourceTab,
} from './DatasetSourceInput';
import { SimplifiedUploadConfirm } from './SimplifiedUploadConfirm';
import { useSiteModelLaunch } from './useSiteModelLaunch';

const SUCCESS_PATH = '/data/existing';

type SimplifiedUploadProps = {
    model: CatalogModel;
    hasData: boolean;
    onOpenWizard?: () => void;
};

// the translations mark the model name in bold with **
const renderBold = (text: string) =>
    text
        .split('**')
        .map((part, index) => (
            <Fragment key={index}>
                {index % 2 === 1 ? <strong>{part}</strong> : part}
            </Fragment>
        ));

export const SimplifiedUpload = ({
    model,
    hasData,
    onOpenWizard,
}: SimplifiedUploadProps) => {
    const { translate } = useTranslate();
    const {
        addData,
        isGenerating,
        uploadProgress,
        canCancel,
        isCancelling,
        cancelImport,
        error,
        clearError,
    } = useGenerateSite();
    const hasPublishedDataset = useSelector(
        fromPublication.hasPublishedDataset,
    );
    const history = useHistory();
    const { pathname } = useLocation();
    const [tab, setTab] = useState<DatasetSourceTab>(model.importTypes[0]);
    const [files, setFiles] = useState<FileObject[]>([]);
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    // read only once the confirmation is open
    const {
        launch,
        isLoading: isLoadingLaunch,
        isError: isLaunchError,
    } = useSiteModelLaunch(isConfirmOpen);
    // when the counts cannot be read, the relaunch stays offered
    const canRelaunch = isLaunchError
        ? true
        : !!launch && launch.enrichment + launch.precomputed > 0;
    const [relaunch, setRelaunch] = useState(true);
    const [autoPublish, setAutoPublish] = useState(false);
    const isSubmittingRef = useRef(false);

    const source = getDatasetSource({ tab, files, url, text });
    const choice = { relaunch: canRelaunch && relaunch, autoPublish };
    const uploadView = getDataAddUploadView(launch, choice);
    const importHelpKey = getModelImportHelpKey(model.id);

    const handleConfirm = async () => {
        setIsConfirmOpen(false);
        if (isSubmittingRef.current || !source) {
            return;
        }
        isSubmittingRef.current = true;
        try {
            await addData(model, source, choice);
            // queued: leave the form, which would add the same data again
            if (pathname !== SUCCESS_PATH) {
                history.push(SUCCESS_PATH);
            }
        } catch {
            // the error is displayed from useGenerateSite
        } finally {
            isSubmittingRef.current = false;
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '24px',
            }}
        >
            {onOpenWizard && (
                <Button
                    variant="text"
                    color="primary"
                    className="btn-open-site-wizard"
                    sx={{
                        alignSelf: 'flex-start',
                        textDecoration: 'underline',
                        marginLeft: 4,
                        marginBottom: 2,
                    }}
                    startIcon={<AutoFixHighIcon />}
                    onClick={onOpenWizard}
                >
                    {translate('site_wizard_open')}
                </Button>
            )}
            <Box mx="10%" mb={2}>
                <Typography color="text.secondary">
                    {renderBold(
                        translate(
                            model.doc
                                ? 'simplified_upload_model'
                                : 'simplified_upload_model_no_doc',
                            {
                                name: translate(getModelNameKey(model.id)),
                            },
                        ),
                    )}{' '}
                    {model.doc && (
                        <Link
                            href={model.doc}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {translate('simplified_upload_doc')}
                        </Link>
                    )}
                </Typography>
                {hasTranslation(importHelpKey) && (
                    <Typography
                        color="text.secondary"
                        sx={{ mt: 2, whiteSpace: 'pre-line' }}
                    >
                        {translate(importHelpKey)}
                    </Typography>
                )}
            </Box>
            <DatasetSourceInput
                tab={tab}
                onTabChange={(value) => {
                    clearError();
                    setTab(value);
                }}
                files={files}
                onFilesChange={setFiles}
                url={url}
                onUrlChange={setUrl}
                text={text}
                onTextChange={setText}
                tabs={model.importTypes}
                fileTextKey="import_dataset_file_text"
                hideDescriptions
            >
                {error && <GenerationError error={error} />}
            </DatasetSourceInput>
            <Button
                variant="contained"
                color="primary"
                className="btn-upload-dataset"
                sx={{ alignSelf: 'center', marginTop: 2 }}
                disabled={isGenerating || !source}
                onClick={() => {
                    // the default follows the publication state at that time
                    setAutoPublish(!!hasPublishedDataset);
                    setIsConfirmOpen(true);
                }}
                startIcon={<PublishIcon />}
            >
                {translate('upload_data')}
            </Button>
            <SimplifiedUploadConfirm
                isOpen={isConfirmOpen}
                hasData={hasData}
                isLoadingLaunch={isLoadingLaunch}
                canRelaunch={canRelaunch}
                relaunch={relaunch}
                onRelaunchChange={setRelaunch}
                autoPublish={autoPublish}
                onAutoPublishChange={setAutoPublish}
                onCancel={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirm}
            />
            {/* the progress of the file being sent; once queued, the global
                dialog follows the generation */}
            <UploadProgressDialog
                open={isGenerating && uploadProgress !== null}
                view={uploadView}
                uploadProgress={uploadProgress}
                canCancel={canCancel}
                isCancelling={isCancelling}
                onStop={cancelImport}
            />
        </Box>
    );
};
