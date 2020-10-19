import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import ArchiveIcon from '@material-ui/icons/Archive';
import { lightBlue } from '@material-ui/core/colors';

import Alert from '../../lib/components/Alert';
import { uploadFile } from './';
import { fromUpload, fromLoaders } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import UploadButton from './UploadButton';

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
        color: lightBlue[500],
        paddingLeft: '10px',
    },
};

export const UploadComponent = ({
    onFileLoad,
    error,
    p: polyglot,
    loaders,
    ...props
}) => (
    <div className={classnames('upload', props.className)} style={styles.div}>
        {error ? (
            <Alert>
                <p>Error uploading given file: </p>
                <p>{error}</p>
            </Alert>
        ) : (
            <span />
        )}
        <div style={styles.punchLine}>
            <p>{polyglot.t('easy-creation')}</p>
            <p>{polyglot.t('semantic-web-compatibility')}</p>
            <p>{polyglot.t('easy-update')}</p>
            <UploadButton
                raised
                icon={<ArchiveIcon />}
                label={polyglot.t('first-upload')}
            />
            <p>
                {polyglot.t('supported_format_list')}{' '}
                {loaders.map(loader => loader.name).join(', ')}
            </p>
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
    loaders: fromLoaders.getLoaders(state),
});

const mapDispatchToProps = {
    onFileLoad: uploadFile,
};

export default compose(
    connect(mapsStateToProps, mapDispatchToProps),
    translate,
)(UploadComponent);
