import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { schemeOrRd } from 'd3-scale-chromatic';
import { Box, MenuItem, TextField } from '@mui/material';

import { GradientSchemeSelector } from '../../../../lib/components/ColorSchemeSelector';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ToolTips from '../../../shared/ToolTips';
import { MAP_EUROPE, MAP_FRANCE, MAP_WORLD } from '../../../chartsUtils';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    colorScheme: schemeOrRd[9],
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    worldPosition: MAP_WORLD,
};

const CartographyAdmin = props => {
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
        tooltip,
        tooltipCategory,
        tooltipValue,
        worldPosition,
    } = args;

    const handleParams = params => updateAdminArgs('params', params, props);

    const handleWorldPosition = e => {
        updateAdminArgs('worldPosition', e.target.value, props);
    };

    const handleColorScheme = (_, colorScheme) => {
        updateAdminArgs(
            'colorScheme',
            colorScheme.props.value.split(','),
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
            <RoutineParamsAdmin
                params={params || defaultArgs.params}
                onChange={handleParams}
                polyglot={polyglot}
                showMaxSize={showMaxSize}
                showMaxValue={showMaxValue}
                showMinValue={showMinValue}
                showOrderBy={showOrderBy}
            />
            <TextField
                fullWidth
                select
                label={polyglot.t('world_position')}
                value={worldPosition}
                onChange={handleWorldPosition}
            >
                <MenuItem value={MAP_WORLD}>
                    {polyglot.t('world_position_world')}
                </MenuItem>
                <MenuItem value={MAP_EUROPE}>
                    {polyglot.t('world_position_europe')}
                </MenuItem>
                <MenuItem value={MAP_FRANCE}>
                    {polyglot.t('world_position_france')}
                </MenuItem>
            </TextField>
            <GradientSchemeSelector
                label={polyglot.t('color_scheme')}
                onChange={handleColorScheme}
                value={colorScheme}
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
        </Box>
    );
};

CartographyAdmin.propTypes = {
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
        tooltip: PropTypes.bool,
        tooltipCategory: PropTypes.string,
        tooltipValue: PropTypes.string,
        worldPosition: PropTypes.oneOf([MAP_WORLD, MAP_EUROPE, MAP_FRANCE]),
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

CartographyAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(CartographyAdmin);
