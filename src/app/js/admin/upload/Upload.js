import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ArchiveIcon from 'material-ui/svg-icons/content/archive';
import { Card, CardText, CardActions } from 'material-ui/Card';
import { blue500 } from 'material-ui/styles/colors';

import Alert from '../../lib/Alert';
import { uploadFile } from './';
import { cancelReload } from '../parsing';
import { fromUpload, fromParsing } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    div: {
        margin: 10,
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
        color: blue500,
    },
    actionText: {
        color: blue500,
        paddingLeft: '10px',
    },
};

export const UploadComponent = ({ onFileLoad, onCancel, hasUploadedFile, error, p: polyglot, ...props }) => (
    <div
        className={classnames('upload', props.className)}
        style={styles.div}
    >
        { error ? <Alert>
            <p>Error uploading given file: </p>
            <p>{error}</p>
        </Alert> : <span />}
        <Card>
            <CardText style={styles.punchLine}>
                <p>{polyglot.t('easy-creation')}</p>
                <p>{polyglot.t('semantic-web-compatibility')}</p>
                <p>{polyglot.t('easy-update')}</p>
            </CardText>
            <CardActions style={styles.cardActions}>
                <span style={styles.actionText}>{polyglot.t('first-upload')}</span>
                <RaisedButton
                    containerElement="label"
                    primary
                    icon={<ArchiveIcon />}
                    label={polyglot.t('start')}
                    style={styles.button}
                >
                    <input
                        name="file"
                        type="file"
                        onChange={e => onFileLoad(e.target.files[0])}
                        style={styles.input}
                    />
                </RaisedButton>
            </CardActions>
        </Card>
        {hasUploadedFile ? <FlatButton onClick={onCancel} label={polyglot.t('cancel')} /> : null}
    </div>
);

UploadComponent.propTypes = {
    className: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    onFileLoad: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    hasUploadedFile: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

UploadComponent.defaultProps = {
    className: null,
};

const mapsStateToProps = state => ({
    ...fromUpload.getUpload(state),
    hasUploadedFile: fromParsing.hasUploadedFile(state),
});

const mapDispatchToProps = {
    onFileLoad: uploadFile,
    onCancel: cancelReload,
};

export default compose(
    connect(mapsStateToProps, mapDispatchToProps),
    translate,
)(UploadComponent);
