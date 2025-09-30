// @ts-expect-error TS6133
import React, { useEffect, useMemo } from 'react';
import { translate } from '../../../../i18n/I18NContext';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, FormGroup, Switch } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../utils/colorUtils';
import BubblePlot from '../../models/BubblePlot';
import { lodexOrderToIdOrder } from '../../../utils/chartsUtils';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import { BubblePlotAdminView } from './BubblePlotView';
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
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
    flipAxis: false,
    tooltip: false,
    tooltipSource: 'Source',
    tooltipTarget: 'Target',
    tooltipWeight: 'Weight',
    aspectRatio: ASPECT_RATIO_1_1,
};

// @ts-expect-error TS7006
const BubblePlotAdmin = (props) => {
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
        flipAxis,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
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

        const specBuilder = new BubblePlot();

        specBuilder.setColor(colors);
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

    // @ts-expect-error TS7006
    const handleAdvancedModeSpec = (newSpec) => {
        updateAdminArgs('advancedModeSpec', newSpec, props);
    };

    const clearAdvancedModeSpec = () => {
        updateAdminArgs('advancedModeSpec', null, props);
    };

    // @ts-expect-error TS7006
    const handleColors = (colors) => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    // @ts-expect-error TS7006
    const handleParams = (params) => {
        updateAdminArgs('params', params, props);
    };

    const toggleFlipAxis = () => {
        updateAdminArgs('flipAxis', !flipAxis, props);
    };

    const toggleTooltip = () => {
        updateAdminArgs('tooltip', !tooltip, props);
    };

    // @ts-expect-error TS7006
    const handleTooltipSource = (tooltipSource) => {
        updateAdminArgs('tooltipSource', tooltipSource, props);
    };

    // @ts-expect-error TS7006
    const handleTooltipTarget = (tooltipTarget) => {
        updateAdminArgs('tooltipTarget', tooltipTarget, props);
    };

    // @ts-expect-error TS7006
    const handleTooltipWeight = (tooltipWeight) => {
        updateAdminArgs('tooltipWeight', tooltipWeight, props);
    };

    // @ts-expect-error TS7006
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={toggleFlipAxis}
                                    checked={flipAxis}
                                />
                            }
                            label={polyglot.t('flip_axis')}
                        />
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
                        <ColorPickerParamsAdmin
                            colors={colors}
                            onChange={handleColors}
                            polyglot={polyglot}
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
                PreviewComponent={BubblePlotAdminView}
                datasets={[StandardSourceTargetWeight]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
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
        aspectRatio: PropTypes.string,
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
