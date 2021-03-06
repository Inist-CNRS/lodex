import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import Alert from '../../lib/components/Alert';
import { Button, TextField, Grid, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { uploadFile, changeUploadUrl, changeLoaderName, uploadUrl } from './';
import { fromUpload, fromLoaders } from '../selectors';
import LoaderSelect from './LoaderSelect';
import theme from '../../theme';

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
}) => {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
    const [dropping, setDropping] = useState(false);
    const [useUrl, setUseUrl] = useState(false);
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
    };

    const handleFileUploaded = () => {
        if (files.length === 0) return;

        onFileLoad(files[0].file);
        if (path != successRedirectPath) {
            history.push(successRedirectPath);
        }
    };

    const handleUrlAdded = (...params) => {
        onUrlUpload(...params);
        if (path != successRedirectPath) {
            history.push(successRedirectPath);
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
            {!useUrl && (
                <DropzoneAreaBase
                    filesLimit={1}
                    maxFileSize={1 * 1024 * 1024 * 1024}
                    dropzoneText={
                        files.length
                            ? files[0].file.name
                            : polyglot.t('import_file_text')
                    }
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
                    onAlert={(message, variant) =>
                        console.log(`${variant}: ${message}`)
                    }
                />
            )}
            {useUrl && (
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
            <LoaderSelect
                loaders={loaders}
                setLoader={onChangeLoaderName}
                value={loaderName}
            />
            {useUrl ? (
                <Button
                    variant="contained"
                    disabled={!isUrlValid}
                    component="label"
                    color="primary"
                    fullWidth
                    className={classnames(classes.button, 'btn-upload-url')}
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
                    className={classnames(classes.button, 'btn-upload-dataset')}
                    disabled={files.length === 0}
                    onClick={handleFileUploaded}
                >
                    {polyglot.t('upload_file')}
                </Button>
            )}
            <div className={classes.divider}>
                <hr className={classes.dividerHr} />
                <div className={classes.dividerLabel}>{polyglot.t('or')}</div>
                <a
                    onClick={() => setUseUrl(!useUrl)}
                    className={classnames(classes.dividerLabel, classes.link)}
                >
                    {useUrl ? polyglot.t('not_use_url') : polyglot.t('use_url')}
                </a>

                <hr className={classes.dividerHr} />
            </div>
        </div>
    );
};

UploadComponent.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
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
            justify="center"
        >
            <CircularProgress />
            <span>{text}</span>
        </Grid>
    );
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
