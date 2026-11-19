import { useState, type ChangeEvent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { type FileObject } from 'mui-file-dropzone';
import Alert from '@lodex/frontend-common/components/Alert';
import {
    alpha,
    Box,
    Button,
    ButtonBase,
    Divider,
    type Theme,
    Typography,
} from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
    // fills the page height, the input taking what is left; a short window
    // scrolls the page instead
    container: {
        width: '100%',
        minHeight: '100%',
        paddingX: 5,
        paddingY: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
    },
    actions: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
    },
    // the main action: large, and tinted even while disabled so it is seen
    // before a source is chosen
    uploadButton: {
        marginLeft: 'auto',
        paddingX: 4,
        '&.Mui-disabled': {
            color: 'common.white',
            bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.4),
        },
    },
    wizardCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        textAlign: 'left',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        '&:hover': { borderColor: 'primary.main' },
    },
    wizardIcon: {
        display: 'grid',
        placeItems: 'center',
        flex: 'none',
        width: 40,
        height: 40,
        borderRadius: 2,
        color: 'primary.main',
        bgcolor: 'action.hover',
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
            <Box>
                <Typography variant="h5" component="h1">
                    {translate('upload_title')}
                </Typography>
                <Typography color="text.secondary">
                    {translate('upload_subtitle')}
                </Typography>
            </Box>
            <DatasetSourceInput
                narrow
                hideDescriptions
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
                        {/* a failed import sends a translation key */}
                        <p>{translate(String(error))}</p>
                    </Alert>
                ) : null}
            </DatasetSourceInput>

            <Box sx={styles.actions}>
                <LoaderSelect
                    loaders={loaders}
                    setLoader={onChangeLoaderName}
                    value={loaderName}
                />
                <Button
                    variant="contained"
                    color="primary"
                    className="btn-upload-dataset"
                    size="large"
                    sx={styles.uploadButton}
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
            </Box>

            {onOpenWizard && (
                <>
                    <Divider>
                        <Typography variant="body2" color="text.secondary">
                            {translate('or')}
                        </Typography>
                    </Divider>
                    <ButtonBase
                        className="btn-open-site-wizard"
                        sx={styles.wizardCard}
                        onClick={onOpenWizard}
                    >
                        <Box sx={styles.wizardIcon}>
                            <AutoFixHighIcon />
                        </Box>
                        <Box flex={1}>
                            <Typography fontWeight={500}>
                                {translate('site_wizard_open')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {translate('site_wizard_open_desc')}
                            </Typography>
                        </Box>
                        <ChevronRightIcon color="primary" />
                    </ButtonBase>
                </>
            )}

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
