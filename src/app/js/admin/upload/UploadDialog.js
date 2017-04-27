import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    uploadFile,
    changeUploadUrl,
    uploadUrl,
} from './';
import { fromUpload } from '../selectors';


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

export const UploadDialogComponent = ({
    url,
    isUrlValid,
    onChangeUrl,
    onFileLoad,
    onUrlUpload,
    p: polyglot,
}) => (
    <div>
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
                onChange={e => onFileLoad(e.target.files[0])}
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
    </div>
);

UploadDialogComponent.propTypes = {
    url: PropTypes.string.isRequired,
    isUrlValid: PropTypes.bool.isRequired,
    onChangeUrl: PropTypes.func.isRequired,
    onFileLoad: PropTypes.func.isRequired,
    onUrlUpload: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    url: fromUpload.getUrl(state),
    isUrlValid: fromUpload.isUrlValid(state),
});

const mapDispatchToProps = {
    onFileLoad: uploadFile,
    onUrlUpload: uploadUrl,
    onChangeUrl: (_, value) => changeUploadUrl(value),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(UploadDialogComponent);
