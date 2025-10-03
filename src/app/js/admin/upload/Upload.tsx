import { useState, type ChangeEvent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { DropzoneAreaBase, type FileObject } from 'mui-file-dropzone';
import Alert from '../../lib/components/Alert';
import {
    Box,
    Button,
    TextField,
    Grid,
    CircularProgress,
    Typography,
    Tabs,
    Tab,
} from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';
import EditNoteIcon from '@mui/icons-material/EditNote';

import {
    uploadFile,
    changeUploadUrl,
    changeLoaderName,
    uploadUrl,
    uploadText,
    changeUploadText,
} from './';
import { fromUpload, fromLoaders } from '../selectors';
import LoaderSelect from './LoaderSelect';
import { toast } from '../../../../common/tools/toast';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import { useTranslate } from '../../i18n/I18NContext';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
        alignSelf: 'center',
        alignItems: 'flex-start',
    },
    input: {
        '@media (min-width: 992px)': {
            marginBottom: '16px',
        },
    },
    textInput: {
        width: '100%',
        height: '50vh',
    },
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '24px',
    },
    tabs: {
        marginBottom: '12px',
        borderBottom: 'solid 1px #00000018',
    },
    formDesc: {
        textAlign: 'center',
        marginBottom: '24px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'center',
        margin: '0 10%',
    },
    loader: {
        minHeight: '220px',
        backgroundColor: 'var(--contrast-main)',
        color: 'var(--primary-secondary)',
    },
    divider: {
        textTransform: 'uppercase',
        position: 'relative',
        textAlign: 'center',
        width: '100%',
        marginTop: '32px',
        '&:before': {
            width: '100%',
            height: '2px',
            content: '""',
            backgroundColor: 'var(--primary-secondary)',
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
        },
        '@media (min-width: 992px)': {
            width: 'auto',
            marginTop: 0,
            alignSelf: 'stretch',
            display: 'flex',
            alignItems: 'center',
            '&:before': {
                width: '2px',
                height: '100%',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
            },
        },
    },
    dividerLabel: {
        padding: '1rem',
        backgroundColor: 'var(--contrast-main)',
        position: 'relative',
        display: 'inline-block',
        '@media (min-width: 992px)': {
            display: 'block',
            margin: '0 40px',
        },
    },
    dropzone: {
        minHeight: '220px',
        padding: '0 1rem',
    },
    disabledDropzone: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    dropzonePreview: {
        justifyContent: 'center',
        '& .MuiGrid-item, & .MuiChip-root': {
            maxWidth: '100%',
        },
    },
};

type DroppingLoaderProps = {
    text: string;
};

const DroppingLoader = ({ text }: DroppingLoaderProps) => {
    return (
        <Grid
            sx={styles.loader}
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress />
            <span>{text}</span>
        </Grid>
    );
};

type UploadComponentProps = {
    history: any;
    error: string | boolean;
    url: string;
    textContent: string;
    loaderName: string;
    isUrlValid: boolean;
    isUploading: boolean;
    onChangeUrl: (e: any) => void;
    onChangeTextContent: (e: string) => void;
    onChangeLoaderName: (val: string) => void;
    onFileLoad: (file: File) => void;
    onUrlUpload: (...params: any) => void;
    onTextUpload: (...params: any) => void;
    loaders: Array<any>;
    isFirstFile: boolean;
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
}: UploadComponentProps) => {
    const { translate } = useTranslate();
    const [tab, setTab] = useState<number>(0);
    const [files, setFiles] = useState<FileObject[]>([]);
    const [dropping, setDropping] = useState(false);
    const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
    const path = history.location.pathname;
    const successRedirectPath = '/data/existing';

    const handleImportType = (_: unknown, newTab: number) => {
        setTab(newTab);
    };

    const handleAdding = () => {
        setDropping(true);
    };

    const handleAddRejected = () => {
        setDropping(false);
    };

    const handleFileAdded = (list: FileObject[]) => {
        setDropping(false);
        if (!list || list.length === 0) return;

        setFiles([...list]);
        toast(translate('add_file_success', { name: list[0].file.name }), {
            type: toast.TYPE.SUCCESS,
        });
    };

    const handleConfirm = (...params: any[]) => {
        // 0 = File, 1 = URL and 2 = TEXT
        switch (tab) {
            case 0: {
                if (files.length === 0) return;
                onFileLoad(files[0].file);
                break;
            }
            case 1: {
                if (files.length !== 0 || !url || !isUrlValid) return;
                onUrlUpload(...params);
                break;
            }
            case 2: {
                if (!textContent || textContent === '') return;
                onTextUpload(...params);
                break;
            }
        }

        if (path.toString() !== successRedirectPath) {
            history.push(successRedirectPath);
        }
    };

    // @ts-expect-error TS7019
    const handleSubmit = (...params) => {
        if (!isFirstFile) {
            setIsOpenPopupConfirm(true);
            return;
        }
        handleConfirm(...params);
    };

    return (
        <Box sx={styles.container}>
            {/* Tabs selector use to select the import type */}
            <Box sx={styles.tabs}>
                <Tabs
                    value={tab}
                    onChange={handleImportType}
                    variant="fullWidth"
                >
                    <Tab
                        icon={<UploadFileIcon />}
                        iconPosition="start"
                        label={translate('upload_by_file')}
                    />
                    <Tab
                        icon={<LinkIcon />}
                        iconPosition="start"
                        label={translate('upload_by_url')}
                    />
                    <Tab
                        icon={<EditNoteIcon />}
                        iconPosition="start"
                        label={translate('upload_by_text')}
                    />
                </Tabs>
            </Box>

            {/* Show error */}
            {error ? (
                <Alert>
                    <p>Error uploading given file: </p>
                    <p>{error}</p>
                </Alert>
            ) : (
                <span />
            )}

            {/* Display tabs content */}
            <Box
                sx={{
                    ...styles.form,
                    '& .dropzone': styles.dropzone,
                    '& .disabledDropzone': styles.disabledDropzone,
                    '& .dropzonePreview': styles.dropzonePreview,
                }}
            >
                {/* Display the content of the first tab */}
                {tab === 0 ? (
                    <>
                        {/*
                         // @ts-expect-error TS2322 */}
                        <p style={styles.formDesc}>
                            {translate('upload_file')}
                        </p>
                        {dropping ? (
                            <DroppingLoader text={translate('inspect_file')} />
                        ) : (
                            <DropzoneAreaBase
                                fileObjects={files}
                                filesLimit={1}
                                maxFileSize={1 * 1024 * 1024 * 1024}
                                // @ts-expect-error TS2322
                                dropzoneText={
                                    <Typography variant="h6">
                                        {translate('import_file_text')}
                                    </Typography>
                                }
                                dropzoneProps={{
                                    disabled: !!url,
                                }}
                                dropzoneClass={`dropzone ${
                                    !!url && 'disabledDropzone'
                                }`}
                                showAlerts={['error']}
                                showPreviewsInDropzone
                                showFileNamesInPreview
                                previewGridClasses={{
                                    container: 'dropzonePreview',
                                }}
                                useChipsForPreview
                                alertSnackbarProps={{
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    },
                                }}
                                onAdd={(fileObjs) => handleFileAdded(fileObjs)}
                                onDrop={handleAdding}
                                onDropRejected={handleAddRejected}
                                onDelete={() => setFiles([])}
                            />
                        )}
                    </>
                ) : null}

                {/* Display the content of the second tab */}
                {tab === 1 ? (
                    <>
                        {/*
                         // @ts-expect-error TS2322 */}
                        <p style={styles.formDesc}>
                            {translate('upload_via_url')}
                        </p>
                        <TextField
                            fullWidth
                            sx={styles.input}
                            value={url}
                            onChange={onChangeUrl}
                            placeholder="URL"
                            error={!!url && !isUrlValid}
                            helperText={
                                url && !isUrlValid && translate('invalid_url')
                            }
                            disabled={!!files.length}
                            label={translate('use_url')}
                            variant="standard"
                        />
                    </>
                ) : null}

                {/* Display the content of the third tab */}
                {tab === 2 ? (
                    <>
                        {/*
                         // @ts-expect-error TS2322 */}
                        <p style={styles.formDesc}>
                            {translate('upload_via_text')}
                        </p>
                        <FormSourceCodeField
                            style={styles.textInput}
                            enableModeSelector
                            mode="json"
                            input={{
                                value: textContent,
                                onChange: onChangeTextContent,
                            }}
                        />
                    </>
                ) : null}
            </Box>

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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
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
