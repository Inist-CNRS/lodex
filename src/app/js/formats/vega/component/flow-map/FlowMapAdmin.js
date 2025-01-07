import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import { schemeBlues } from 'd3-scale-chromatic';
import { GradientSchemeSelector } from '../../../../lib/components/ColorSchemeSelector';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import FlowMap from '../../models/FlowMap';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import VegaFieldPreview from '../../../utils/components/field-set/FormatFieldSetPreview';
import { FlowMapAdminView } from './FlowMapView';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import { MapSourceTargetWeight } from '../../../utils/dataSet';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import { ASPECT_RATIO_16_9 } from '../../../utils/aspectRatio';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: undefined,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    color: '#000000',
    colorScheme: schemeBlues[9],
    aspectRatio: ASPECT_RATIO_16_9,
};

const FlowMapAdmin = (props) => {
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
        tooltip,
        tooltipValue,
        tooltipCategory,
        colorScheme,
        aspectRatio,
    } = args;

    const color = useMemo(() => {
        return args.color || defaultArgs.color;
    }, [args.color]);

    const spec = useMemo(() => {
        if (!advancedMode) {
            return null;
        }

        if (advancedModeSpec !== null) {
            return advancedModeSpec;
        }

        const specBuilder = new FlowMap();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(color.split(' ')[0]);
        specBuilder.setColorScheme(
            colorScheme !== undefined ? colorScheme : schemeBlues[9].split(' '),
        );
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
        updateAdminArgs('advancedMode', !args.advancedMode, props);
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

    const handleColor = (color) => {
        updateAdminArgs(
            'color',
            color.split(' ')[0] || defaultArgs.color,
            props,
        );
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

    const handleTooltipCategory = (tooltipCategory) => {
        updateAdminArgs('tooltipCategory', tooltipCategory, props);
    };

    const handleTooltipValue = (tooltipValue) => {
        updateAdminArgs('tooltipValue', tooltipValue, props);
    };

    const handleAspectRatio = (value) => {
        updateAdminArgs('aspectRatio', value, props);
    };

    return (
        <FormatGroupedFieldSet>
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
            <FormatChartParamsFieldSet defaultExpanded>
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
                        <GradientSchemeSelector
                            label={polyglot.t('color_scheme')}
                            onChange={handleColorScheme}
                            value={colorScheme}
                        />
                        <ColorPickerParamsAdmin
                            colors={color}
                            onChange={handleColor}
                            polyglot={polyglot}
                            monochromatic={true}
                        />
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
                    </>
                )}
                <AspectRatioSelector
                    value={aspectRatio}
                    onChange={handleAspectRatio}
                />
            </FormatChartParamsFieldSet>
            <VegaFieldPreview
                args={{ ...args, p: polyglot }}
                PreviewComponent={FlowMapAdminView}
                datasets={[MapSourceTargetWeight]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
    );
};

FlowMapAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        advancedMode: PropTypes.bool,
        advancedModeSpec: PropTypes.string,
        tooltip: PropTypes.bool,
        tooltipCategory: PropTypes.string,
        tooltipValue: PropTypes.string,
        color: PropTypes.string,
        colorScheme: PropTypes.arrayOf(PropTypes.string),
        aspectRatio: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

FlowMapAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(FlowMapAdmin);
