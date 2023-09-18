import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    MenuItem,
    Checkbox,
    FormControlLabel,
    Box,
    TextField,
    Switch,
    FormGroup,
} from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import ToolTips from '../../../shared/ToolTips';
import VegaAdvancedMode from '../../../shared/VegaAdvancedMode';
import RadarChart from '../../models/RadarChart';
import { lodexScaleToIdScale } from '../../../chartsUtils';

export const defaultArgs = {
    params: {
        maxSize: 5,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    axisRoundValue: true,
    scale: 'linear',
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
};

const RadarChartAdmin = props => {
    const {
        p: polyglot,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
        args,
    } = props;

    const {
        advancedMode,
        advancedModeSpec,
        params,
        axisRoundValue,
        scale,
        tooltip,
        tooltipValue,
        tooltipCategory,
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

        const specBuilder = new RadarChart();

        specBuilder.setColors(colors.split(' '));
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setScale(lodexScaleToIdScale(scale));

        specBuilder.setEditMode(true);
        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [advancedMode, advancedModeSpec]);

    useEffect(() => {
        if (!advancedMode) {
            return;
        }
        updateAdminArgs('advancedModeSpec', spec, props);
    }, [advancedMode, advancedModeSpec]);

    const toggleAdvancedMode = () => {
        updateAdminArgs('advancedMode', !args.advancedMode, props);
    };

    const handleAdvancedModeSpec = newSpec => {
        updateAdminArgs('advancedModeSpec', newSpec, props);
    };

    const clearAdvancedModeSpec = () => {
        updateAdminArgs('advancedModeSpec', null, props);
    };

    const handleParams = params => {
        updateAdminArgs('params', params, props);
    };

    const handleAxisRoundValue = () => {
        updateAdminArgs('axisRoundValue', !axisRoundValue, props);
    };

    const handleScale = e => {
        updateAdminArgs('scale', e.target.value, props);
    };

    const handleColors = colors => {
        updateAdminArgs(
            'colors',
            colors.split(' ')[0] || defaultArgs.colors,
            props,
        );
    };

    const toggleTooltip = () => {
        updateAdminArgs('tooltip', !tooltip, props);
    };

    const handleTooltipCategory = tooltipCategory => {
        updateAdminArgs('tooltipCategory', tooltipCategory, props);
    };

    const handleTooltipValue = tooltipValue => {
        updateAdminArgs('tooltipValue', tooltipValue, props);
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
                            checked={advancedMode}
                            onChange={toggleAdvancedMode}
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
            {advancedMode ? (
                <VegaAdvancedMode
                    value={spec}
                    onClear={clearAdvancedModeSpec}
                    onChange={handleAdvancedModeSpec}
                />
            ) : (
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
                        monochromatic={true}
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
                </>
            )}
        </Box>
    );
};

RadarChartAdmin.propTypes = {
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
        scale: PropTypes.oneOf(['log', 'linear']),
        tooltip: PropTypes.bool,
        tooltipCategory: PropTypes.string,
        tooltipValue: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

RadarChartAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(RadarChartAdmin);
