import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import Checkbox from 'material-ui/Checkbox';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

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
};

class BarChartAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colors: PropTypes.string,
            axisRoundValue: PropTypes.bool,
            diagonalCategoryAxis: PropTypes.bool,
            diagonalValueAxis: PropTypes.bool,
            categoryMargin: PropTypes.number,
            valueMargin: PropTypes.number,
            scale: PropTypes.oneOf(['log', 'linear']),
            direction: PropTypes.oneOf(['horizontal', 'vertical']),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: {
            params: {
                maxSize: 5,
                orderBy: 'value/asc',
            },
            colors: '#1D1A31 #4D2D52 #9A4C95 #F08CAE #C1A5A9',
            axisRoundValue: true,
            diagonalCategoryAxis: false,
            diagonalValueAxis: false,
            direction: 'horizontal',
            scale: 'linear',
            categoryMargin: 120,
            valueMargin: 120,
        },
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

    setColors = (_, colors) => {
        const newArgs = { ...this.props.args, colors };
        this.props.onChange(newArgs);
    };

    setAxisRoundValue = () => {
        const { axisRoundValue, ...args } = this.props.args;
        const newArgs = { ...args, axisRoundValue: !axisRoundValue };
        this.props.onChange(newArgs);
    };

    setScale = (_, __, scale) => {
        const newArgs = { ...this.props.args, scale };
        this.props.onChange(newArgs);
    };

    setDirection = (_, __, direction) => {
        const newArgs = { ...this.props.args, direction };
        this.props.onChange(newArgs);
    };

    setCategoryMargin = (_, categoryMargin) => {
        const newArgs = { ...this.props.args, categoryMargin };
        this.props.onChange(newArgs);
    };

    setValueMargin = (_, valueMargin) => {
        const newArgs = { ...this.props.args, valueMargin };
        this.props.onChange(newArgs);
    };

    toggleDiagonalValueAxis = () => {
        const { diagonalValueAxis, ...args } = this.props.args;
        const newArgs = { ...args, diagonalValueAxis: !diagonalValueAxis };
        this.props.onChange(newArgs);
    };

    toggleDiagonalCategoryAxis = () => {
        const { diagonalCategoryAxis, ...args } = this.props.args;
        const newArgs = {
            ...args,
            diagonalCategoryAxis: !diagonalCategoryAxis,
        };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: {
                params: { maxSize, maxValue, minValue, orderBy },
                colors,
                axisRoundValue,
                diagonalValueAxis,
                diagonalCategoryAxis,
                scale,
                direction,
                categoryMargin,
                valueMargin,
            },
        } = this.props;
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
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={this.setColors}
                    style={styles.input2}
                    value={colors}
                />
                <SelectField
                    floatingLabelText={polyglot.t('direction')}
                    onChange={this.setDirection}
                    style={styles.input2}
                    value={direction}
                >
                    <MenuItem
                        value="horizontal"
                        primaryText={polyglot.t('horizontal')}
                    />
                    <MenuItem
                        value="vertical"
                        primaryText={polyglot.t('vertical')}
                    />
                </SelectField>
                <TextField
                    type="number"
                    floatingLabelText={polyglot.t('category_margin')}
                    onChange={this.setCategoryMargin}
                    style={styles.input}
                    value={categoryMargin}
                />
                <TextField
                    type="number"
                    floatingLabelText={polyglot.t('value_margin')}
                    onChange={this.setValueMargin}
                    style={styles.input}
                    value={valueMargin}
                />
                <Checkbox
                    label={polyglot.t('diagonal_category_axis')}
                    onCheck={this.toggleDiagonalCategoryAxis}
                    style={styles.input}
                    checked={diagonalCategoryAxis}
                />
                <Checkbox
                    label={polyglot.t('diagonal_value_axis')}
                    onCheck={this.toggleDiagonalValueAxis}
                    style={styles.input}
                    checked={diagonalValueAxis}
                />
                <Checkbox
                    label={polyglot.t('axis_round_value')}
                    onCheck={this.setAxisRoundValue}
                    style={styles.input}
                    checked={axisRoundValue}
                />
                <SelectField
                    floatingLabelText={polyglot.t('scale')}
                    onChange={this.setScale}
                    style={styles.input}
                    value={scale}
                >
                    <MenuItem
                        value="linear"
                        primaryText={polyglot.t('linear')}
                    />
                    <MenuItem value="log" primaryText={polyglot.t('log')} />
                </SelectField>
            </div>
        );
    }
}

export default translate(BarChartAdmin);
