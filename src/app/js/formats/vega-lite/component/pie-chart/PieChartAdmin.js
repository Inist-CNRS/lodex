import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Box, Checkbox, FormControlLabel } from '@mui/material';

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
    advancedMode: false,
    advancedModeSpec: null,
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    labels: false,
};

const PieChartAdmin = props => {
    const {
        p: polyglot,
        args,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;

    const { params, tooltip, tooltipCategory, tooltipValue, labels } = args;

    const colors = useMemo(() => {
        return args.colors || defaultArgs.colors;
    }, [args.colors]);

    const handleParams = params => updateAdminArgs('params', params, props);

    const handleColors = colors => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    const toggleLabels = () => {
        updateAdminArgs('labels', !args.labels, props);
    };

    const toggleTooltip = () => {
        updateAdminArgs('tooltip', !args.tooltip, props);
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
            <RoutineParamsAdmin
                params={params || defaultArgs.params}
                onChange={handleParams}
                polyglot={polyglot}
                showMaxSize={showMaxSize}
                showMaxValue={showMaxValue}
                showMinValue={showMinValue}
                showOrderBy={showOrderBy}
            />
            <FormControlLabel
                control={<Checkbox onChange={toggleLabels} checked={labels} />}
                label={polyglot.t('toggle_labels')}
            />
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
        </Box>
    );
};

PieChartAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

PieChartAdmin.propTypes = {
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

export default translate(PieChartAdmin);
