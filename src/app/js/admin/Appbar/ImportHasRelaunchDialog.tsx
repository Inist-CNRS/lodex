// @ts-expect-error TS6133
import React from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';

interface ImportHasRelaunchDialogProps {
    onClose(...args: unknown[]): unknown;
    data: {
        hasEnrichments: boolean;
        hasPrecomputed: boolean;
    };
}

const ImportHasRelaunchDialog = ({
    onClose,
    data
}: ImportHasRelaunchDialogProps) => {
    const { translate } = useTranslate();
    const actions = [
        // @ts-expect-error TS2769
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
            <DialogTitle>
                {returnTitleTranslationKey()
                    ? translate(returnTitleTranslationKey()!)
                    : null}
            </DialogTitle>
            <DialogContent>
                <b>
                    {returnDescriptionTranslationKey()
                        ? translate(returnDescriptionTranslationKey()!)
                        : null}
                </b>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

export default ImportHasRelaunchDialog;
