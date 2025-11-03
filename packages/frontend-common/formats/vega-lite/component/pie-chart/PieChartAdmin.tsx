import { useCallback, useMemo, type ChangeEvent } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Switch } from '@mui/material';

import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../utils/colorUtils';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import PieChart from '../../models/PieChart';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import VegaFieldPreview from '../../../utils/components/field-set/FormatFieldSetPreview';
import { PieChartAdminView } from './PieChartView';
import { StandardIdValue } from '../../../utils/dataSet';
import { ASPECT_RATIO_8_5, type AspectRatio } from '../../../utils/aspectRatio';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    labels: false,
    aspectRatio: ASPECT_RATIO_8_5,
};

type PieChartParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
};

type PieChartArgs = {
    params: PieChartParams;
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    colors?: string;
    tooltip: boolean;
    tooltipCategory: string;
    tooltipValue: string;
    labels?: boolean;
    aspectRatio: AspectRatio;
};

type PieChartAdminProps = {
    args?: PieChartArgs;
    onChange: (args: PieChartArgs) => void;
    showMaxSize: boolean;
    showMaxValue: boolean;
    showMinValue: boolean;
    showOrderBy: boolean;
};

const PieChartAdmin = ({
    args = defaultArgs,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    onChange,
}: PieChartAdminProps) => {
    const { translate } = useTranslate();
    const {
        advancedMode,
        advancedModeSpec,
        params,
        tooltip,
        tooltipCategory,
        tooltipValue,
        labels,
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

        const specBuilder = new PieChart();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(colors);
        specBuilder.setLabels(labels);

        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [
        advancedMode,
        advancedModeSpec,
        colors,
        labels,
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

    const clearAdvancedModeSpec = useCallback(() => {
        handleAdvancedModeSpec(null);
    }, [handleAdvancedModeSpec]);

    const handleParams = useCallback(
        (params: PieChartParams) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
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

    const toggleLabels = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                labels: event.target.checked,
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
                            checked={tooltip}
                            onChange={toggleTooltip}
                            onCategoryTitleChange={handleTooltipCategory}
                            categoryTitle={tooltipCategory}
                            onValueTitleChange={handleTooltipValue}
                            valueTitle={tooltipValue}
                            thirdValue={false}
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
                PreviewComponent={PieChartAdminView}
                datasets={[StandardIdValue]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
    );
};

export default PieChartAdmin;
