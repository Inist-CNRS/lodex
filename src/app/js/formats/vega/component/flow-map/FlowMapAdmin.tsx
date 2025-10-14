import { useMemo, useState, type ChangeEvent } from 'react';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import { schemeBlues } from 'd3-scale-chromatic';
import { GradientSchemeSelector } from '../../../../lib/components/ColorSchemeSelector';
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
import { useUpdateAdminArgs } from '../../../utils/updateAdminArgs';
import { useTranslate } from '../../../../i18n/I18NContext';

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
    } = args;

    const [colorScheme, setColorScheme] = useState<string[]>(
        args.colorScheme ?? defaultArgs.colorScheme,
    );

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

    const toggleAdvancedMode = useUpdateAdminArgs<
        FlowMapArgs,
        'advancedMode',
        ChangeEvent<HTMLInputElement>
    >('advancedMode', {
        args,
        onChange,
        parseValue: (event) => event.target.checked,
    });

    const handleAdvancedModeSpec = useUpdateAdminArgs<
        FlowMapArgs,
        'advancedModeSpec'
    >('advancedModeSpec', {
        args,
        onChange,
    });

    const clearAdvancedModeSpec = () => handleAdvancedModeSpec(null);

    console.log({ advancedModeSpec });

    const handleParams = useUpdateAdminArgs<FlowMapArgs, 'params'>('params', {
        args,
        onChange,
    });

    const handleColor = useUpdateAdminArgs<FlowMapArgs, 'color', string>(
        'color',
        {
            args,
            onChange,
            parseValue: (value) => value.split(' ')[0] || defaultArgs.color,
        },
    );

    const handleColorScheme = useUpdateAdminArgs<
        FlowMapArgs,
        'colorScheme',
        ChangeEvent<HTMLInputElement>
    >('colorScheme', {
        args,
        onChange,
        parseValue: (event) => {
            const newColorScheme = event.target.value.split(',');
            setColorScheme(newColorScheme);
            return newColorScheme;
        },
    });

    const toggleTooltip = useUpdateAdminArgs<FlowMapArgs, 'tooltip'>(
        'tooltip',
        {
            args,
            onChange,
        },
    );

    const handleTooltipCategory = useUpdateAdminArgs<
        FlowMapArgs,
        'tooltipCategory'
    >('tooltipCategory', {
        args,
        onChange,
    });

    const handleTooltipValue = useUpdateAdminArgs<FlowMapArgs, 'tooltipValue'>(
        'tooltipValue',
        { args, onChange },
    );

    const handleAspectRatio = useUpdateAdminArgs<FlowMapArgs, 'aspectRatio'>(
        'aspectRatio',
        {
            args,
            onChange,
        },
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
