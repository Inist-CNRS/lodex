import { useCallback, useMemo, type ChangeEvent } from 'react';
import { useTranslate } from '../../../../i18n/I18NContext';
import { Checkbox, FormControlLabel, FormGroup, Switch } from '@mui/material';

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

type BubblePlotParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
};

type BubblePlotArgs = {
    params: BubblePlotParams;
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    colors?: string;
    flipAxis?: boolean;
    tooltip?: boolean;
    tooltipSource?: string;
    tooltipTarget?: string;
    tooltipWeight?: string;
    aspectRatio?: string;
};

type BubblePlotAdminProps = {
    args?: BubblePlotArgs;
    onChange: (args: BubblePlotArgs) => void;
    showMaxSize: boolean;
    showMaxValue: boolean;
    showMinValue: boolean;
    showOrderBy: boolean;
};

const BubblePlotAdmin = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
}: BubblePlotAdminProps) => {
    const { translate } = useTranslate();

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
    }, [
        advancedMode,
        advancedModeSpec,
        colors,
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
        (advancedModeSpec: string | null) => {
            onChange({
                ...args,
                advancedModeSpec,
            });
        },
        [onChange, args],
    );

    const clearAdvancedModeSpec = useCallback(
        () => handleAdvancedModeSpec(null),
        [handleAdvancedModeSpec],
    );

    const handleColors = useCallback(
        (colors: string) => {
            onChange({
                ...args,
                colors: colors || defaultArgs.colors,
            });
        },
        [onChange, args],
    );

    const handleParams = useCallback(
        (params: BubblePlotParams) => {
            onChange({
                ...args,
                params,
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
        (value: string) => {
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={toggleFlipAxis}
                                    checked={flipAxis}
                                />
                            }
                            label={translate('flip_axis')}
                        />
                        <VegaToolTips
                            checked={tooltip ?? defaultArgs.tooltip}
                            onChange={toggleTooltip}
                            onCategoryTitleChange={handleTooltipSource}
                            categoryTitle={
                                tooltipSource ?? defaultArgs.tooltipSource
                            }
                            onValueTitleChange={handleTooltipTarget}
                            valueTitle={
                                tooltipTarget ?? defaultArgs.tooltipTarget
                            }
                            thirdValue={true}
                            onThirdValueChange={handleTooltipWeight}
                            thirdValueTitle={
                                tooltipWeight ?? defaultArgs.tooltipWeight
                            }
                        />
                        <ColorPickerParamsAdmin
                            colors={colors}
                            onChange={handleColors}
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
                PreviewComponent={BubblePlotAdminView}
                datasets={[StandardSourceTargetWeight]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
    );
};

export default BubblePlotAdmin;
