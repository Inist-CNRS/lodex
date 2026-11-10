import { useState, type ChangeEvent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { type FileObject } from 'mui-file-dropzone';
import Alert from '@lodex/frontend-common/components/Alert';
import { Box, Button } from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
    uploadFile,
    changeUploadUrl,
    changeLoaderName,
    uploadUrl,
    uploadText,
    changeUploadText,
} from './index';
import { fromUpload, fromLoaders } from '../selectors';
import LoaderSelect from './LoaderSelect';
import { ConfirmPopup } from '@lodex/frontend-common/components/ConfirmPopup';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { State } from '../reducers';
import type { Loader } from './ListDialog';
import {
    DatasetSourceInput,
    type DatasetSourceTab,
} from './DatasetSourceInput';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
        alignSelf: 'center',
        alignItems: 'flex-start',
    },
    wizardButton: {
        alignSelf: 'flex-start',
        textDecoration: 'underline',
        marginLeft: 4,
        marginBottom: 2,
    },
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '24px',
    },
};

export type UploadComponentProps = {
    history: {
        location: { pathname: string };
        push: (path: string) => void;
    };
    error: string | boolean;
    url: string;
    textContent: string;
    loaderName: string;
    isUrlValid: boolean;
    isUploading: boolean;
    onChangeUrl: React.ChangeEventHandler<HTMLInputElement>;
    onChangeTextContent: (e: string) => void;
    onChangeLoaderName: (val: string) => void;
    onFileLoad: (file: File) => void;
    onUrlUpload: (...params: unknown[]) => void;
    onTextUpload: (...params: unknown[]) => void;
    loaders: Loader[];
    isFirstFile: boolean;
    onOpenWizard?: () => void;
};

export const UploadComponent = ({
    history,
    error,
    url,
    textContent,
    loaderName,
    isUrlValid,
    isUploading,
    onChangeUrl,
    onChangeTextContent,
    onChangeLoaderName,
    onFileLoad,
    onUrlUpload,
    onTextUpload,
    loaders,
    isFirstFile,
    onOpenWizard,
}: UploadComponentProps) => {
    const { translate } = useTranslate();
    const [tab, setTab] = useState<DatasetSourceTab>('file');
    const [files, setFiles] = useState<FileObject[]>([]);
    const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
    const path = history.location.pathname;
    const successRedirectPath = '/data/existing';

    const handleConfirm = (...params: any[]) => {
        switch (tab) {
            case 'file': {
                if (files.length === 0) return;
                onFileLoad(files[0].file);
                break;
            }
            case 'url': {
                if (files.length !== 0 || !url || !isUrlValid) return;
                onUrlUpload(...params);
                break;
            }
            case 'text': {
                if (!textContent || textContent === '') return;
                onTextUpload(...params);
                break;
            }
        }

        if (path.toString() !== successRedirectPath) {
            history.push(successRedirectPath);
        }
    };

    const handleSubmit = (...params: any[]) => {
        if (!isFirstFile) {
            setIsOpenPopupConfirm(true);
            return;
        }
        handleConfirm(...params);
    };
    return (
        <Box sx={styles.container}>
            {onOpenWizard && (
                <Button
                    variant="text"
                    color="primary"
                    className="btn-open-site-wizard"
                    sx={styles.wizardButton}
                    startIcon={<ArrowBackIcon />}
                    onClick={onOpenWizard}
                >
                    {translate('site_wizard_open')}
                </Button>
            )}
            <DatasetSourceInput
                tab={tab}
                onTabChange={setTab}
                files={files}
                onFilesChange={setFiles}
                url={url}
                onUrlChange={(value) =>
                    onChangeUrl({
                        target: { value },
                    } as ChangeEvent<HTMLInputElement>)
                }
                text={textContent}
                onTextChange={onChangeTextContent}
            >
                {/* Show error */}
                {error ? (
                    <Alert>
                        <p>Error uploading given file: </p>
                        <p>{error}</p>
                    </Alert>
                ) : (
                    <span />
                )}
            </DatasetSourceInput>

            <LoaderSelect
                loaders={loaders}
                setLoader={onChangeLoaderName}
                value={loaderName}
                disabled={
                    files.length === 0 &&
                    (!url || !isUrlValid) &&
                    (!textContent || textContent === '')
                }
            />
            <Button
                variant="contained"
                color="primary"
                className="btn-upload-dataset"
                sx={styles.button}
                disabled={
                    isUploading ||
                    (files.length === 0 &&
                        (!url || !isUrlValid) &&
                        (!textContent || textContent === '')) ||
                    !loaderName
                }
                onClick={handleSubmit}
                startIcon={<PublishIcon />}
            >
                {translate('upload_data')}
            </Button>

            <ConfirmPopup
                cancelLabel={translate('Cancel')}
                confirmLabel={translate('Accept')}
                title={translate('info_upload')}
                description={translate('info_publish_desc')}
                isOpen={isOpenPopupConfirm}
                onCancel={() => setIsOpenPopupConfirm(false)}
                onConfirm={() => {
                    handleConfirm();
                    setIsOpenPopupConfirm(false);
                }}
            />
        </Box>
    );
};

const mapStateToProps = (state: State) => ({
    url: fromUpload.getUrl(state),
    textContent: fromUpload.getTextContent(state),
    isUrlValid: fromUpload.isUrlValid(state),
    isUploading: fromUpload.isUploadPending(state),
    loaderName: fromUpload.getLoaderName(state),
    loaders: fromLoaders.getLoaders(state),
});

const mapDispatchToProps = {
    onUrlUpload: uploadUrl,
    onFileLoad: uploadFile,
    onTextUpload: uploadText,
    onChangeUrl: (e: ChangeEvent<HTMLInputElement>) =>
        changeUploadUrl(e.target.value),
    onChangeTextContent: (value: string) => changeUploadText(value),
    onChangeLoaderName: (val: string | string[]) =>
        changeLoaderName(Array.isArray(val) ? val[0] : val),
};

export default compose<
    UploadComponentProps,
    Omit<
        UploadComponentProps,
        | 'url'
        | 'textContent'
        | 'isUrlValid'
        | 'isUploading'
        | 'loaderName'
        | 'loaders'
        | 'onUrlUpload'
        | 'onFileLoad'
        | 'onTextUpload'
        | 'onChangeUrl'
        | 'onChangeTextContent'
        | 'onChangeLoaderName'
    >
>(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(UploadComponent);
