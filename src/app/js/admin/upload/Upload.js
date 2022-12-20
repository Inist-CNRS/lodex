import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import Alert from '../../lib/components/Alert';
import {
    Box,
    Button,
    TextField,
    Grid,
    CircularProgress,
    Typography,
} from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { uploadFile, changeUploadUrl, changeLoaderName, uploadUrl } from './';
import { fromUpload, fromLoaders } from '../selectors';
import LoaderSelect from './LoaderSelect';
import theme from '../../theme';
import PopupConfirmUpload from './PopupConfirmUpload';
import { toast } from 'react-toastify';

const useStyles = makeStyles({
    button: {
        marginLeft: 4,
        marginRight: 4,
        alignSelf: 'center',
    },
    input: {
        '@media (min-width: 992px)': {
            marginBottom: '16px',
        },
    },
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '48px',
        '@media (min-width: 1200px)': {
            width: 800,
            margin: '48px auto 0',
        },
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'center',
        '@media (min-width: 992px)': {
            flexDirection: 'row',
        },
    },
    loader: {
        zIndex: 5,
        position: 'absolute',
        width: 790,
        height: 240,
        margin: 5,
        backgroundColor: theme.white.primary,
        color: theme.green.primary,
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
            backgroundColor: theme.green.primary,
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
        },
        '@media (min-width: 992px)': {
            width: 'auto',
            position: 'static',
            marginTop: 0,
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
        backgroundColor: theme.white.primary,
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
    },
});

export const UploadComponent = ({
    history,
    error,
    url,
    loaderName,
    isUrlValid,
    onChangeUrl,
    onChangeLoaderName,
    onFileLoad,
    onUrlUpload,
    p: polyglot,
    loaders,
    isFirstFile,
}) => {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
    const [dropping, setDropping] = useState(false);
    const [useUrlForUpload, setUseUrlForUpload] = useState(false);
    const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
    const path = history.location.pathname;
    const successRedirectPath = '/data/existing';

    const handleAdding = () => {
        setDropping(true);
    };

    const handleAddRejected = () => {
        setDropping(false);
    };

    const handleFileAdded = list => {
        setDropping(false);
        if (!list || list.length === 0) return;

        setFiles([...list]);
        toast(polyglot.t('add_file_success', { name: list[0].file.name }), {
            type: toast.TYPE.SUCCESS,
        });
    };

    const handleFileUploaded = () => {
        if (files.length === 0) return;
        if (!isFirstFile) {
            setIsOpenPopupConfirm(true);
        } else {
            onConfirm();
        }
    };

    const onConfirm = (...params) => {
        if (useUrlForUpload) {
            onUrlUpload(...params);
        } else {
            onFileLoad(files[0].file);
        }

        if (path != successRedirectPath) {
            history.push(successRedirectPath);
        }
    };

    const handleUrlAdded = (...params) => {
        if (!isFirstFile) {
            setIsOpenPopupConfirm(true);
        } else {
            onConfirm(...params);
        }
    };

    useEffect(() => {
        if (files.length > 0) {
            setUseUrlForUpload(false);
        }
        if (files.length === 0 && url && isUrlValid) {
            setUseUrlForUpload(true);
        }
    }, [files, url, isUrlValid]);

    return (
        <Box className={classes.container}>
            {error ? (
                <Alert>
                    <p>Error uploading given file: </p>
                    <p>{error}</p>
                </Alert>
            ) : (
                <span />
            )}
            {dropping && <DroppingLoader text={polyglot.t('inspect_file')} />}
            <Box className={classes.form}>
                <DropzoneAreaBase
                    fileObjects={files}
                    filesLimit={1}
                    maxFileSize={1 * 1024 * 1024 * 1024}
                    dropzoneText={
                        <Typography variant="h6">
                            {polyglot.t('import_file_text')}
                        </Typography>
                    }
                    dropzoneProps={{
                        disabled: !!url,
                    }}
                    dropzoneClass={classnames(
                        classes.dropzone,
                        !!url && classes.disabledDropzone,
                    )}
                    showAlerts={['error']}
                    showPreviewsInDropzone
                    showFileNamesInPreview
                    previewGridClasses={{
                        container: classes.dropzonePreview,
                    }}
                    useChipsForPreview
                    alertSnackbarProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center',
                        },
                    }}
                    onAdd={fileObjs => handleFileAdded(fileObjs)}
                    onDrop={handleAdding}
                    onDropRejected={handleAddRejected}
                    onDelete={() => setFiles([])}
                />
                <Box className={classes.divider}>
                    <Typography variant="h6" className={classes.dividerLabel}>
                        {polyglot.t('or')}
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    className={classes.input}
                    value={url}
                    onChange={onChangeUrl}
                    placeholder="URL"
                    error={!!url && !isUrlValid}
                    helperText={url && !isUrlValid && polyglot.t('invalid_url')}
                    disabled={!!files.length}
                    label={polyglot.t('use_url')}
                />
            </Box>

            <LoaderSelect
                loaders={loaders}
                setLoader={onChangeLoaderName}
                value={loaderName}
            />
            <Button
                variant="contained"
                component="label"
                color="primary"
                className={classnames(classes.button, 'btn-upload-dataset')}
                disabled={files.length === 0 && (!url || !isUrlValid)}
                onClick={useUrlForUpload ? handleUrlAdded : handleFileUploaded}
            >
                {polyglot.t('upload_data')}
                <PublishIcon fontSize="medium" style={{ marginLeft: 20 }} />
            </Button>

            <PopupConfirmUpload
                history={history}
                onConfirm={onConfirm}
                isOpen={isOpenPopupConfirm}
                setIsOpenPopupConfirm={setIsOpenPopupConfirm}
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
    loaderName: PropTypes.string.isRequired,
    loaders: PropTypes.array,
    isUrlValid: PropTypes.bool,
    onChangeUrl: PropTypes.func.isRequired,
    onFileLoad: PropTypes.func.isRequired,
    onUrlUpload: PropTypes.func.isRequired,
    onChangeLoaderName: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    isFirstFile: PropTypes.bool,
};

UploadComponent.defaultProps = {
    className: null,
    isUrlValid: true,
    error: false,
};

const DroppingLoader = ({ text }) => {
    const classes = useStyles();
    return (
        <Grid
            className={classes.loader}
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

const mapStateToProps = state => ({
    url: fromUpload.getUrl(state),
    isUrlValid: fromUpload.isUrlValid(state),
    loaderName: fromUpload.getLoaderName(state),
    loaders: fromLoaders.getLoaders(state),
});

const mapDispatchToProps = {
    onUrlUpload: uploadUrl,
    onFileLoad: uploadFile,
    onChangeUrl: e => changeUploadUrl(e.target.value),
    onChangeLoaderName: val =>
        changeLoaderName(Array.isArray(val) ? val[0] : val),
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(UploadComponent);
