import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import CancelButton from '../../lib/components/CancelButton';

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
        <CancelButton key="cancel" onClick={handleClose}>
            {polyglot.t('Cancel')}
        </CancelButton>,
        <Button
            variant="contained"
            color="primary"
            key="confirm"
            onClick={handleConfirmAction}
        >
            {polyglot.t('Accept')}
        </Button>,
    ];

    return (
        <Dialog open={isOpen} onClose={handleClose}>
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
