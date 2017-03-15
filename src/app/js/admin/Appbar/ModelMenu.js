import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

import ImportFieldsDialog from '../publicationPreview/ImportFieldsDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFields as exportFieldsAction } from '../../exportFields';

const styles = {
    container: {
        display: 'inline-block',
        marginLeft: 4,
        marginRight: 4,
    },
};

export class ModelMenuComponent extends Component {
    static propTypes = {
        exportFields: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            showImportFieldsConfirmation: false,
        };
    }

    handleTouchTap = (event) => {
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
    }

    handleImportFields = () => {
        this.setState({
            open: false,
            showImportFieldsConfirmation: true,
        });
    }

    handleExportFields = () => {
        this.setState({
            open: false,
        });

        this.props.exportFields();
    }

    render() {
        const { p: polyglot } = this.props;
        const { open, anchorEl, showImportFieldsConfirmation } = this.state;

        return (
            <div style={styles.container}>
                <RaisedButton
                    className="btn-model-menu"
                    onTouchTap={this.handleTouchTap}
                    label={polyglot.t('model')}
                    labelPosition="before"
                    icon={<ArrowDown />}
                />
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                >
                    <Menu>
                        <MenuItem
                            className="btn-import-fields"
                            primaryText={polyglot.t('import_fields')}
                            onClick={this.handleImportFields}
                        />
                        <MenuItem
                            primaryText={polyglot.t('export_fields')}
                            onClick={this.handleExportFields}
                        />
                    </Menu>
                </Popover>

                {showImportFieldsConfirmation &&
                    <ImportFieldsDialog
                        onClose={this.handleImportFieldsClose}
                    />
                }
            </div>
        );
    }
}

const mapDispatchToProps = ({
    exportFields: exportFieldsAction,
});

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(ModelMenuComponent);
