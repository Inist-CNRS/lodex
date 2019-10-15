import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';

import ImportFieldsDialog from './ImportFieldsDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFields as exportFieldsAction } from '../../exportFields';
import { exportFieldsReady as exportFieldsReadyAction } from '../../exportFieldsReady';
import Link from '../../lib/components/Link';

const styles = {
    container: {
        display: 'inline-block',
        marginLeft: 4,
        marginRight: 4,
    },
    button: {
        color: 'white',
    },
};

export class ModelMenuComponent extends Component {
    static propTypes = {
        hasPublishedDataset: PropTypes.bool.isRequired,
        exportFields: PropTypes.func.isRequired,
        exportFieldsReady: PropTypes.func.isRequired,
        location: PropTypes.shape({ pathname: PropTypes.string }),
        p: polyglotPropTypes.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            showImportFieldsConfirmation: false,
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
        const { hasPublishedDataset, location, p: polyglot } = this.props;
        const { showImportFieldsConfirmation } = this.state;

        return (
            <div style={styles.container}>
                {hasPublishedDataset ? (
                    <FlatButton
                        label={polyglot.t('view_fields')}
                        containerElement={<Link to="/ontology" />}
                        disabled={location.pathname === '/ontology'}
                        style={styles.button}
                    />
                ) : (
                    <FlatButton
                        className="btn-import-fields"
                        label={polyglot.t('import_fields')}
                        onClick={this.handleImportFields}
                        style={styles.button}
                    />
                )}
                {!hasPublishedDataset && showImportFieldsConfirmation && (
                    <ImportFieldsDialog
                        onClose={this.handleImportFieldsClose}
                    />
                )}
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
    connect(
        null,
        mapDispatchToProps,
    ),
    translate,
)(ModelMenuComponent);
