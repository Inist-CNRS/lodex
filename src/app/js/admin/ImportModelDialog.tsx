import { connect } from 'react-redux';
import { Dialog, Button, DialogContent, DialogActions } from '@mui/material';

import { importFields as importFieldsAction } from './import';
import CancelButton from '../lib/components/CancelButton';
import { useTranslate } from '../i18n/I18NContext';

const styles = {
    input: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        width: '100%',
        cursor: 'pointer',
    },
};

interface ImportModelDialogComponentProps {
    importFields(...args: unknown[]): unknown;
    onClose(...args: unknown[]): unknown;
}

const ImportModelDialogComponent = ({
    onClose,
    importFields,
}: ImportModelDialogComponentProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS7006
    const handleFileUpload = (event) => {
        importFields(event.target.files[0]);
        onClose();
    };

    const actions = [
        <CancelButton
            key="cancel"
            onClick={onClose}
            className="btn-cancel"
            sx={{
                marginTop: '12px',
            }}
        >
            {translate('cancel')}
        </CancelButton>,
        <Button
            variant="contained"
            key="confirm"
            component="label"
            color="primary"
            className="btn-save"
            sx={{
                marginTop: '12px',
            }}
        >
            {translate('confirm')}
            <input
                name="file_model"
                type="file"
                onChange={handleFileUpload}
                // @ts-expect-error TS2322
                style={styles.input}
            />
        </Button>,
    ];

    return (
        <Dialog
            className="dialog-import-fields"
            onClose={onClose}
            open
            sx={{
                '& > div > div': {
                    overflowY: 'unset',
                },
            }}
        >
            <DialogContent>{translate('confirm_import_fields')}</DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    importFields: importFieldsAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImportModelDialogComponent);
