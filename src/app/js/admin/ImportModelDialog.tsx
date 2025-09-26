import React from 'react';
import PropTypes from 'prop-types';
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

const ImportModelDialogComponent = ({ onClose, importFields }) => {
    const { translate } = useTranslate();
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

ImportModelDialogComponent.propTypes = {
    importFields: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    importFields: importFieldsAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImportModelDialogComponent);
