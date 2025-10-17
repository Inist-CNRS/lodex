import { useCallback, useMemo, type ChangeEvent } from 'react';
import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Switch,
    FormGroup,
} from '@mui/material';
import { useTranslate } from '../../../../i18n/I18NContext';

import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../utils/colorUtils';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import BarChart from '../../models/BarChart';
import {
    AXIS_X,
    AXIS_Y,
    lodexDirectionToIdDirection,
    lodexScaleToIdScale,
} from '../../../utils/chartsUtils';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import { BarChartAdminView } from './BarChartView';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import VegaFieldPreview from '../../../utils/components/field-set/FormatFieldSetPreview';
import { StandardIdValue } from '../../../utils/dataSet';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import {
    ASPECT_RATIO_16_6,
    type AspectRatio,
} from '../../../utils/aspectRatio';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc' as const,
    },
    advancedMode: false,
    advancedModeSpec: null,
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
    axisRoundValue: true,
    diagonalCategoryAxis: false,
    diagonalValueAxis: false,
    direction: 'horizontal',
    scale: 'linear',
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    labels: false,
    labelOverlap: false,
    barSize: 20,
    aspectRatio: ASPECT_RATIO_16_6,
};

type BarChartParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
    uri?: string;
};

type BarChartArgs = {
    params?: BarChartParams;
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    colors?: string;
    axisRoundValue?: boolean;
    diagonalCategoryAxis?: boolean;
    diagonalValueAxis?: boolean;
    direction?: string;
    scale?: string;
    tooltip?: boolean;
    tooltipCategory?: string;
    tooltipValue?: string;
    labels?: boolean;
    labelOverlap?: boolean;
    barSize?: number;
    aspectRatio?: AspectRatio;
};

type BarChartAdminProps = {
    args?: BarChartArgs;
    onChange: (args: BarChartArgs) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

const BarChartAdmin = ({
    args = defaultArgs,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    onChange,
}: BarChartAdminProps) => {
    const { translate } = useTranslate();
    const {
        advancedMode,
        advancedModeSpec,
        params,
        tooltip,
        tooltipCategory,
        tooltipValue,
        labels,
        barSize,
        diagonalCategoryAxis,
        diagonalValueAxis,
        scale,
        direction,
        axisRoundValue,
        labelOverlap,
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

        const specBuilder = new BarChart();
        specBuilder.setAxisDirection(lodexDirectionToIdDirection(direction));
        specBuilder.setScale(lodexScaleToIdScale(scale));
        specBuilder.setColor(colors);
        specBuilder.setRoundValue(axisRoundValue);
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setLabels(labels);
        specBuilder.setLabelOverlap(labelOverlap);
        specBuilder.setSize(barSize);
        if (diagonalCategoryAxis) {
            specBuilder.setLabelAngle(AXIS_X, -45);
        }
        if (diagonalValueAxis) {
            specBuilder.setLabelAngle(AXIS_Y, -45);
        }
        specBuilder.setEditMode(true);
        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [
        advancedMode,
        advancedModeSpec,
        axisRoundValue,
        barSize,
        colors,
        diagonalCategoryAxis,
        diagonalValueAxis,
        direction,
        labelOverlap,
        labels,
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
        (params: BarChartParams) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const handleColors = useCallback(
        (colors: string | null) => {
            onChange({
                ...args,
                colors: colors || defaultArgs.colors,
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
        (event: ChangeEvent<HTMLInputElement>) =>
            onChange({
                ...args,
                scale: event.target.value,
            }),
        [onChange, args],
    );

    const handleDirection = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            onChange({
                ...args,
                direction: event.target.value,
            }),
        [onChange, args],
    );

    const toggleDiagonalValueAxis = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                diagonalValueAxis: event.target.checked,
            });
        },
        [onChange, args],
    );

    const toggleDiagonalCategoryAxis = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            onChange({
                ...args,
                diagonalCategoryAxis: event.target.checked,
            }),
        [onChange, args],
    );

    const handleBarSize = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                barSize: parseInt(event.target.value, 10),
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

    const toggleLabels = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                labels: event.target.checked,
            });
        },
        [onChange, args],
    );

    const toggleLabelOverlap = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                labelOverlap: event.target.checked,
            });
        },
        [onChange, args],
    );

    const handleTooltipCategory = useCallback(
        (category: string) => {
            onChange({
                ...args,
                tooltipCategory: category,
            });
        },
        [onChange, args],
    );

    const handleTooltipValue = useCallback(
        (value: string) => {
            onChange({
                ...args,
                tooltipValue: value,
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
                            checked={tooltip ?? defaultArgs.tooltip}
                            onChange={toggleTooltip}
                            onCategoryTitleChange={handleTooltipCategory}
                            categoryTitle={
                                tooltipCategory ?? defaultArgs.tooltipCategory
                            }
                            onValueTitleChange={handleTooltipValue}
                            valueTitle={
                                tooltipValue ?? defaultArgs.tooltipValue
                            }
                            thirdValue={false}
                        />
                        <ColorPickerParamsAdmin
                            colors={colors}
                            onChange={handleColors}
                        />
                        <TextField
                            fullWidth
                            select
                            label={translate('direction')}
                            onChange={handleDirection}
                            value={direction}
                        >
                            <MenuItem value="horizontal">
                                {translate('horizontal')}
                            </MenuItem>
                            <MenuItem value="vertical">
                                {translate('vertical')}
                            </MenuItem>
                        </TextField>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={toggleDiagonalCategoryAxis}
                                    checked={diagonalCategoryAxis}
                                />
                            }
                            label={translate('diagonal_category_axis')}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={toggleDiagonalValueAxis}
                                    checked={diagonalValueAxis}
                                />
                            }
                            label={translate('diagonal_value_axis')}
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={toggleLabels}
                                    checked={labels}
                                />
                            }
                            label={translate('toggle_labels')}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={toggleLabelOverlap}
                                    checked={labelOverlap}
                                />
                            }
                            label={translate('toggle_label_overlap')}
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
                        <TextField
                            type="number"
                            fullWidth
                            label={translate('bar_size')}
                            onChange={handleBarSize}
                            value={barSize}
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
                PreviewComponent={BarChartAdminView}
                datasets={[StandardIdValue]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
    );
};

export default BarChartAdmin;
