import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import Dialog from '@material-ui/core/Dialog';
import FlatButton from '@material-ui/core/FlatButton';
import TextField from '@material-ui/core/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

import {
    clearDataset as clearDatasetAction,
    clearPublished as clearPublishedAction,
} from '../clear';

import { fromClear } from '../selectors';
import { getHost } from '../../../../common/uris';

const styles = {
    dialog: {
        padding: 0,
    },
};

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
            // eslint-disable-line
            window.location.reload();
        }
    }

    getInstanceName = () => /\/\/([a-z0-9-]+)./.exec(baseUrl)[1];

    handleChangeField = (_, value) => {
        const instanceName = this.getInstanceName();

        if (instanceName !== value) {
            return this.setState({
                validName: false,
            });
        }

        return this.setState({
            validName: true,
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
                label={polyglot.t('confirm')}
                onClick={this.handleClear(type)}
                primary
                error={hasFailed}
                disabled={!validName}
                loading={isClearing}
            />,
            <FlatButton
                key="cancel"
                secondary
                className="btn-cancel"
                label={polyglot.t('cancel')}
                onClick={onClose}
            />,
        ];
        return (
            <Dialog
                open
                title={polyglot.t(
                    type === 'dataset' ? 'clear_dataset' : 'clear_publish',
                )}
                actions={actions}
                contentStyle={styles.dialog}
            >
                <b>{polyglot.t('listen_up')}</b>
                <br />
                <br />
                <div>
                    {polyglot.t('enter_name')} :<b> {this.getInstanceName()}</b>
                    <TextField
                        name="field-name-instance"
                        hintText={polyglot.t('instance_name')}
                        fullWidth
                        onChange={this.handleChangeField}
                        onKeyPress={e => this.handleKeyPress(e, type)}
                        errorText={hasFailed && polyglot.t('error')}
                    />
                </div>
            </Dialog>
        );
    }
}

ClearDialogComponent.propTypes = {
    type: PropTypes.string.isRequired,
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
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
)(ClearDialogComponent);
