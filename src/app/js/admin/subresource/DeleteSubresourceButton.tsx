import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
// @ts-expect-error TS7016
import { compose, withState } from 'recompose';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import CancelButton from '../../lib/components/CancelButton';
import { translate } from '../../i18n/I18NContext';

export const DeleteSubresourceButtonComponent = ({
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    onClick,
    // @ts-expect-error TS7031
    showDeletePopup,
    // @ts-expect-error TS7031
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
