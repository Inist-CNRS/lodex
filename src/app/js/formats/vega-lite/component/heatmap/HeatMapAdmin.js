import React, { useEffect, useMemo } from 'react';
import translate from 'redux-polyglot/translate';
import { schemeOrRd } from 'd3-scale-chromatic';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Switch, FormGroup } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import { GradientSchemeSelector } from '../../../../lib/components/ColorSchemeSelector';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import HeatMap from '../../models/HeatMap';
import { lodexOrderToIdOrder } from '../../../utils/chartsUtils';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import { HeatMapAdminView } from './HeatMapView';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import VegaFieldPreview from '../../../utils/components/field-set/FormatFieldSetPreview';
import { StandardSourceTargetWeight } from '../../../utils/dataSet';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import { ASPECT_RATIO_1_1 } from '../../../utils/aspectRatio';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';

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
    aspectRatio: ASPECT_RATIO_1_1,
};

const HeatMapAdmin = (props) => {
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
        colorScheme,
        flipAxis,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
        aspectRatio,
    } = args;

    const spec = useMemo(() => {
        if (!advancedMode) {
            return null;
        }

        if (advancedModeSpec !== null) {
            return advancedModeSpec;
        }

        const specBuilder = new HeatMap();

        specBuilder.setColor(colorScheme.join(' '));
        specBuilder.setOrderBy(lodexOrderToIdOrder(params.orderBy));
        specBuilder.flipAxis(flipAxis);
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipSource);
        specBuilder.setTooltipTarget(tooltipTarget);
        specBuilder.setTooltipValue(tooltipWeight);

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

    const handleTooltipSource = (tooltipSource) => {
        updateAdminArgs('tooltipSource', tooltipSource, props);
    };

    const handleTooltipTarget = (tooltipTarget) => {
        updateAdminArgs('tooltipTarget', tooltipTarget, props);
    };

    const handleTooltipWeight = (tooltipWeight) => {
        updateAdminArgs('tooltipWeight', tooltipWeight, props);
    };

    const handleAspectRatio = (value) => {
        updateAdminArgs('aspectRatio', value, props);
    };

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={handleParams}
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
                        <VegaToolTips
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
                                <Checkbox
                                    onChange={toggleFlipAxis}
                                    checked={flipAxis}
                                />
                            }
                            label={polyglot.t('flip_axis')}
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
                PreviewComponent={HeatMapAdminView}
                datasets={[StandardSourceTargetWeight]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
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
        aspectRatio: PropTypes.string,
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
