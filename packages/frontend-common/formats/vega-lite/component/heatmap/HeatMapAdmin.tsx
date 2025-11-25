import { useCallback, useMemo, type ChangeEvent } from 'react';
import { schemeOrRd } from 'd3-scale-chromatic';
import { Checkbox, FormControlLabel, Switch, FormGroup } from '@mui/material';

import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import { GradientSchemeSelector } from '../../../../components/ColorSchemeSelector';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import { buildHeatMapSpec } from '../../models/HeatMap';
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
import { ASPECT_RATIO_1_1, type AspectRatio } from '../../../utils/aspectRatio';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../../i18n/I18NContext';
import { FieldSelector } from '../../../../fields/form/FieldSelector';

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
    fieldToFilter: null,
};

type HeatMapParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
};

type HeatMapArgs = {
    params: HeatMapParams;
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    colorScheme: readonly string[];
    flipAxis?: boolean;
    tooltip: boolean;
    tooltipSource: string;
    tooltipTarget: string;
    tooltipWeight?: string;
    aspectRatio: AspectRatio;
    fieldToFilter?: string | null;
};

type HeatMapAdminProps = {
    args?: HeatMapArgs;
    onChange: (args: HeatMapArgs) => void;
    showMaxSize: boolean;
    showMaxValue: boolean;
    showMinValue: boolean;
    showOrderBy: boolean;
};

const HeatMapAdmin = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
}: HeatMapAdminProps) => {
    const { translate } = useTranslate();

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
        fieldToFilter,
    } = args;

    const spec = useMemo(() => {
        if (!advancedMode) {
            return null;
        }

        if (advancedModeSpec !== null) {
            return advancedModeSpec;
        }

        return JSON.stringify(
            buildHeatMapSpec({
                colors: colorScheme as string[],
                tooltip: {
                    toggle: tooltip,
                    sourceTitle: tooltipSource,
                    targetTitle: tooltipTarget,
                    weightTitle: tooltipWeight,
                },
                flip: !!flipAxis,
                orderBy: lodexOrderToIdOrder(params.orderBy || ''),
            }),
            null,
            2,
        );
    }, [
        advancedMode,
        advancedModeSpec,
        colorScheme,
        fieldToFilter,
        flipAxis,
        params.orderBy,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
    ]);

    const toggleAdvancedMode = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                advancedMode: event.target.checked,
            });
        },
        [onChange, args],
    );

    const handleAdvancedModeSpec = useCallback(
        (newSpec: string) => {
            onChange({
                ...args,
                advancedModeSpec: newSpec,
            });
        },
        [onChange, args],
    );

    const clearAdvancedModeSpec = useCallback(() => {
        onChange({
            ...args,
            advancedModeSpec: null,
        });
    }, [onChange, args]);

    const handleParams = useCallback(
        (params: HeatMapParams) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const handleColorSchemeChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                colorScheme: event.target.value.split(','),
            });
        },
        [onChange, args],
    );

    const toggleFlipAxis = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                flipAxis: event.target.checked,
            });
        },
        [onChange, args],
    );

    const toggleTooltip = useCallback(
        (tooltip: boolean) => {
            onChange({
                ...args,
                tooltip,
            });
        },
        [onChange, args],
    );

    const handleTooltipSource = useCallback(
        (tooltipSource: string) => {
            onChange({
                ...args,
                tooltipSource,
            });
        },
        [onChange, args],
    );

    const handleTooltipTarget = useCallback(
        (tooltipTarget: string) => {
            onChange({
                ...args,
                tooltipTarget,
            });
        },
        [onChange, args],
    );

    const handleTooltipWeight = useCallback(
        (tooltipWeight: string) => {
            onChange({
                ...args,
                tooltipWeight,
            });
        },
        [onChange, args],
    );

    const handleAspectRatio = useCallback(
        (value: AspectRatio) => {
            onChange({
                ...args,
                aspectRatio: value,
            });
        },
        [onChange, args],
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet defaultExpanded>
                <FieldSelector
                    value={fieldToFilter ?? null}
                    onChange={(fieldToFilter) =>
                        onChange({
                            ...args,
                            fieldToFilter: fieldToFilter || null,
                        })
                    }
                />
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={advancedMode}
                                onChange={toggleAdvancedMode}
                            />
                        }
                        label={translate('advancedMode')}
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
                            thirdValue={true}
                            onThirdValueChange={handleTooltipWeight}
                            thirdValueTitle={tooltipWeight}
                        />
                        <GradientSchemeSelector
                            label={translate('color_scheme')}
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
                            label={translate('flip_axis')}
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
                // @ts-expect-error TS2322
                PreviewComponent={HeatMapAdminView}
                datasets={[StandardSourceTargetWeight]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
    );
};

export default HeatMapAdmin;
