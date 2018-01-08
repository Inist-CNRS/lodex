import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import { withRouter } from 'react-router';

import ImportFieldsDialog from './ImportFieldsDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFields as exportFieldsAction } from '../../exportFields';
import MenuItemLink from '../../lib/components/MenuItemLink';

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

    render() {
        const { hasPublishedDataset, location, p: polyglot } = this.props;
        const { open, anchorEl, showImportFieldsConfirmation } = this.state;

        return (
            <div style={styles.container}>
                <FlatButton
                    className="btn-model-menu"
                    onTouchTap={this.handleTouchTap}
                    label={polyglot.t('model')}
                    labelPosition="before"
                    icon={<ArrowDown />}
                    style={styles.button}
                />
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        horizontal: 'left',
                        vertical: 'bottom',
                    }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                >
                    <Menu>
                        {!hasPublishedDataset && (
                            <MenuItem
                                className="btn-import-fields"
                                primaryText={polyglot.t('import_fields')}
                                onClick={this.handleImportFields}
                            />
                        )}
                        <MenuItem
                            primaryText={polyglot.t('export_fields')}
                            onClick={this.handleExportFields}
                        />
                        {hasPublishedDataset && (
                            <MenuItemLink
                                disabled={location.pathname === '/ontology'}
                                label={polyglot.t('view_fields')}
                                link="/ontology"
                            />
                        )}
                    </Menu>
                </Popover>

                {!hasPublishedDataset &&
                    showImportFieldsConfirmation && (
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
};

export default compose(
    withRouter,
    connect(null, mapDispatchToProps),
    translate,
)(ModelMenuComponent);
