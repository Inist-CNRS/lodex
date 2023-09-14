import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Box,
    Switch,
    FormGroup,
    Button,
} from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import ToolTips from '../../../shared/ToolTips';
import BarChart from '../../models/BarChart';
import {
    AXIS_X,
    AXIS_Y,
    lodexDirectionToIdDirection,
    lodexOrderToIdOrder,
    lodexScaleToIdScale,
} from '../../../chartsUtils';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    advanceMode: false,
    advanceModeSpec: null,
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

const BarChartAdmin = props => {
    const {
        p: polyglot,
        args,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;
    const {
        advanceMode,
        advanceModeSpec,
        params,
        tooltip,
        tooltipCategory,
        tooltipValue,
        labels,
        barSize,
        diagonalCategoryAxis,
        diagonalValueAxis,
        scale,
        direction,
        axisRoundValue,
        labelOverlap,
    } = args;

    const colors = useMemo(() => {
        return args.colors || defaultArgs.colors;
    }, [args.colors]);

    const spec = useMemo(() => {
        if (!advanceMode) {
            return null;
        }

        if (advanceModeSpec !== null) {
            return advanceModeSpec;
        }

        const specBuilder = new BarChart();
        specBuilder.setAxisDirection(lodexDirectionToIdDirection(direction));
        specBuilder.setOrderBy(lodexOrderToIdOrder(params.orderBy));
        specBuilder.setScale(lodexScaleToIdScale(scale));
        specBuilder.setColor(colors);
        specBuilder.setRoundValue(axisRoundValue);
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setLabels(labels);
        specBuilder.setLabelOverlap(labelOverlap);
        specBuilder.setSize(barSize);
        if (diagonalCategoryAxis) {
            specBuilder.setLabelAngle(AXIS_X, -45);
        }
        if (diagonalValueAxis) {
            specBuilder.setLabelAngle(AXIS_Y, -45);
        }

        return JSON.stringify(specBuilder.buildSpec(null, null, true), null, 2);
    }, [advanceMode, advanceModeSpec]);

    useEffect(() => {
        if (!advanceMode) {
            return;
        }
        updateAdminArgs('advanceModeSpec', spec, props);
    }, [advanceMode, advanceModeSpec]);

    const toggleAdvanceMode = () => {
        updateAdminArgs('advanceMode', !args.advanceMode, props);
    };

    const handleAdvanceModeSpec = event => {
        updateAdminArgs('advanceModeSpec', event.target.value, props);
    };

    const clearAdvanceModeSpec = () => {
        updateAdminArgs('advanceModeSpec', null, props);
    };

    const handleParams = params => {
        updateAdminArgs('params', params, props);
    };

    const handleColors = colors => {
        updateAdminArgs('colors', colors || defaultArgs.colors, this.props);
    };

    const handleAxisRoundValue = () => {
        updateAdminArgs('axisRoundValue', !args.axisRoundValue, props);
    };

    const handleScale = event => {
        updateAdminArgs('scale', event.target.value, props);
    };

    const handleDirection = event => {
        updateAdminArgs('direction', event.target.value, props);
    };

    const toggleDiagonalValueAxis = () => {
        updateAdminArgs('diagonalValueAxis', !args.diagonalValueAxis, props);
    };

    const toggleDiagonalCategoryAxis = () => {
        updateAdminArgs(
            'diagonalCategoryAxis',
            !args.diagonalCategoryAxis,
            props,
        );
    };

    const handleBarSize = event => {
        updateAdminArgs('barSize', event.target, props);
    };

    const toggleTooltip = () => {
        updateAdminArgs('tooltip', args.tooltip, props);
    };

    const toggleLabels = () => {
        updateAdminArgs('labels', args.labels, props);
    };

    const toggleLabelOverlap = () => {
        updateAdminArgs('labelOverlap', !args.labelOverlap, props);
    };

    const handleTooltipCategory = category => {
        updateAdminArgs('tooltipCategory', category, props);
    };

    const handleTooltipValue = value => {
        updateAdminArgs('tooltipValue', value, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={advanceMode}
                            onChange={toggleAdvanceMode}
                        />
                    }
                    label={polyglot.t('advancedMode')}
                />
            </FormGroup>
            <RoutineParamsAdmin
                params={params || defaultArgs.params}
                onChange={handleParams}
                polyglot={polyglot}
                showMaxSize={showMaxSize}
                showMaxValue={showMaxValue}
                showMinValue={showMinValue}
                showOrderBy={showOrderBy}
            />
            {!advanceMode ? (
                <>
                    <ToolTips
                        checked={tooltip}
                        onChange={toggleTooltip}
                        onCategoryTitleChange={handleTooltipCategory}
                        categoryTitle={tooltipCategory}
                        onValueTitleChange={handleTooltipValue}
                        valueTitle={tooltipValue}
                        polyglot={polyglot}
                        thirdValue={false}
                    />
                    <ColorPickerParamsAdmin
                        colors={colors}
                        onChange={handleColors}
                        polyglot={polyglot}
                    />
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('direction')}
                        onChange={handleDirection}
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
                                onChange={toggleDiagonalCategoryAxis}
                                checked={diagonalCategoryAxis}
                            />
                        }
                        label={polyglot.t('diagonal_category_axis')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={toggleDiagonalValueAxis}
                                checked={diagonalValueAxis}
                            />
                        }
                        label={polyglot.t('diagonal_value_axis')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={handleAxisRoundValue}
                                checked={axisRoundValue}
                            />
                        }
                        label={polyglot.t('axis_round_value')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={toggleLabels}
                                checked={labels}
                            />
                        }
                        label={polyglot.t('toggle_labels')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={toggleLabelOverlap}
                                checked={labelOverlap}
                            />
                        }
                        label={polyglot.t('toggle_label_overlap')}
                    />
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('scale')}
                        onChange={handleScale}
                        value={scale}
                    >
                        <MenuItem value="linear">
                            {polyglot.t('linear')}
                        </MenuItem>
                        <MenuItem value="log">{polyglot.t('log')}</MenuItem>
                    </TextField>
                    <TextField
                        label={polyglot.t('bar_size')}
                        onChange={handleBarSize}
                        value={barSize}
                    />
                </>
            ) : (
                <>
                    <Button onClick={clearAdvanceModeSpec} color="primary">
                        {polyglot.t('regenerate_spec')}
                    </Button>
                    <TextField
                        onChange={handleAdvanceModeSpec}
                        value={spec}
                        fullWidth
                        multiline
                    />
                </>
            )}
        </Box>
    );
};

BarChartAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

BarChartAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        advanceMode: PropTypes.bool,
        advanceModeSpec: PropTypes.string,
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

export default translate(BarChartAdmin);
