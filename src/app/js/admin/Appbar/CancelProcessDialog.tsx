import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import CancelButton from '../../lib/components/CancelButton';
import { useTranslate } from '../../i18n/I18NContext';

// @ts-expect-error TS7006
const CancelProcessDialog = (props) => {
    const { isOpen, title, content, onConfirm, onCancel } = props;
    const { translate } = useTranslate();
    return (
        <Dialog open={isOpen}>
            <DialogTitle>{translate(title)}</DialogTitle>
            <DialogContent>{translate(content)}</DialogContent>
            <DialogActions>
                <CancelButton onClick={onCancel}>
                    {translate('Cancel')}
                </CancelButton>
                <Button color="primary" variant="contained" onClick={onConfirm}>
                    {translate('Accept')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CancelProcessDialog.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};
export default CancelProcessDialog;
