import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, SelectField, MenuItem, Checkbox } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../shared/ColorPickerParamsAdmin';

import * as colorUtils from '../../colorUtils';

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
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colors: colorUtils.MULTICHROMATIC_DEFAULT_COLORSET,
    axisRoundValue: true,
    diagonalCategoryAxis: false,
    diagonalValueAxis: false,
    direction: 'horizontal',
    scale: 'linear',
    categoryMargin: 120,
    valueMargin: 120,
    barSize: 20,
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
            barSize: PropTypes.number,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
        showMaxSize: PropTypes.bool.isRequired,
        showMaxValue: PropTypes.bool.isRequired,
        showMinValue: PropTypes.bool.isRequired,
        showOrderBy: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    constructor(props) {
        super(props);
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    setParams = params => updateAdminArgs('params', params, this.props);

    setColors(colors) {
        updateAdminArgs('colors', colors || defaultArgs.colors, this.props);
    }

    setAxisRoundValue = () => {
        updateAdminArgs(
            'axisRoundValue',
            !this.props.args.axisRoundValue,
            this.props,
        );
    };

    setScale = (_, __, scale) => {
        updateAdminArgs('scale', scale, this.props);
    };

    setDirection = (_, __, direction) => {
        updateAdminArgs('direction', direction, this.props);
    };

    setCategoryMargin = (_, categoryMargin) => {
        updateAdminArgs('categoryMargin', categoryMargin, this.props);
    };

    setValueMargin = (_, valueMargin) => {
        updateAdminArgs('valueMargin', valueMargin, this.props);
    };

    toggleDiagonalValueAxis = () => {
        updateAdminArgs(
            'diagonalValueAxis',
            !this.props.args.diagonalValueAxis,
            this.props,
        );
    };

    toggleDiagonalCategoryAxis = () => {
        updateAdminArgs(
            'diagonalCategoryAxis',
            !this.props.args.diagonalCategoryAxis,
            this.props,
        );
    };

    setBarSize = (_, barSize) => {
        updateAdminArgs('barSize', barSize, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: {
                params,
                axisRoundValue,
                diagonalValueAxis,
                diagonalCategoryAxis,
                scale,
                direction,
                categoryMargin,
                valueMargin,
                barSize,
            },
            showMaxSize = true,
            showMaxValue = true,
            showMinValue = true,
            showOrderBy = true,
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
                <ColorPickerParamsAdmin
                    colors={this.state.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                />
                <SelectField
                    floatingLabelText={polyglot.t('direction')}
                    onChange={this.setDirection}
                    style={styles.input}
                    value={direction}
                >
                    <MenuItem value="horizontal">
                        {polyglot.t('horizontal')}
                    </MenuItem>
                    <MenuItem value="vertical">
                        {polyglot.t('vertical')}
                    </MenuItem>
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
                    <MenuItem value="linear">{polyglot.t('linear')}</MenuItem>
                    <MenuItem value="log">{polyglot.t('log')}</MenuItem>
                </SelectField>
                <TextField
                    floatingLabelText={polyglot.t('bar_size')}
                    onChange={this.setBarSize}
                    style={styles.input}
                    value={barSize}
                />
            </div>
        );
    }
}

export default translate(BarChartAdmin);
