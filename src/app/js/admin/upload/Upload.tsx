import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { DropzoneAreaBase } from 'mui-file-dropzone';
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

import { polyglot as polyglotPropTypes } from '../../propTypes';
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
import { translate } from '../../i18n/I18NContext';

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

export const UploadComponent = ({
    // @ts-expect-error TS7031
    history,
    // @ts-expect-error TS7031
    error,
    // @ts-expect-error TS7031
    url,
    // @ts-expect-error TS7031
    textContent,
    // @ts-expect-error TS7031
    loaderName,
    // @ts-expect-error TS7031
    isUrlValid,
    // @ts-expect-error TS7031
    isUploading,
    // @ts-expect-error TS7031
    onChangeUrl,
    // @ts-expect-error TS7031
    onChangeTextContent,
    // @ts-expect-error TS7031
    onChangeLoaderName,
    // @ts-expect-error TS7031
    onFileLoad,
    // @ts-expect-error TS7031
    onUrlUpload,
    // @ts-expect-error TS7031
    onTextUpload,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    loaders,
    // @ts-expect-error TS7031
    isFirstFile,
}) => {
    const [tab, setTab] = useState(0);
    const [files, setFiles] = useState([]);
    const [dropping, setDropping] = useState(false);
    const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
    const path = history.location.pathname;
    const successRedirectPath = '/data/existing';

    // @ts-expect-error TS7006
    const handleImportType = (_, newTab) => {
        setTab(newTab);
    };

    const handleAdding = () => {
        setDropping(true);
    };

    const handleAddRejected = () => {
        setDropping(false);
    };

    // @ts-expect-error TS7006
    const handleFileAdded = (list) => {
        setDropping(false);
        if (!list || list.length === 0) return;

        // @ts-expect-error TS2345
        setFiles([...list]);
        toast(polyglot.t('add_file_success', { name: list[0].file.name }), {
            type: toast.TYPE.SUCCESS,
        });
    };

    // @ts-expect-error TS7019
    const handleConfirm = (...params) => {
        // 0 = File, 1 = URL and 2 = TEXT
        switch (tab) {
            case 0: {
                if (files.length === 0) return;
                // @ts-expect-error TS2339
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
                        label={polyglot.t('upload_by_file')}
                    />
                    <Tab
                        icon={<LinkIcon />}
                        iconPosition="start"
                        label={polyglot.t('upload_by_url')}
                    />
                    <Tab
                        icon={<EditNoteIcon />}
                        iconPosition="start"
                        label={polyglot.t('upload_by_text')}
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
                            {polyglot.t('upload_file')}
                        </p>
                        {dropping ? (
                            <DroppingLoader text={polyglot.t('inspect_file')} />
                        ) : (
                            <DropzoneAreaBase
                                fileObjects={files}
                                filesLimit={1}
                                maxFileSize={1 * 1024 * 1024 * 1024}
                                // @ts-expect-error TS2322
                                dropzoneText={
                                    <Typography variant="h6">
                                        {polyglot.t('import_file_text')}
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
                            {polyglot.t('upload_via_url')}
                        </p>
                        <TextField
                            fullWidth
                            sx={styles.input}
                            value={url}
                            onChange={onChangeUrl}
                            placeholder="URL"
                            error={!!url && !isUrlValid}
                            helperText={
                                url && !isUrlValid && polyglot.t('invalid_url')
                            }
                            disabled={!!files.length}
                            label={polyglot.t('use_url')}
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
                            {polyglot.t('upload_via_text')}
                        </p>
                        {/*
                         // @ts-expect-error TS2739 */}
                        <FormSourceCodeField
                            style={styles.textInput}
                            enableModeSelector
                            p={polyglot}
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
                {polyglot.t('upload_data')}
            </Button>

            <ConfirmPopup
                cancelLabel={polyglot.t('Cancel')}
                confirmLabel={polyglot.t('Accept')}
                title={polyglot.t('info_upload')}
                description={polyglot.t('info_publish_desc')}
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

UploadComponent.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        location: PropTypes.object,
    }),
    className: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    url: PropTypes.string.isRequired,
    textContent: PropTypes.string.isRequired,
    loaderName: PropTypes.string.isRequired,
    loaders: PropTypes.array,
    isUrlValid: PropTypes.bool,
    isUploading: PropTypes.bool,
    onChangeUrl: PropTypes.func.isRequired,
    onChangeTextContent: PropTypes.func.isRequired,
    onFileLoad: PropTypes.func.isRequired,
    onUrlUpload: PropTypes.func.isRequired,
    onTextUpload: PropTypes.func.isRequired,
    onChangeLoaderName: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    isFirstFile: PropTypes.bool,
};

UploadComponent.defaultProps = {
    className: null,
    isUrlValid: true,
    error: false,
};

// @ts-expect-error TS7031
const DroppingLoader = ({ text }) => {
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
DroppingLoader.propTypes = {
    text: PropTypes.string.isRequired,
};

UploadComponent.propTypes = {
    text: PropTypes.string,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    url: fromUpload.getUrl(state),
    // @ts-expect-error TS2339
    textContent: fromUpload.getTextContent(state),
    // @ts-expect-error TS2339
    isUrlValid: fromUpload.isUrlValid(state),
    // @ts-expect-error TS2339
    isUploading: fromUpload.isUploadPending(state),
    // @ts-expect-error TS2339
    loaderName: fromUpload.getLoaderName(state),
    // @ts-expect-error TS2339
    loaders: fromLoaders.getLoaders(state),
});

const mapDispatchToProps = {
    onUrlUpload: uploadUrl,
    onFileLoad: uploadFile,
    onTextUpload: uploadText,
    // @ts-expect-error TS7006
    onChangeUrl: (e) => changeUploadUrl(e.target.value),
    // @ts-expect-error TS7006
    onChangeTextContent: (e) => changeUploadText(e),
    // @ts-expect-error TS7006
    onChangeLoaderName: (val) =>
        changeLoaderName(Array.isArray(val) ? val[0] : val),
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(UploadComponent);
