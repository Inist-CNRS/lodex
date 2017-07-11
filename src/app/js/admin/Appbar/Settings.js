import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { red400, red600 } from 'material-ui/styles/colors';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import { polyglot as polyglotPropTypes } from '../../propTypes';

import ClearDialog from './ClearDialog';

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

class DangerZoneComponent extends Component {

    static propTypes = {
        p: polyglotPropTypes.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            showClearDataset: false,
            showClearPublished: false,
        };
    }

    handleTouchTap = (event) => {
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    handleClearDataset = () => {
        this.setState({
            open: false,
            showClearDataset: true,
        });
    }

    handleClearPublished = () => {
        this.setState({
            open: false,
            showClearPublished: true,
        });
    }

    handleCloseDataset = () => {
        this.setState({
            showClearDataset: false,
        });
    }

    handleClosePublished = () => {
        this.setState({
            showClearPublished: false,
        });
    }

    render() {
        const { p: polyglot } = this.props;
        const { open, anchorEl, showClearPublished, showClearDataset } = this.state;
        return (
            <div style={styles.container}>
                <FlatButton
                    className="btn-danger-zone"
                    onTouchTap={this.handleTouchTap}
                    label={polyglot.t('settings')}
                    labelPosition="before"
                    icon={<SettingsIcon />}
                    style={styles.button}
                />
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    animation={PopoverAnimationVertical}
                    onRequestClose={this.handleRequestClose}
                >
                    <Menu>
                        <MenuItem
                            className="btn-clear-published"
                            primaryText={polyglot.t('clear_publish')}
                            onClick={this.handleClearPublished}
                        />
                        <MenuItem
                            className="btn-clear-dataset"
                            primaryText={polyglot.t('clear_dataset')}
                            onClick={this.handleClearDataset}
                        />
                    </Menu>
                </Popover>
                {showClearPublished && <ClearDialog type="published" onClose={this.handleClosePublished} /> }
                {showClearDataset && <ClearDialog type="dataset" onClose={this.handleCloseDataset} /> }
            </div>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = ({});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(DangerZoneComponent);
