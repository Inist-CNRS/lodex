import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import RaisedButton from 'material-ui/RaisedButton';

import { uploadFile } from './';
import { fromUpload } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
        marginTop: 4,
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
};

export const UploadButtonComponent = ({ onFileLoad, p: polyglot }) => (
    <RaisedButton
        className="btn-upload-dataset"
        containerElement="label"
        label={polyglot.t('upload_another_file')}
        style={styles.button}
    >
        <input
            name="file"
            type="file"
            onChange={e => onFileLoad(e.target.files[0])}
            style={styles.input}
        />
    </RaisedButton>
);

UploadButtonComponent.propTypes = {
    onFileLoad: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

UploadButtonComponent.defaultProps = {
    className: null,
};

const mapDispatchToProps = {
    onFileLoad: uploadFile,
};

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(UploadButtonComponent);
