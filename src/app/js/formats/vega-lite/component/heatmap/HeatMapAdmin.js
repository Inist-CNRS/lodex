import React from 'react';
import translate from 'redux-polyglot/translate';
import { schemeOrRd } from 'd3-scale-chromatic';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Box } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import { GradientSchemeSelector } from '../../../../lib/components/ColorSchemeSelector';
import ToolTips from '../../../shared/ToolTips';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    colorScheme: schemeOrRd[9],
    flipAxis: false,
    tooltip: false,
    tooltipSource: 'Source',
    tooltipTarget: 'Target',
    tooltipWeight: 'Weight',
};

const HeatMapAdmin = props => {
    const {
        p: polyglot,
        args,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;

    const {
        params,
        colorScheme,
        flipAxis,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
    } = args;

    const handleParams = params => {
        updateAdminArgs('params', params, props);
    };

    const handleColorSchemeChange = (_, colorScheme) => {
        updateAdminArgs(
            'colorScheme',
            colorScheme.props.value.split(','),
            props,
        );
    };

    const toggleFlipAxis = () => {
        updateAdminArgs('flipAxis', !flipAxis, props);
    };

    const toggleTooltip = () => {
        updateAdminArgs('tooltip', !tooltip, props);
    };

    const handleTooltipSource = tooltipSource => {
        updateAdminArgs('tooltipSource', tooltipSource, props);
    };

    const handleTooltipTarget = tooltipTarget => {
        updateAdminArgs('tooltipTarget', tooltipTarget, props);
    };

    const handleTooltipWeight = tooltipWeight => {
        updateAdminArgs('tooltipWeight', tooltipWeight, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <RoutineParamsAdmin
                params={params || defaultArgs.params}
                polyglot={polyglot}
                onChange={handleParams}
                showMaxSize={showMaxSize}
                showMaxValue={showMaxValue}
                showMinValue={showMinValue}
                showOrderBy={showOrderBy}
            />
            <ToolTips
                checked={tooltip}
                onChange={toggleTooltip}
                onCategoryTitleChange={handleTooltipSource}
                categoryTitle={tooltipSource}
                onValueTitleChange={handleTooltipTarget}
                valueTitle={tooltipTarget}
                polyglot={polyglot}
                thirdValue={true}
                onThirdValueChange={handleTooltipWeight}
                thirdValueTitle={tooltipWeight}
            />
            <GradientSchemeSelector
                label={polyglot.t('color_scheme')}
                onChange={handleColorSchemeChange}
                value={colorScheme}
            />
            <FormControlLabel
                control={
                    <Checkbox onChange={toggleFlipAxis} checked={flipAxis} />
                }
                label={polyglot.t('flip_axis')}
            />
        </Box>
    );
};

HeatMapAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        advancedMode: PropTypes.bool,
        advancedModeSpec: PropTypes.string,
        colorScheme: PropTypes.arrayOf(PropTypes.string),
        flipAxis: PropTypes.bool,
        tooltip: PropTypes.bool,
        tooltipSource: PropTypes.string,
        tooltipTarget: PropTypes.string,
        tooltipWeight: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

HeatMapAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(HeatMapAdmin);
