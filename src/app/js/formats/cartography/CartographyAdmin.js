import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { schemeBlues, schemeOrRd } from 'd3-scale-chromatic';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { GradientSchemeSelector } from '../../lib/components/ColorSchemeSelector';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        marginLeft: '1rem',
        width: '40%',
    },
    input2: {
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
    colorScheme: schemeOrRd[9],
    hoverColorScheme: schemeBlues[9],
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
            colorScheme: PropTypes.arrayOf(PropTypes.string),
            hoverColorScheme: PropTypes.arrayOf(PropTypes.string),
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

    setColorScheme = (_, __, colorScheme) => {
        const newState = {
            ...this.props.args,
            colorScheme: colorScheme.split(','),
        };
        this.props.onChange(newState);
    };

    setHoverColorScheme = (_, __, hoverColorScheme) => {
        const newState = {
            ...this.props.args,
            hoverColorScheme: hoverColorScheme.split(','),
        };
        this.props.onChange(newState);
    };

    render() {
        const { p: polyglot, args: { params } } = this.props;
        const { colorScheme, hoverColorScheme } = this.props.args;
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
                <GradientSchemeSelector
                    label={polyglot.t('color_scheme')}
                    onChange={this.setColorScheme}
                    style={styles.input}
                    value={colorScheme}
                />
                <GradientSchemeSelector
                    label={polyglot.t('hover_color_scheme')}
                    onChange={this.setHoverColorScheme}
                    style={styles.input}
                    value={hoverColorScheme}
                />
            </div>
        );
    }
}

export default translate(CartographyAdmin);
