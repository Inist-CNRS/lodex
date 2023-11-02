import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import CancelButton from '../../lib/components/CancelButton';

const CancelProcessDialog = props => {
    const { p: polyglot, isOpen, title, content, onConfirm, onCancel } = props;
    return (
        <Dialog open={isOpen}>
            <DialogTitle>{polyglot.t(title)}</DialogTitle>
            <DialogContent>{polyglot.t(content)}</DialogContent>
            <DialogActions>
                <CancelButton onClick={onCancel}>
                    {polyglot.t('Cancel')}
                </CancelButton>
                <Button color="primary" variant="contained" onClick={onConfirm}>
                    {polyglot.t('Accept')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CancelProcessDialog.propTypes = {
    p: polyglotPropTypes.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};
export default translate(CancelProcessDialog);
