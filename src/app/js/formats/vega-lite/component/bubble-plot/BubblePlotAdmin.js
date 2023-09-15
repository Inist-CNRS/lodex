import React, { useMemo } from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { Box, Checkbox, FormControlLabel } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ToolTips from '../../../shared/ToolTips';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
    flipAxis: false,
    tooltip: false,
    tooltipSource: 'Source',
    tooltipTarget: 'Target',
    tooltipWeight: 'Weight',
};

const BubblePlotAdmin = props => {
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
        flipAxis,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
    } = args;

    const colors = useMemo(() => {
        return args.colors || defaultArgs.colors;
    }, [args.colors]);

    const handleColors = colors => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    const handleParams = params => {
        updateAdminArgs('params', params, props);
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
            <FormControlLabel
                control={
                    <Checkbox onChange={toggleFlipAxis} checked={flipAxis} />
                }
                label={polyglot.t('flip_axis')}
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
            <ColorPickerParamsAdmin
                colors={colors}
                onChange={handleColors}
                polyglot={polyglot}
            />
        </Box>
    );
};

BubblePlotAdmin.propTypes = {
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

BubblePlotAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(BubblePlotAdmin);
