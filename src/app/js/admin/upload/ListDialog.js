import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { uploadFile, changeUploadUrl, changeLoaderName, uploadUrl } from './';
import { fromUpload, fromLoaders } from '../selectors';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
    },
    input: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        width: '100%',
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

export const ListDialogComponent = ({
    url,
    loaderName,
    isUrlValid,
    onChangeUrl,
    onChangeLoaderName,
    onFileLoad,
    onUrlUpload,
    p: polyglot,
    loaders,
    open,
    actions,
    handleClose,
}) => {
    const loaderNames = loaders
        .map(loader => loader.name)
        .sort((x, y) => polyglot.t(x).localeCompare(polyglot.t(y)))
        .map(pn => (
            <MenuItem key={pn} value={pn} primaryText={polyglot.t(pn)} />
        ));

    return (
        <Dialog
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={handleClose}
            autoScrollBodyContent
        >
            <SelectField
                floatingLabelText={polyglot.t('loader_name')}
                value={loaderName}
                onChange={onChangeLoaderName}
                fullWidth
            >
                <MenuItem
                    key={'automatic'}
                    value={'automatic'}
                    primaryText={polyglot.t('automatic-loader')}
                />
                {loaderNames}
            </SelectField>
            <RaisedButton
                className="btn-upload-dataset"
                containerElement="label"
                primary
                fullWidth
                label={polyglot.t('upload_file')}
                style={styles.button}
            >
                <input
                    name="file"
                    type="file"
                    onChange={onFileLoad}
                    style={styles.input}
                />
            </RaisedButton>
            <div style={styles.divider}>
                <hr style={styles.dividerHr} />
                <div style={styles.dividerLabel}>{polyglot.t('or')}</div>
                <hr style={styles.dividerHr} />
            </div>
            <div>
                <TextField
                    fullWidth
                    value={url}
                    onChange={onChangeUrl}
                    errorText={url && !isUrlValid && polyglot.t('invalid_url')}
                    hintText="URL"
                />
                <RaisedButton
                    onClick={onUrlUpload}
                    disabled={!isUrlValid}
                    className="btn-upload-url"
                    containerElement="label"
                    primary
                    fullWidth
                    label={polyglot.t('upload_url')}
                    style={styles.button}
                />
            </div>
        </Dialog>
    );
};

ListDialogComponent.propTypes = {
    url: PropTypes.string.isRequired,
    loaderName: PropTypes.string.isRequired,
    isUrlValid: PropTypes.bool,
    onChangeUrl: PropTypes.func.isRequired,
    onFileLoad: PropTypes.func.isRequired,
    onUrlUpload: PropTypes.func.isRequired,
    onChangeLoaderName: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

ListDialogComponent.defaultProps = {
    isUrlValid: true,
};

const mapStateToProps = state => ({
    url: fromUpload.getUrl(state),
    isUrlValid: fromUpload.isUrlValid(state),
    loaderName: fromUpload.getLoaderName(state),
    loaders: fromLoaders.getLoaders(state),
});

const mapDispatchToProps = {
    onUrlUpload: uploadUrl,
    onFileLoad: e => uploadFile(e.target.files[0]),
    onChangeUrl: (_, value) => changeUploadUrl(value),
    onChangeLoaderName: (_, idx, val) => changeLoaderName(val),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ListDialogComponent);
