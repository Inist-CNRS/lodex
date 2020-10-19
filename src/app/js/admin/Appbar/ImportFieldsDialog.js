import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Dialog, Button } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import { importFields as importFieldsAction } from '../import';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromImport } from '../selectors';

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
        top: '12px',
    },
    error: {
        color: red[300],
    },
};

class ImportFieldsDialogComponent extends Component {
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.succeeded) {
            this.props.onClose();
        }
    }

    storeFieldsInputRef = input => {
        this.fieldsImportInput = input;
    };

    handleFileUpload = event => {
        this.props.importFields(event.target.files[0]);
    };

    render() {
        const { failed, onClose, p: polyglot } = this.props;

        const actions = [
            <Button
                variant="contained"
                key="confirm"
                className="btn-save"
                containerElement="label"
                label={polyglot.t('confirm')}
                color="primary"
                style={styles.button}
            >
                <input
                    name="file_model"
                    type="file"
                    onChange={this.handleFileUpload}
                    style={styles.input}
                />
            </Button>,
            <Button
                color="secondary"
                key="cancel"
                variant="text"
                className="btn-cancel"
                label={polyglot.t('cancel')}
                onClick={onClose}
            />,
        ];

        return (
            <Dialog
                actions={actions}
                classes={{}}
                className="dialog-import-fields"
                open
            >
                {!failed && polyglot.t('confirm_import_fields')}
                {failed && (
                    <span style={styles.error}>
                        {polyglot.t('import_fields_failed')}
                    </span>
                )}
            </Dialog>
        );
    }
}

ImportFieldsDialogComponent.propTypes = {
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
)(ImportFieldsDialogComponent);
