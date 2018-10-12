import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    nodeColor: 'red',
};

class CartographyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            nodeColor: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setMaxSize = (_, maxSize) => {
        const { params, ...args } = this.props.args;
        const newArgs = { ...args, params: { ...params, maxSize } };
        this.props.onChange(newArgs);
    };

    setMaxValue = (_, maxValue) => {
        const { params, ...args } = this.props.args;
        const newArgs = { ...args, params: { ...params, maxValue } };
        this.props.onChange(newArgs);
    };

    setMinValue = (_, minValue) => {
        const { params, ...args } = this.props.args;
        const newArgs = { ...args, params: { ...params, minValue } };
        this.props.onChange(newArgs);
    };

    setOrderBy = (_, __, orderBy) => {
        const { params, ...args } = this.props.args;
        const newArgs = { ...args, params: { ...params, orderBy } };
        this.props.onChange(newArgs);
    };

    setNodeColor = (_, nodeColor) => {
        const { ...state } = this.props.args;
        const newArgs = { ...state, nodeColor };
        this.props.onChange(newArgs);
    };

    render() {
        const { p: polyglot, args: { params } } = this.props;
        const { nodeColor } = this.props.args;
        const { maxSize, maxValue, minValue, orderBy } =
            params || defaultArgs.params;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('max_fields')}
                    onChange={this.setMaxSize}
                    style={styles.input}
                    value={maxSize}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_value')}
                    onChange={this.setMaxValue}
                    style={styles.input}
                    value={maxValue}
                />
                <TextField
                    floatingLabelText={polyglot.t('min_value')}
                    onChange={this.setMinValue}
                    style={styles.input}
                    value={minValue}
                />
                <SelectField
                    floatingLabelText={polyglot.t('order_by')}
                    onChange={this.setOrderBy}
                    style={styles.input}
                    value={orderBy}
                >
                    <MenuItem
                        value="_id/asc"
                        primaryText={polyglot.t('label_asc')}
                    />
                    <MenuItem
                        value="_id/desc"
                        primaryText={polyglot.t('label_desc')}
                    />
                    <MenuItem
                        value="value/asc"
                        primaryText={polyglot.t('value_asc')}
                    />
                    <MenuItem
                        value="value/desc"
                        primaryText={polyglot.t('value_desc')}
                    />
                </SelectField>
                <TextField
                    floatingLabelText={
                        <span>
                            {polyglot.t('node_color')}
                            <span
                                style={styles.previewDefaultColor(nodeColor)}
                            />
                        </span>
                    }
                    onChange={this.setNodeColor}
                    style={styles.input}
                    underlineStyle={{ borderColor: nodeColor }}
                    underlineFocusStyle={{ borderColor: nodeColor }}
                    value={nodeColor}
                />
            </div>
        );
    }
}

export default translate(CartographyAdmin);
