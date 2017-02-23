import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';

import RaisedButton from 'material-ui/RaisedButton';
import ArchiveIcon from 'material-ui/svg-icons/content/archive';
import Alert from '../../lib/Alert';

import { uploadFile } from './';
import { fromUpload } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    div: {
        position: 'relative',
        margin: 100,
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

export const UploadComponent = ({ onFileLoad, error, p: polyglot, ...props }) => (
    <div
        className={classnames('upload', props.className)}
        style={styles.div}
    >
        { error ? <Alert>
            <p>Error uploading given file: </p>
            <p>{error}</p>
        </Alert> : <span />}
        <RaisedButton
            containerElement="label"
            primary
            icon={<ArchiveIcon />}
            label={polyglot.t('upload_file')}
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

UploadComponent.propTypes = {
    className: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    onFileLoad: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

UploadComponent.defaultProps = {
    className: null,
};

const mapsStateToProps = fromUpload.getUpload;

const mapDispatchToProps = {
    onFileLoad: uploadFile,
};

export default compose(
    connect(mapsStateToProps, mapDispatchToProps),
    translate,
)(UploadComponent);
