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
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { importFields as importFieldsAction } from './import';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromImport } from './selectors';

const useStyles = makeStyles({
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
    dialog: {
        '& > div > div': {
            overflowY: 'unset',
        },
    },
});

const ImportModelDialogComponent = ({
    failed,
    onClose,
    p: polyglot,
    importFields,
    succeeded,
}) => {
    const classes = useStyles();
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
            component="label"
            color="primary"
            className={classnames(classes.button, 'btn-save')}
        >
            {polyglot.t('confirm')}
            <input
                name="file_model"
                type="file"
                onChange={handleFileUpload}
                className={classes.input}
            />
        </Button>,
        <Button
            color="secondary"
            key="cancel"
            variant="text"
            onClick={onClose}
            className={classnames(classes.button, 'btn-cancel')}
        >
            {polyglot.t('cancel')}
        </Button>,
    ];

    return (
        <Dialog
            className={classnames(classes.dialog, 'dialog-import-fields')}
            open
        >
            <DialogContent>
                {!failed && polyglot.t('confirm_import_fields')}
                {failed && (
                    <span className={classes.error}>
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
