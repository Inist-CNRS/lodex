import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, MenuItem } from '@material-ui/core';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';

import { polyglot as polyglotPropTypes } from '../../propTypes';

import ClearDialog from './ClearDialog';
import { fromPublication, fromParsing } from '../selectors';

const styles = {
    button: {
        color: 'white',
    },
};

class SettingsComponent extends Component {
    static propTypes = {
        p: polyglotPropTypes.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
        hasLoadedDataset: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            showClearDataset: false,
            showClearPublished: false,
        };
    }

    handleTouchTap = event => {
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

    handleClearDataset = () => {
        this.setState({
            open: false,
            showClearDataset: true,
        });
    };

    handleClearPublished = () => {
        this.setState({
            open: false,
            showClearPublished: true,
        });
    };

    handleCloseDataset = () => {
        this.setState({
            showClearDataset: false,
        });
    };

    handleClosePublished = () => {
        this.setState({
            showClearPublished: false,
        });
    };

    render() {
        const {
            p: polyglot,
            hasLoadedDataset,
            hasPublishedDataset,
        } = this.props;

        const {
            open,
            anchorEl,
            showClearPublished,
            showClearDataset,
        } = this.state;

        return (
            <>
                {(hasPublishedDataset || hasLoadedDataset) && (
                    <Button
                        variant="text"
                        className="btn-danger-zone"
                        onClick={this.handleTouchTap}
                        endIcon={<ArrowDown />}
                        style={styles.button}
                    >
                        {polyglot.t('clear')}
                    </Button>
                )}
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={this.handleRequestClose}
                    onBackdropClick={this.handleRequestClose}
                >
                    <MenuItem
                        className="btn-clear-published"
                        onClick={this.handleClearPublished}
                        disabled={!hasPublishedDataset}
                    >
                        {polyglot.t('clear_publish')}
                    </MenuItem>
                    <MenuItem
                        className="btn-clear-dataset"
                        onClick={this.handleClearDataset}
                        disabled={!hasLoadedDataset}
                    >
                        {polyglot.t('clear_dataset')}
                    </MenuItem>
                </Menu>
                {showClearPublished && (
                    <ClearDialog
                        type="published"
                        onClose={this.handleClosePublished}
                    />
                )}
                {showClearDataset && (
                    <ClearDialog
                        type="dataset"
                        onClose={this.handleCloseDataset}
                    />
                )}
            </>
        );
    }
}

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
});

export default compose(translate, connect(mapStateToProps))(SettingsComponent);
