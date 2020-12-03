import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { withRouter } from 'react-router';

import ImportModelDialog from './ImportModelDialog';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { importFieldsClosed as importFieldsClosedAction } from './import';
import { fromPublication } from './selectors';

const useStyles = makeStyles({
    container: {
        textAlign: 'right',
        paddingBottom: 20,
    },
    buttonText: {
        textTransform: 'none',
    },
});

export const ImportModelButtonComponent = ({
    className,
    importFieldsClosed,
    hasPublishedDataset,
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

    return (
        <div className={classes.container}>
            <Button
                variant="text"
                className={classnames(
                    className,
                    classes.buttonText,
                    'btn-import-fields',
                )}
                onClick={handleImportFields}
            >
                {polyglot.t('import_fields')}
            </Button>
            {!hasPublishedDataset && showImportFieldsConfirmation && (
                <ImportModelDialog onClose={handleImportFieldsClose} />
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

ImportModelButtonComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    importFieldsClosed: importFieldsClosedAction,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ImportModelButtonComponent);
