import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Snackbar } from '@material-ui/core';
import { Add as AddNewIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';

import AddFromDatasetIcon from './AddFromDatasetIcon';
import ImportFieldsDialog from './ImportFieldsDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { importFieldsClosed as importFieldsClosedAction } from '../import';
import { addField } from '../../fields';
import { showAddColumns, hideAddColumns } from '../parsing';

const useStyles = makeStyles({
    container: {
        textAlign: 'right',
        paddingBottom: 20,
        position: 'sticky',
        top: 0,
    },
    button: {
        color: 'black',
    },
    containedButton: {
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

export const ModelMenuComponent = ({
    importFieldsClosed,
    hasPublishedDataset,
    handleAddColumn,
    handleShowExistingColumns,
    handleHideExistingColumns,
    p: polyglot,
}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [
        showImportFieldsConfirmation,
        setShowImportFieldsConfirmation,
    ] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const handleImportFieldsClose = sucess => {
        importFieldsClosed();
        setShowImportFieldsConfirmation(false);
        setShowSuccessAlert(sucess === true);
    };

    const handleImportFields = () => {
        setOpen(false);
        setShowImportFieldsConfirmation(true);
    };

    const handleAddNewColumn = () => {
        handleHideExistingColumns();
        handleAddColumn();
    };

    return (
        <div className={classes.container}>
            <Button
                variant="outlined"
                className="btn-import-fields"
                onClick={handleImportFields}
                color="primary"
            >
                {polyglot.t('import_fields')}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleShowExistingColumns}
                className={classes.containedButton}
            >
                <AddFromDatasetIcon className={classes.icon} />
                {polyglot.t('from_original_dataset')}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddNewColumn}
                className={classes.containedButton}
            >
                <AddNewIcon className={classes.icon} />
                {polyglot.t('new_field')}
            </Button>
            {!hasPublishedDataset && showImportFieldsConfirmation && (
                <ImportFieldsDialog onClose={handleImportFieldsClose} />
            )}
            <Snackbar
                open={showSuccessAlert}
                autoHideDuration={60000}
                onClose={() => setShowSuccessAlert(false)}
            >
                <Alert variant="filled" severity="success">
                    {polyglot.t('model_imported_with_success')}
                </Alert>
            </Snackbar>
        </div>
    );
};

ModelMenuComponent.propTypes = {
    handleAddColumn: PropTypes.func.isRequired,
    handleShowExistingColumns: PropTypes.func.isRequired,
    handleHideExistingColumns: PropTypes.func.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = {
    importFieldsClosed: importFieldsClosedAction,
    handleAddColumn: name => addField({ name }),
    handleShowExistingColumns: showAddColumns,
    handleHideExistingColumns: hideAddColumns,
};

export default compose(
    withRouter,
    connect(null, mapDispatchToProps),
    translate,
)(ModelMenuComponent);
