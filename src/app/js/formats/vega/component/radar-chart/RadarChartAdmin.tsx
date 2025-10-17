import { useMemo, useCallback, type ChangeEvent } from 'react';
import {
    MenuItem,
    Checkbox,
    FormControlLabel,
    TextField,
    Switch,
    FormGroup,
} from '@mui/material';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../../utils/colorUtils';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import RadarChart from '../../models/RadarChart';
import { lodexScaleToIdScale } from '../../../utils/chartsUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import VegaFieldPreview from '../../../utils/components/field-set/FormatFieldSetPreview';
import { RadarChartAdminView } from './RadarChartView';
import { StandardIdValue } from '../../../utils/dataSet';
import { ASPECT_RATIO_8_5, type AspectRatio } from '../../../utils/aspectRatio';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../../i18n/I18NContext';

export const defaultArgs = {
    params: {
        maxSize: 5,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    axisRoundValue: true,
    scale: 'linear' as const,
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    aspectRatio: ASPECT_RATIO_8_5,
};

type RadarChartParams = {
    maxSize?: number;
    orderBy?: string;
};

type RadarChartArgs = {
    params?: RadarChartParams;
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    colors?: string;
    axisRoundValue?: boolean;
    scale?: 'log' | 'linear';
    tooltip: boolean;
    tooltipCategory: string;
    tooltipValue: string;
    aspectRatio?: AspectRatio;
};

type RadarChartAdminProps = {
    args?: RadarChartArgs;
    onChange: (args: RadarChartArgs) => void;
    showMaxSize: boolean;
    showMaxValue: boolean;
    showMinValue: boolean;
    showOrderBy: boolean;
};

const RadarChartAdmin = ({
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    args = defaultArgs,
    onChange,
}: RadarChartAdminProps) => {
    const { translate } = useTranslate();
    const {
        advancedMode,
        advancedModeSpec,
        params,
        axisRoundValue,
        scale,
        tooltip,
        tooltipValue,
        tooltipCategory,
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

        const specBuilder = new RadarChart();

        specBuilder.setColors(colors.split(' '));
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setScale(lodexScaleToIdScale(scale));

        specBuilder.setEditMode(true);
        // @ts-expect-error TS2554
        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [
        advancedMode,
        advancedModeSpec,
        colors,
        scale,
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

    const clearAdvancedModeSpec = () => {
        handleAdvancedModeSpec(null);
    };

    const handleParams = useCallback(
        (params: RadarChartParams) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const handleAxisRoundValue = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                axisRoundValue: event.target.checked,
            });
        },
        [onChange, args],
    );

    const handleScale = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                scale: event.target.value as 'log' | 'linear',
            });
        },
        [onChange, args],
    );

    const handleColors = useCallback(
        (colors: string) => {
            const colorValue = colors.split(' ')[0] || defaultArgs.colors;
            onChange({
                ...args,
                colors: colorValue,
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
        (aspectRatio: AspectRatio) => {
            onChange({
                ...args,
                aspectRatio,
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
                        <VegaToolTips
                            checked={tooltip}
                            onChange={toggleTooltip}
                            onCategoryTitleChange={handleTooltipCategory}
                            categoryTitle={tooltipCategory}
                            onValueTitleChange={handleTooltipValue}
                            valueTitle={tooltipValue}
                            thirdValue={false}
                        />
                        <ColorPickerParamsAdmin
                            colors={colors}
                            onChange={handleColors}
                            monochromatic={true}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={handleAxisRoundValue}
                                    checked={axisRoundValue}
                                />
                            }
                            label={translate('axis_round_value')}
                        />
                        <TextField
                            fullWidth
                            select
                            label={translate('scale')}
                            onChange={handleScale}
                            value={scale}
                        >
                            <MenuItem value="linear">
                                {translate('linear')}
                            </MenuItem>
                            <MenuItem value="log">{translate('log')}</MenuItem>
                        </TextField>
                    </>
                )}
                <AspectRatioSelector
                    value={aspectRatio}
                    onChange={handleAspectRatio}
                />
            </FormatChartParamsFieldSet>
            <VegaFieldPreview
                args={args}
                // @ts-expect-error TS2769
                PreviewComponent={RadarChartAdminView}
                datasets={[StandardIdValue]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
    );
};

export default RadarChartAdmin;
