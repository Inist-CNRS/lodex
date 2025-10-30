import { useMemo, useCallback, type ChangeEvent } from 'react';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import { schemeBlues } from 'd3-scale-chromatic';
import { GradientSchemeSelector } from '@lodex/frontend-common/components/ColorSchemeSelector';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import FlowMap from '../../models/FlowMap';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import FormatFieldSetPreview from '../../../utils/components/field-set/FormatFieldSetPreview';
import { FlowMapAdminView } from './FlowMapView';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import { MapSourceTargetWeight } from '../../../utils/dataSet';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import { ASPECT_RATIO_16_9 } from '../../../utils/aspectRatio';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

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
    colorScheme: schemeBlues[9] as string[],
    aspectRatio: ASPECT_RATIO_16_9,
};

type FlowMapParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
};

type FlowMapArgs = {
    params?: FlowMapParams;
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    tooltip?: boolean;
    tooltipCategory?: string;
    tooltipValue?: string;
    color?: string;
    colorScheme?: string[];
    aspectRatio?: string;
};

type FlowMapAdminProps = {
    args?: FlowMapArgs;
    onChange: (args: FlowMapArgs) => void;
    showMaxSize: boolean;
    showMaxValue: boolean;
    showMinValue: boolean;
    showOrderBy: boolean;
};

const FlowMapAdmin = ({
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    args = defaultArgs,
    onChange,
}: FlowMapAdminProps) => {
    const { translate } = useTranslate();
    const {
        advancedMode = defaultArgs.advancedMode,
        advancedModeSpec,
        params = defaultArgs.params,
        tooltip = defaultArgs.tooltip,
        tooltipValue = defaultArgs.tooltipValue,
        tooltipCategory = defaultArgs.tooltipCategory,
        aspectRatio = defaultArgs.aspectRatio,
        colorScheme = defaultArgs.colorScheme,
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
            colorScheme !== undefined ? colorScheme : schemeBlues[9],
        );
        specBuilder.setEditMode(true);
        // @ts-expect-error TS2554
        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [
        advancedMode,
        advancedModeSpec,
        color,
        colorScheme,
        tooltip,
        tooltipCategory,
        tooltipValue,
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

    const clearAdvancedModeSpec = () => handleAdvancedModeSpec(null);

    const handleParams = useCallback(
        (params: FlowMapParams) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const handleColor = useCallback(
        (value: string) => {
            const colorValue = value.split(' ')[0] || defaultArgs.color;
            onChange({
                ...args,
                color: colorValue,
            });
        },
        [onChange, args],
    );

    const handleColorScheme = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const newColorScheme = event.target.value.split(',');
            onChange({
                ...args,
                colorScheme: newColorScheme,
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

    const handleTooltipCategory = useCallback(
        (tooltipCategory: string) => {
            onChange({
                ...args,
                tooltipCategory,
            });
        },
        [onChange, args],
    );

    const handleTooltipValue = useCallback(
        (tooltipValue: string) => {
            onChange({
                ...args,
                tooltipValue,
            });
        },
        [onChange, args],
    );

    const handleAspectRatio = useCallback(
        (aspectRatio: string) => {
            onChange({
                ...args,
                aspectRatio,
            });
        },
        [onChange, args],
    );

    const datasets = useMemo(() => [MapSourceTargetWeight], []);

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
                        <GradientSchemeSelector
                            label={translate('color_scheme')}
                            onChange={handleColorScheme}
                            value={colorScheme}
                        />
                        <ColorPickerParamsAdmin
                            colors={color}
                            onChange={handleColor}
                            monochromatic={true}
                        />
                        <VegaToolTips
                            checked={tooltip}
                            onChange={toggleTooltip}
                            onCategoryTitleChange={handleTooltipCategory}
                            categoryTitle={tooltipCategory}
                            onValueTitleChange={handleTooltipValue}
                            valueTitle={tooltipValue}
                            thirdValue={false}
                        />
                    </>
                )}
                <AspectRatioSelector
                    value={aspectRatio}
                    onChange={handleAspectRatio}
                />
            </FormatChartParamsFieldSet>
            <FormatFieldSetPreview
                args={args}
                // @ts-expect-error TS2769
                PreviewComponent={FlowMapAdminView}
                datasets={datasets}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
    );
};

export default FlowMapAdmin;
