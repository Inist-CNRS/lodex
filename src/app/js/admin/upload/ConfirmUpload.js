import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';

import { uploadFile, closeUploadPopup } from './';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromUpload } from '../selectors';

const styles = {
    container: {
        paddingBottom: '1rem',
    },
};

export const ConfirmUploadComponent = ({
    cancelUpload,
    p: polyglot,
    isOpenPopup,
    onConfirm,
}) => {
    const handleConfirmAction = () => {
        onConfirm();
        cancelUpload();
    };
    const actions = [
        <Button
            variant="text"
            color="primary"
            key="confirm"
            className="confirm"
            onClick={handleConfirmAction}
        >
            {polyglot.t('Accept')}
        </Button>,
        <Button
            variant="text"
            color="secondary"
            key="cancel"
            className="cancel"
            onClick={cancelUpload}
        >
            {polyglot.t('Cancel')}
        </Button>,
    ];

    return (
        <Dialog open={isOpenPopup}>
            <DialogTitle>{polyglot.t('info_upload')}</DialogTitle>
            <DialogContent>
                <div style={styles.container} id="confirm-upload">
                    {polyglot.t('info_publish_desc')}
                </div>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ConfirmUploadComponent.propTypes = {
    cancelUpload: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isOpenPopup: fromUpload.isOpenPopup(state),
});

const mapDispatchToProps = {
    cancelUpload: closeUploadPopup,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfirmUploadComponent);
