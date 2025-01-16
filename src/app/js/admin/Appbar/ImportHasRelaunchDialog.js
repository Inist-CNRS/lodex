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

const ImportHasRelaunchDialog = ({ p: polyglot, onClose, data }) => {
    const actions = [
        <Button
            raised
            key="submit"
            className="btn-save"
            onClick={onClose}
            color="primary"
            variant="contained"
        >
            {polyglot.t('confirm')}
        </Button>,
    ];

    const returnTitleTranslationKey = () => {
        if (data.hasEnrichments && data.hasPrecomputed) {
            return 'dialog_import_has_enrichments_and_precomputed';
        } else if (data.hasEnrichments) {
            return 'dialog_import_has_enrichments';
        } else if (data.hasPrecomputed) {
            return 'dialog_import_has_precomputed';
        }
    };

    const returnDescriptionTranslationKey = () => {
        if (data.hasEnrichments && data.hasPrecomputed) {
            return 'dialog_import_has_enrichments_and_precomputed_description';
        } else if (data.hasEnrichments) {
            return 'dialog_import_has_enrichments_description';
        } else if (data.hasPrecomputed) {
            return 'dialog_import_has_precomputed_description';
        }
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>{polyglot.t(returnTitleTranslationKey())}</DialogTitle>
            <DialogContent>
                <b>{polyglot.t(returnDescriptionTranslationKey())}</b>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ImportHasRelaunchDialog.propTypes = {
    p: polyglotPropTypes.isRequired,
    onClose: PropTypes.func.isRequired,
    data: PropTypes.shape({
        hasEnrichments: PropTypes.bool.isRequired,
        hasPrecomputed: PropTypes.bool.isRequired,
    }).isRequired,
};

export default compose(translate)(ImportHasRelaunchDialog);
