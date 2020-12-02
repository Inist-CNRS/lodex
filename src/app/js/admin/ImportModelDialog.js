import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import {
    Dialog,
    Button,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import { importFields as importFieldsAction } from './import';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromImport } from './selectors';

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
    button: {
        marginTop: '12px',
    },
    error: {
        color: red[300],
    },
};

const ImportModelDialogComponent = ({
    failed,
    onClose,
    p: polyglot,
    importFields,
    succeeded,
}) => {
    useEffect(() => {
        if (succeeded) {
            onClose(true);
        }
    }, [onClose, succeeded]);

    const handleFileUpload = event => {
        importFields(event.target.files[0]);
    };

    const actions = [
        <Button
            variant="contained"
            key="confirm"
            className="btn-save"
            component="label"
            color="primary"
            style={styles.button}
        >
            {polyglot.t('confirm')}
            <input
                name="file_model"
                type="file"
                onChange={handleFileUpload}
                style={styles.input}
            />
        </Button>,
        <Button
            color="secondary"
            key="cancel"
            variant="text"
            className="btn-cancel"
            onClick={onClose}
            style={styles.button}
        >
            {polyglot.t('cancel')}
        </Button>,
    ];

    return (
        <Dialog className="dialog-import-fields" open>
            <DialogContent>
                {!failed && polyglot.t('confirm_import_fields')}
                {failed && (
                    <span style={styles.error}>
                        {polyglot.t('import_fields_failed')}
                    </span>
                )}
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ImportModelDialogComponent.propTypes = {
    succeeded: PropTypes.bool.isRequired,
    failed: PropTypes.bool.isRequired,
    importFields: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    succeeded: fromImport.hasImportSucceeded(state),
    failed: fromImport.hasImportFailed(state),
});

const mapDispatchToProps = {
    importFields: importFieldsAction,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ImportModelDialogComponent);
