import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';

import { importFields as importFieldsAction } from '../import';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromImport } from '../selectors';

const styles = {
    input: { display: 'none' },
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

        return (
            <Dialog className="dialog-import-fields" open>
                <DialogContent>
                    <DialogContentText>
                        {!failed ? (
                            polyglot.t('confirm_import_fields')
                        ) : (
                            <span style={styles.error}>
                                {polyglot.t('import_fields_failed')}
                            </span>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        secondary
                        key="cancel"
                        className="btn-cancel"
                        variant="contained"
                        onClick={onClose}
                    >
                        {polyglot.t('cancel')}
                    </Button>
                    <input
                        id="file_model"
                        name="file_model"
                        type="file"
                        onChange={this.handleFileUpload}
                        style={styles.input}
                    />
                    <label htmlFor="file_model">
                        <Button
                            key="confirm"
                            className="btn-save"
                            variant="contained"
                            primary
                            style={styles.button}
                        >
                            {polyglot.t('confirm')}
                        </Button>
                    </label>
                </DialogActions>
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
