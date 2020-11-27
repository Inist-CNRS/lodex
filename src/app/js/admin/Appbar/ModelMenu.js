import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';

import ImportFieldsDialog from './ImportFieldsDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { importFieldsClosed as importFieldsClosedAction } from '../import';

const styles = {
    container: {
        textAlign: 'right',
        paddingBottom: 20,
    },
    button: {
        color: 'black',
    },
};

export const ModelMenuComponent = ({
    importFieldsClosed,
    hasPublishedDataset,
    p: polyglot,
}) => {
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
        <div style={styles.container}>
            <Button
                variant="text"
                className="btn-import-fields"
                onClick={handleImportFields}
                style={styles.button}
            >
                {polyglot.t('import_fields')}
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
    hasPublishedDataset: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = {
    importFieldsClosed: importFieldsClosedAction,
};

export default compose(
    withRouter,
    connect(null, mapDispatchToProps),
    translate,
)(ModelMenuComponent);
