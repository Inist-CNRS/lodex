import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Box,
} from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import ToolTips from '../../../shared/ToolTips';

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
    labelOverlap: false,
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
            labelOverlap: PropTypes.bool,
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
        showMaxSize: true,
        showMaxValue: true,
        showMinValue: true,
        showOrderBy: true,
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

    setScale = e => {
        updateAdminArgs('scale', e.target.value, this.props);
    };

    setDirection = e => {
        updateAdminArgs('direction', e.target.value, this.props);
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

    setBarSize = e => {
        updateAdminArgs('barSize', e.target.value, this.props);
    };

    toggleTooltip = () => {
        updateAdminArgs('tooltip', !this.props.args.tooltip, this.props);
    };

    toggleLabels = () => {
        updateAdminArgs('labels', !this.props.args.labels, this.props);
    };

    toggleLabelOverlap = () => {
        updateAdminArgs(
            'labelOverlap',
            !this.props.args.labelOverlap,
            this.props,
        );
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
                labelOverlap,
            },
            showMaxSize,
            showMaxValue,
            showMinValue,
            showOrderBy,
        } = this.props;

        return (
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
            >
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
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('direction')}
                    onChange={this.setDirection}
                    value={direction}
                >
                    <MenuItem value="horizontal">
                        {polyglot.t('horizontal')}
                    </MenuItem>
                    <MenuItem value="vertical">
                        {polyglot.t('vertical')}
                    </MenuItem>
                </TextField>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.toggleDiagonalCategoryAxis}
                            checked={diagonalCategoryAxis}
                        />
                    }
                    label={polyglot.t('diagonal_category_axis')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.toggleDiagonalValueAxis}
                            checked={diagonalValueAxis}
                        />
                    }
                    label={polyglot.t('diagonal_value_axis')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.setAxisRoundValue}
                            checked={axisRoundValue}
                        />
                    }
                    label={polyglot.t('axis_round_value')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.toggleLabels}
                            checked={labels}
                        />
                    }
                    label={polyglot.t('toggle_labels')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.toggleLabelOverlap}
                            checked={labelOverlap}
                        />
                    }
                    label={polyglot.t('toggle_label_overlap')}
                />
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('scale')}
                    onChange={this.setScale}
                    value={scale}
                >
                    <MenuItem value="linear">{polyglot.t('linear')}</MenuItem>
                    <MenuItem value="log">{polyglot.t('log')}</MenuItem>
                </TextField>
                <TextField
                    label={polyglot.t('bar_size')}
                    onChange={this.setBarSize}
                    value={barSize}
                />
            </Box>
        );
    }
}

export default translate(BarChartAdmin);
