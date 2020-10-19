import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import {
    Dialog,
    Button,
    TextField,
    DialogContent,
    DialogActions,
    DialogTitle,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

import {
    clearDataset as clearDatasetAction,
    clearPublished as clearPublishedAction,
} from '../clear';

import { fromClear } from '../selectors';
import { getHost } from '../../../../common/uris';

const baseUrl = getHost();

class ClearDialogComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validName: false,
            error: null,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.succeeded) {
            window.location.reload();
        }
    }

    getInstanceName = () => /\/\/([a-z0-9-]+)./.exec(baseUrl)[1];

    handleChangeField = e => {
        const instanceName = this.getInstanceName();
        this.setState({
            validName: instanceName === e.target.value,
        });
    };

    handleClear = type =>
        (type === 'dataset' && this.handleClearDataset) ||
        (type === 'published' && this.handleClearPublished);

    handleClearDataset = () => {
        this.props.clearDataset();
    };

    handleClearPublished = () => {
        this.props.clearPublished();
    };

    handleKeyPress = (e, type) => {
        if (e.key !== 'Enter' || !this.state.validName) {
            return null;
        }

        if (type === 'dataset') {
            return this.handleClearDataset();
        } else if (type === 'published') {
            return this.handleClearPublished();
        }

        return null;
    };

    render() {
        const {
            type,
            p: polyglot,
            onClose,
            isClearing,
            hasFailed,
        } = this.props;

        const { validName } = this.state;

        const actions = [
            <ButtonWithStatus
                raised
                key="submit"
                className="btn-save"
                onClick={this.handleClear(type)}
                color="primary"
                error={hasFailed}
                disabled={!validName}
                loading={isClearing}
            >
                {polyglot.t('confirm')}
            </ButtonWithStatus>,
            <Button
                key="cancel"
                color="secondary"
                variant="text"
                className="btn-cancel"
                onClick={onClose}
            >
                {polyglot.t('cancel')}
            </Button>,
        ];
        return (
            <Dialog open>
                <DialogTitle>
                    {polyglot.t(
                        type === 'dataset' ? 'clear_dataset' : 'clear_publish',
                    )}
                </DialogTitle>
                <DialogContent>
                    <b>{polyglot.t('listen_up')}</b>
                    <br />
                    <br />
                    <div>
                        {polyglot.t('enter_name')} :
                        <b> {this.getInstanceName()}</b>
                        <TextField
                            name="field-name-instance"
                            placeholder={polyglot.t('instance_name')}
                            fullWidth
                            onChange={this.handleChangeField}
                            onKeyPress={e => this.handleKeyPress(e, type)}
                            error={hasFailed && polyglot.t('error')}
                        />
                    </div>
                </DialogContent>
                <DialogActions>{actions}</DialogActions>
            </Dialog>
        );
    }
}

ClearDialogComponent.propTypes = {
    type: PropTypes.string.isRequired,
    succeeded: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    onClose: PropTypes.func.isRequired,
    clearDataset: PropTypes.func.isRequired,
    clearPublished: PropTypes.func.isRequired,
    reloadParsing: PropTypes.func.isRequired,
    isClearing: PropTypes.bool.isRequired,
    hasFailed: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    succeeded: fromClear.hasClearSucceeded(state),
    hasFailed: fromClear.hasClearFailed(state),
    isClearing: fromClear.getIsClearing(state),
});

const mapDispatchToProps = {
    clearDataset: clearDatasetAction,
    clearPublished: clearPublishedAction,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ClearDialogComponent);
