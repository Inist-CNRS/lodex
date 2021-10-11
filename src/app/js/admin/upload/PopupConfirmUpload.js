import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        paddingBottom: '1rem',
    },
};

export const PopupConfirmUploadComponent = ({
    p: polyglot,
    isOpen,
    onConfirm,
    setIsOpenPopupConfirm,
}) => {
    const handleClose = () => {
        setIsOpenPopupConfirm(false);
    };
    const handleConfirmAction = () => {
        onConfirm();
        handleClose();
    };
    const actions = [
        <Button
            variant="text"
            color="primary"
            key="confirm"
            onClick={handleConfirmAction}
        >
            {polyglot.t('Accept')}
        </Button>,
        <Button
            variant="text"
            color="secondary"
            key="cancel"
            onClick={handleClose}
        >
            {polyglot.t('Cancel')}
        </Button>,
    ];

    return (
        <Dialog open={isOpen}>
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

PopupConfirmUploadComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpenPopupConfirm: PropTypes.func.isRequired,
};

export default translate(PopupConfirmUploadComponent);
