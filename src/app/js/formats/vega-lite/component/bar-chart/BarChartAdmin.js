import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Select, MenuItem, Checkbox } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import ToolTips from '../../../shared/ToolTips';

// set frond-end styles
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
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
    axisRoundValue: true,
    diagonalCategoryAxis: false,
    diagonalValueAxis: false,
    direction: 'horizontal',
    scale: 'linear',
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    labels: false,
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
            scale: PropTypes.oneOf(['log', 'linear']),
            direction: PropTypes.oneOf(['horizontal', 'vertical']),
            barSize: PropTypes.number,
            tooltip: PropTypes.bool,
            tooltipCategory: PropTypes.string,
            tooltipValue: PropTypes.string,
            labels: PropTypes.bool,
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
        this.setTooltipValue = this.setTooltipValue.bind(this);
        this.setTooltipCategory = this.setTooltipCategory.bind(this);
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

    toggleTooltip = () => {
        updateAdminArgs('tooltip', !this.props.args.tooltip, this.props);
    };

    toggleLabels = () => {
        updateAdminArgs('labels', !this.props.args.labels, this.props);
    };

    setTooltipCategory(tooltipCategory) {
        updateAdminArgs('tooltipCategory', tooltipCategory, this.props);
    }

    setTooltipValue(tooltipValue) {
        updateAdminArgs('tooltipValue', tooltipValue, this.props);
    }

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
                barSize,
                tooltip,
                tooltipCategory,
                tooltipValue,
                labels,
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
                <ToolTips
                    checked={tooltip}
                    onChange={this.toggleTooltip}
                    onCategoryTitleChange={this.setTooltipCategory}
                    categoryTitle={tooltipCategory}
                    onValueTitleChange={this.setTooltipValue}
                    valueTitle={tooltipValue}
                    polyglot={polyglot}
                    thirdValue={false}
                />
                <ColorPickerParamsAdmin
                    colors={this.state.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                />
                <Select
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
                </Select>
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
                <Checkbox
                    label={polyglot.t('toggle_labels')}
                    onCheck={this.toggleLabels}
                    style={styles.input}
                    checked={labels}
                />
                <Select
                    floatingLabelText={polyglot.t('scale')}
                    onChange={this.setScale}
                    style={styles.input}
                    value={scale}
                >
                    <MenuItem value="linear">{polyglot.t('linear')}</MenuItem>
                    <MenuItem value="log">{polyglot.t('log')}</MenuItem>
                </Select>
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
