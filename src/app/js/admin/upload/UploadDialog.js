import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { uploadFile } from './';

const styles = {
    button: {
        // color: 'white',
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
};

export const UploadDialogComponent = ({ onFileLoad, p: polyglot }) => (
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
    </div>
);

UploadDialogComponent.propTypes = {
    onFileLoad: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};


const mapDispatchToProps = {
    onFileLoad: uploadFile,
};

export default compose(
    translate,
    connect(null, mapDispatchToProps),
)(UploadDialogComponent);
