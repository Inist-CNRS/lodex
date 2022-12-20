import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import Alert from '../../lib/components/Alert';
import {
    Button,
    TextField,
    Grid,
    CircularProgress,
    Typography,
} from '@material-ui/core';
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
    },
    input: {
        margin: '10px 4px',
    },
    link: {
        color: theme.green.primary,
        cursor: 'pointer',
    },
    alert: {
        width: 800,
        margin: 'auto',
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
        display: 'flex',
        margin: '10px',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dividerLabel: {
        margin: '1rem',
    },
    dividerHr: {
        flexGrow: 2,
        marginLeft: '1rem',
        marginRight: '1rem',
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

    return (
        <div className={classes.alert}>
            {error ? (
                <Alert>
                    <p>Error uploading given file: </p>
                    <p>{error}</p>
                </Alert>
            ) : (
                <span />
            )}
            {dropping && <DroppingLoader text={polyglot.t('inspect_file')} />}
            {!useUrlForUpload && (
                <DropzoneAreaBase
                    filesLimit={1}
                    maxFileSize={1 * 1024 * 1024 * 1024}
                    dropzoneText={
                        <>
                            <Typography variant="h6">
                                1. {polyglot.t('import_file_text')}
                            </Typography>
                            {!!files.length && (
                                <Typography variant="subtitle1">
                                    {files[0].file.name}
                                </Typography>
                            )}
                        </>
                    }
                    showAlerts={['error']}
                    showPreviewsInDropzone
                    showFileNamesInPreview
                    alertSnackbarProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center',
                        },
                    }}
                    onAdd={fileObjs => handleFileAdded(fileObjs)}
                    onDrop={handleAdding}
                    onDropRejected={handleAddRejected}
                />
            )}
            {useUrlForUpload && (
                <TextField
                    fullWidth
                    className={classes.input}
                    value={url}
                    onChange={onChangeUrl}
                    placeholder="URL"
                    error={!!url && !isUrlValid}
                    helperText={url && !isUrlValid && polyglot.t('invalid_url')}
                />
            )}
            {!!files.length && (
                <>
                    <LoaderSelect
                        loaders={loaders}
                        setLoader={onChangeLoaderName}
                        value={loaderName}
                    />
                    {useUrlForUpload ? (
                        <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            fullWidth
                            className={classnames(
                                classes.button,
                                'btn-upload-url',
                            )}
                            disabled={!url || !isUrlValid}
                            onClick={handleUrlAdded}
                        >
                            {polyglot.t('upload_url')}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            fullWidth
                            className={classnames(
                                classes.button,
                                'btn-upload-dataset',
                            )}
                            disabled={files.length === 0}
                            onClick={handleFileUploaded}
                        >
                            {polyglot.t('upload_file')}
                        </Button>
                    )}
                </>
            )}
            <PopupConfirmUpload
                history={history}
                onConfirm={onConfirm}
                isOpen={isOpenPopupConfirm}
                setIsOpenPopupConfirm={setIsOpenPopupConfirm}
            />
            <div className={classes.divider}>
                <hr className={classes.dividerHr} />
                <div className={classes.dividerLabel}>{polyglot.t('or')}</div>
                <a
                    onClick={() => setUseUrlForUpload(!useUrlForUpload)}
                    className={classnames(classes.dividerLabel, classes.link)}
                >
                    {useUrlForUpload
                        ? polyglot.t('not_use_url')
                        : polyglot.t('use_url')}
                </a>

                <hr className={classes.dividerHr} />
            </div>
        </div>
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
