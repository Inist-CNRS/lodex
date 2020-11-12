import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';

import ImportFieldsDialog from './ImportFieldsDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFields as exportFieldsAction } from '../../exportFields';
import { exportFieldsReady as exportFieldsReadyAction } from '../../exportFieldsReady';

const styles = {
    container: {
        textAlign: 'right',
        paddingBottom: 20,
    },
    button: {
        color: 'black',
    },
};

export class ModelMenuComponent extends Component {
    static propTypes = {
        hasPublishedDataset: PropTypes.bool.isRequired,
        exportFields: PropTypes.func.isRequired,
        exportFieldsReady: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            showImportFieldsConfirmation: false,
            showSuccessAlert: false,
        };
    }

    handleTouchTap = event => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    handleImportFieldsClose = () => {
        this.setState({
            showImportFieldsConfirmation: false,
            showSuccessAlert: true,
        });
    };

    handleImportFields = () => {
        this.setState({
            open: false,
            showImportFieldsConfirmation: true,
        });
    };

    handleExportFields = () => {
        this.setState({
            open: false,
        });

        this.props.exportFields();
    };

    handleExportFieldsReady = () => {
        this.setState({
            open: false,
        });

        this.props.exportFieldsReady();
    };

    render() {
        const { hasPublishedDataset, p: polyglot } = this.props;
        const { showImportFieldsConfirmation, showSuccessAlert } = this.state;

        return (
            <div style={styles.container}>
                <Button
                    variant="text"
                    className="btn-import-fields"
                    onClick={this.handleImportFields}
                    style={styles.button}
                >
                    {polyglot.t('import_fields')}
                </Button>
                {!hasPublishedDataset && showImportFieldsConfirmation && (
                    <ImportFieldsDialog
                        onClose={this.handleImportFieldsClose}
                    />
                )}
                <Snackbar
                    open={showSuccessAlert}
                    autoHideDuration={60000}
                    onClose={() => this.setState({ showSuccessAlert: false })}
                >
                    <Alert variant="filled" severity="success">
                        {polyglot.t('model_imported_with_success')}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

const mapDispatchToProps = {
    exportFields: exportFieldsAction,
    exportFieldsReady: exportFieldsReadyAction,
};

export default compose(
    withRouter,
    connect(null, mapDispatchToProps),
    translate,
)(ModelMenuComponent);
