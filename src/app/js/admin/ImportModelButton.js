import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { withRouter } from 'react-router';

import ImportModelDialog from './ImportModelDialog';
import { polyglot as polyglotPropTypes } from '../propTypes';
import {
    importFieldsClosed as importFieldsClosedAction,
    importFields as importFieldsAction,
} from './import';

import { fromPublication, fromImport } from './selectors';
import { fromFields } from '../sharedSelectors';
import { toast } from 'react-toastify';

const useStyles = makeStyles({
    container: {
        textAlign: 'right',
        paddingBottom: 20,
    },
    buttonText: {
        textTransform: 'none',
    },
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
});

export const ImportModelButtonComponent = ({
    className,
    importFieldsClosed,
    hasPublishedDataset,
    p: polyglot,
    nbFields,
    importFields,
    succeeded,
    failed,
}) => {
    const classes = useStyles();
    const [
        showImportFieldsConfirmation,
        setShowImportFieldsConfirmation,
    ] = useState(false);

    const [applyUploadInput, setApplyUploadInput] = useState(false);
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        if (failed) {
            toast(polyglot.t('import_fields_failed'), {
                type: toast.TYPE.ERROR,
            });
        } else if (succeeded) {
            toast(polyglot.t('model_imported_with_success'), {
                type: toast.TYPE.SUCCESS,
            });
        }
    }, [succeeded, failed]);

    useEffect(() => {
        if (nbFields === 0) {
            setApplyUploadInput(true);
        } else {
            setApplyUploadInput(false);
        }
    }, [nbFields]);

    const handleImportFieldsClose = () => {
        importFieldsClosed();
        setShowImportFieldsConfirmation(false);
    };

    const handleImportFields = event => {
        if (applyUploadInput) {
            importFields(event.target.files[0]);
        } else {
            setShowImportFieldsConfirmation(true);
        }
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
                {applyUploadInput && (
                    <input
                        name="file_model"
                        type="file"
                        onChange={handleImportFields}
                        className={classes.input}
                    />
                )}
            </Button>
            {!hasPublishedDataset && showImportFieldsConfirmation && (
                <ImportModelDialog onClose={handleImportFieldsClose} />
            )}
        </div>
    );
};

ImportModelButtonComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    importFieldsClosed: PropTypes.func.isRequired,
    className: PropTypes.string,
    nbFields: PropTypes.number,
    importFields: PropTypes.func.isRequired,
    succeeded: PropTypes.bool.isRequired,
    failed: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    succeeded: fromImport.hasImportSucceeded(state),
    failed: fromImport.hasImportFailed(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    nbFields: fromFields.getAllListFields(state).filter(f => f.name !== 'uri')
        .length,
});

const mapDispatchToProps = {
    importFieldsClosed: importFieldsClosedAction,
    importFields: importFieldsAction,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ImportModelButtonComponent);
