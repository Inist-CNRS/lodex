import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';

const CancelPublicationDialog = props => {
    const { p: polyglot, isOpen, title, content, onConfirm, onCancel } = props;
    return (
        <Dialog open={isOpen}>
            <DialogTitle>{polyglot.t(title)}</DialogTitle>
            <DialogContent>{polyglot.t(content)}</DialogContent>
            <DialogActions>
                <Button color="primary" variant="contained" onClick={onConfirm}>
                    {polyglot.t('Accept')}
                </Button>
                <Button color="secondary" variant="text" onClick={onCancel}>
                    {polyglot.t('Cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CancelPublicationDialog.propTypes = {
    p: polyglotPropTypes.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};
export default translate(CancelPublicationDialog);
