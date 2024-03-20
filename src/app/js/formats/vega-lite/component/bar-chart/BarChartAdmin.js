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
} from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../utils/colorUtils';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import BarChart from '../../models/BarChart';
import {
    AXIS_X,
    AXIS_Y,
    lodexDirectionToIdDirection,
    lodexScaleToIdScale,
} from '../../../utils/chartsUtils';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import { BarChartAdminView } from './BarChartView';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import VegaFieldPreview from '../../../utils/components/admin/VegaFieldPreview';
import { StandardIdValue } from '../../../utils/dataSet';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import { ASPECT_RATIO_16_6 } from '../../../utils/aspectRatio';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
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
    aspectRatio: ASPECT_RATIO_16_6,
};

const BarChartAdmin = (props) => {
    const {
        p: polyglot,
        args,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;

    const {
        advancedMode,
        advancedModeSpec,
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
        aspectRatio,
    } = args;

    const colors = useMemo(() => {
        return args.colors || defaultArgs.colors;
    }, [args.colors]);

    const spec = useMemo(() => {
        if (!advancedMode) {
            return null;
        }

        if (advancedModeSpec !== null) {
            return advancedModeSpec;
        }

        const specBuilder = new BarChart();
        specBuilder.setAxisDirection(lodexDirectionToIdDirection(direction));
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
        specBuilder.setEditMode(true);
        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [advancedMode, advancedModeSpec]);

    // Save the new spec when we first use the advanced mode or when we reset the generated spec
    // details: Update advancedModeSpec props arguments when spec is generated or regenerated
    useEffect(() => {
        if (!advancedMode) {
            return;
        }
        updateAdminArgs('advancedModeSpec', spec, props);
    }, [advancedMode, advancedModeSpec]);

    const toggleAdvancedMode = () => {
        updateAdminArgs('advancedMode', !advancedMode, props);
    };

    const handleAdvancedModeSpec = (newSpec) => {
        updateAdminArgs('advancedModeSpec', newSpec, props);
    };

    const clearAdvancedModeSpec = () => {
        updateAdminArgs('advancedModeSpec', null, props);
    };

    const handleParams = (params) => {
        updateAdminArgs('params', params, props);
    };

    const handleColors = (colors) => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    const handleAxisRoundValue = () => {
        updateAdminArgs('axisRoundValue', !axisRoundValue, props);
    };

    const handleScale = (event) => {
        updateAdminArgs('scale', event.target.value, props);
    };

    const handleDirection = (event) => {
        updateAdminArgs('direction', event.target.value, props);
    };

    const toggleDiagonalValueAxis = () => {
        updateAdminArgs('diagonalValueAxis', !diagonalValueAxis, props);
    };

    const toggleDiagonalCategoryAxis = () => {
        updateAdminArgs('diagonalCategoryAxis', !diagonalCategoryAxis, props);
    };

    const handleBarSize = (event) => {
        updateAdminArgs('barSize', parseInt(event.target.value, 10), props);
    };

    const toggleTooltip = () => {
        updateAdminArgs('tooltip', !args.tooltip, props);
    };

    const toggleLabels = () => {
        updateAdminArgs('labels', !args.labels, props);
    };

    const toggleLabelOverlap = () => {
        updateAdminArgs('labelOverlap', !args.labelOverlap, props);
    };

    const handleTooltipCategory = (category) => {
        updateAdminArgs('tooltipCategory', category, props);
    };

    const handleTooltipValue = (value) => {
        updateAdminArgs('tooltipValue', value, props);
    };

    const handleAspectRatio = (value) => {
        updateAdminArgs('aspectRatio', value, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    polyglot={polyglot}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={advancedMode}
                                onChange={toggleAdvancedMode}
                            />
                        }
                        label={polyglot.t('advancedMode')}
                    />
                </FormGroup>
                {advancedMode ? (
                    <VegaAdvancedMode
                        value={spec}
                        onClear={clearAdvancedModeSpec}
                        onChange={handleAdvancedModeSpec}
                    />
                ) : (
                    <>
                        <VegaToolTips
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
                            type="number"
                            fullWidth
                            label={polyglot.t('bar_size')}
                            onChange={handleBarSize}
                            value={barSize}
                        />
                    </>
                )}
                <AspectRatioSelector
                    value={aspectRatio}
                    onChange={handleAspectRatio}
                />
            </FormatChartParamsFieldSet>
            <VegaFieldPreview
                args={args}
                PreviewComponent={BarChartAdminView}
                datasets={[StandardIdValue]}
                showDatasetsSelector={false}
            />
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
        advancedMode: PropTypes.bool,
        advancedModeSpec: PropTypes.string,
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
        aspectRatio: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

export default translate(BarChartAdmin);
