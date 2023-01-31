import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

const ImportHasEnrichmentsDialog = ({ p: polyglot, onClose }) => {
    const actions = [
        <Button
            raised
            key="submit"
            className="btn-save"
            onClick={onClose}
            color="primary"
        >
            {polyglot.t('confirm')}
        </Button>,
    ];

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>
                {polyglot.t('dialog_import_has_enrichments')}
            </DialogTitle>
            <DialogContent>
                <b>{polyglot.t('dialog_import_has_enrichments_description')}</b>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ImportHasEnrichmentsDialog.propTypes = {
    p: polyglotPropTypes.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(translate)(ImportHasEnrichmentsDialog);
