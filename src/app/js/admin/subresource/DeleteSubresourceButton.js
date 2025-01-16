import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { compose, withState } from 'recompose';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import CancelButton from '../../lib/components/CancelButton';

export const DeleteSubresourceButtonComponent = ({
    p: polyglot,
    onClick,
    showDeletePopup,
    setShowDeletePopup,
}) => (
    <>
        <Button
            variant="contained"
            color="warning"
            onClick={() => setShowDeletePopup(true)}
        >
            {polyglot.t('delete')}
        </Button>
        {showDeletePopup && (
            <Dialog open onClose={() => setShowDeletePopup(false)}>
                <DialogTitle>
                    {polyglot.t('confirm_delete_subresource')}
                </DialogTitle>
                <DialogActions>
                    <CancelButton onClick={() => setShowDeletePopup(false)}>
                        {polyglot.t('Cancel')}
                    </CancelButton>
                    <Button
                        color="warning"
                        variant="contained"
                        onClick={onClick}
                    >
                        {polyglot.t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        )}
    </>
);

DeleteSubresourceButtonComponent.propTypes = {
    showDeletePopup: PropTypes.bool.isRequired,
    setShowDeletePopup: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export const DeleteSubresourceButton = compose(
    translate,
    withState('showDeletePopup', 'setShowDeletePopup', false),
)(DeleteSubresourceButtonComponent);
