import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { red600 } from 'material-ui/styles/colors';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

import { clearDataset as clearDatasetAction,
         clearPublished as clearPublishedAction } from '../clear';

import { reloadParsingResult } from '../parsing';
import { fromClear } from '../selectors';

const styles = {
    dialog: {
        padding: 0,
    },
};

class ClearDialogComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            validName: false,
            error: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.succeeded) { // eslint-disable-line
            this.props.onClose();
            this.props.reloadParsing();
        }
    }

    handleChangeField = (_, value) => {
        const instanceName = /\/\/([a-z0-9-]+)./.exec(window.location.href)[1];

        if (instanceName !== value) {
            return this.setState({
                validName: false,
            });
        }

        return this.setState({
            validName: true,
        });
    }

    handleClearDataset = () => {
        this.props.clearDataset();
    }

    handleClearPublished = () => {
        this.props.clearPublished();
    }

    render() {
        const { type, p: polyglot, onClose, isClearing, hasFailed } = this.props;
        const { validName } = this.state;

        const actions = [
            <FlatButton
                className="btn-cancel"
                label={polyglot.t('cancel')}
                onTouchTap={onClose}
                primary
            />,
            <ButtonWithStatus
                raised
                className="btn-submit"
                label={polyglot.t('valid')}
                color={`${red600}`}
                onTouchTap={(type === 'dataset' && this.handleClearDataset)
                         || (type === 'published' && this.handleClearPublished)}
                secondary
                error={hasFailed}
                disabled={!validName}
                loading={isClearing}
            />,
        ];
        return (
            <Dialog
                open
                title={type}
                actions={actions}
                contentStyle={styles.dialog}
            >
                {polyglot.t('listen_up')}
                <br />
                <div>
                    {polyglot.t('enter_name')}
                    <TextField
                        name="field-name-instance"
                        hintText={polyglot.t('instance_name')}
                        fullWidth
                        onChange={this.handleChangeField}
                        errorText={hasFailed && 'Erreur dans la suppression'}
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

const mapDispatchToProps = ({
    clearDataset: clearDatasetAction,
    clearPublished: clearPublishedAction,
    reloadParsing: reloadParsingResult,
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ClearDialogComponent);
