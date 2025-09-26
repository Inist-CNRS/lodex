import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';

const ImportHasRelaunchDialog = ({ onClose, data }) => {
    const { translate } = useTranslate();
    const actions = [
        <Button
            raised
            key="submit"
            className="btn-save"
            onClick={onClose}
            color="primary"
            variant="contained"
        >
            {translate('confirm')}
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
            <DialogTitle>{translate(returnTitleTranslationKey())}</DialogTitle>
            <DialogContent>
                <b>{translate(returnDescriptionTranslationKey())}</b>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ImportHasRelaunchDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    data: PropTypes.shape({
        hasEnrichments: PropTypes.bool.isRequired,
        hasPrecomputed: PropTypes.bool.isRequired,
    }).isRequired,
};

export default ImportHasRelaunchDialog;
