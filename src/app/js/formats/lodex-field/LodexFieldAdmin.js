import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { TextField } from '@material-ui/core';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
    checkbox: {
        marginTop: 12,
        marginRight: 5,
        verticalAlign: 'sub',
    },
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

export const defaultArgs = {
    param: {
        labelArray: [''],
    },
};

class LodexFieldAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            param: PropTypes.shape({
                labelArray: PropTypes.arrayOf(PropTypes.string),
                hiddenInfo: PropTypes.object,
            }),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setRequest = (_, label) => {
        const labelArray = label.split(';');
        const { param, ...args } = this.props.args;
        const newArgs = { ...args, param: { ...param, labelArray } };
        this.props.onChange(newArgs);
    };

    setHiddenInfo = event => {
        let hiddenInfo = event.target.checked;
        const { param, ...state } = this.props.args;
        const newState = { ...state, param: { ...param, hiddenInfo } };
        this.props.onChange(newState);
    };

    render() {
        const {
            p: polyglot,
            args: { param },
        } = this.props;
        const { labelArray, hiddenInfo } = param || defaultArgs.param;
        const label = labelArray.join(';');

        return (
            <div style={styles.container}>
                <TextField
                    label={polyglot.t('param_labels')}
                    multiLine={true}
                    onChange={this.setRequest}
                    style={styles.input}
                    value={label}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={hiddenInfo}
                        onChange={this.setHiddenInfo}
                        style={styles.checkbox}
                    />
                    {polyglot.t('hidden_info')}
                </label>
            </div>
        );
    }
}

export default translate(LodexFieldAdmin);
