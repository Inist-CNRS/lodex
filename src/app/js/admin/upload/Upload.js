import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import Alert from '../../lib/components/Alert';
import { Button, TextField, FormControl, InputLabel } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { uploadFile, changeUploadUrl, changeLoaderName, uploadUrl } from './';
import { fromUpload, fromLoaders } from '../selectors';
import LoaderSelect from './LoaderSelect';
import theme from '../../theme';

const styles = {
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
};

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
        <div style={{ width: 800, margin: 'auto' }}>
            {error ? (
                <Alert>
                    <p>Error uploading given file: </p>
                    <p>{error}</p>
                </Alert>
            ) : (
                <span />
            )}
            {!useUrl && (
                <DropzoneAreaBase
                    filesLimit={1}
                    maxFileSize={1 * 1024 * 1024 * 1024}
                    dropzoneText={
                        dropping
                            ? 'ADDING'
                            : files.length
                            ? files[0].file.name
                            : polyglot.t('import_file_text')
                    }
                    showPreviewsInDropzone
                    showFileNamesInPreview
                    onAdd={fileObjs => handleFileAdded(fileObjs)}
                    onDrop={handleAdding}
                    onDropRejected={handleAddRejected}
                    onAlert={(message, variant) =>
                        console.log(`${variant}: ${message}`)
                    }
                />
            )}
            <LoaderSelect
                loaders={loaders}
                setLoader={onChangeLoaderName}
                value={loaderName}
            />
            {!useUrl && (
                <Button
                    variant="contained"
                    className="btn-upload-dataset"
                    component="label"
                    color="primary"
                    fullWidth
                    style={styles.button}
                    disabled={files.length === 0}
                    onClick={handleFileUploaded}
                >
                    {polyglot.t('upload_file')}
                </Button>
            )}
            {useUrl && (
                <div>
                    <TextField
                        fullWidth
                        style={styles.input}
                        value={url}
                        onChange={onChangeUrl}
                        placeholder="URL"
                        error={!!url && !isUrlValid}
                        helperText={
                            url && !isUrlValid && polyglot.t('invalid_url')
                        }
                    />
                    <Button
                        variant="contained"
                        disabled={!isUrlValid}
                        className="btn-upload-url"
                        component="label"
                        color="primary"
                        fullWidth
                        style={styles.button}
                        disabled={!url || !isUrlValid}
                        onClick={handleUrlAdded}
                    >
                        {polyglot.t('upload_url')}
                    </Button>
                </div>
            )}
            <div style={styles.divider}>
                <hr style={styles.dividerHr} />
                <div style={styles.dividerLabel}>{polyglot.t('or')}</div>
                <a
                    onClick={() => setUseUrl(!useUrl)}
                    style={{ ...styles.dividerLabel, ...styles.link }}
                >
                    {useUrl ? polyglot.t('not_use_url') : polyglot.t('use_url')}
                </a>

                <hr style={styles.dividerHr} />
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
