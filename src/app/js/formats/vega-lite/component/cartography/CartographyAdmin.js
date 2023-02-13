import React, { Component } from 'react';
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
    colorScheme: schemeOrRd[9],
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    worldPosition: MAP_WORLD,
};

class CartographyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
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

    static defaultProps = {
        args: defaultArgs,
        showMaxSize: true,
        showMaxValue: true,
        showMinValue: true,
        showOrderBy: true,
    };

    constructor(props) {
        super(props);
        this.setTooltipValue = this.setTooltipValue.bind(this);
        this.setTooltipCategory = this.setTooltipCategory.bind(this);
    }

    setParams = params => updateAdminArgs('params', params, this.props);

    setWorldPosition = e => {
        updateAdminArgs('worldPosition', e.target.value, this.props);
    };

    setColorScheme = (_, colorScheme) => {
        updateAdminArgs(
            'colorScheme',
            colorScheme.props.value.split(','),
            this.props,
        );
    };

    toggleTooltip = () => {
        updateAdminArgs('tooltip', !this.props.args.tooltip, this.props);
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
                colorScheme,
                tooltip,
                tooltipCategory,
                tooltipValue,
                worldPosition,
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
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('world_position')}
                    value={worldPosition}
                    onChange={this.setWorldPosition}
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
                    onChange={this.setColorScheme}
                    value={colorScheme}
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
            </Box>
        );
    }
}

export default translate(CartographyAdmin);
