import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import RaisedButton from 'material-ui/RaisedButton';
import ArchiveIcon from 'material-ui/svg-icons/content/archive';
import { lightBlue500 } from 'material-ui/styles/colors';

import Alert from '../../lib/components/Alert';
import { uploadFile } from './';
import { fromUpload } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    div: {
        textAlign: 'center',
    },
    cardActions: {
        display: 'flex',
    },
    button: {
        marginLeft: 'auto',
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
    punchLine: {
        marginTop: '2rem',
    },
    actionText: {
        color: lightBlue500,
        paddingLeft: '10px',
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
        <div style={styles.punchLine}>
            <p>{polyglot.t('easy-creation')}</p>
            <p>{polyglot.t('semantic-web-compatibility')}</p>
            <p>{polyglot.t('easy-update')}</p>

            <RaisedButton
                containerElement="label"
                primary
                icon={<ArchiveIcon />}
                label={polyglot.t('first-upload')}
                style={styles.button}
            >
                <input
                    name="file"
                    type="file"
                    onChange={e => onFileLoad(e.target.files[0])}
                    style={styles.input}
                />
            </RaisedButton>
            <p>{polyglot.t('supported_format_list')} {LOADERS.join(', ')}</p>
        </div>
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

const mapsStateToProps = state => ({
    ...fromUpload.getUpload(state),
});

const mapDispatchToProps = {
    onFileLoad: uploadFile,
};

export default compose(
    connect(mapsStateToProps, mapDispatchToProps),
    translate,
)(UploadComponent);
