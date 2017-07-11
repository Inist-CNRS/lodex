import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { red600 } from 'material-ui/styles/colors';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { clearDataset as clearDatasetAction } from '../clear';

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
        };
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

    render() {
        const { type, p: polyglot, onClose } = this.props;
        const { validName } = this.state;

        const actions = [
            <FlatButton
                className="btn-cancel"
                label={polyglot.t('cancel')}
                onTouchTap={onClose}
                primary
            />,
            <RaisedButton
                className="btn-submit"
                label={polyglot.t('valid')}
                color={`${red600}`}
                secondary
                disabled={!validName}
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
};

const mapStateToProps = state => ({});

const mapDispatchToProps = ({
    clearDataset: clearDatasetAction,
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ClearDialogComponent);
