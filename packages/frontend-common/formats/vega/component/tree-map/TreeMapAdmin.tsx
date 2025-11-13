import { useTranslate } from '../../../../i18n/I18NContext';
import { MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH } from '../../../utils/colorUtils';
import { ASPECT_RATIO_8_5, type AspectRatio } from '../../../utils/aspectRatio';
import TreeMap, { type TreeMapLayout } from '../../models/TreeMap';
import { useCallback, useMemo, type ChangeEvent } from 'react';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import {
    FormControlLabel,
    FormGroup,
    MenuItem,
    Slider,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import {
    StandardIdValue,
    StandardSourceTargetWeight,
    TreeMapSourceTargetWeight,
} from '../../../utils/dataSet';
import VegaFieldPreview from '../../../utils/components/field-set/FormatFieldSetPreview';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import { TreeMapAdminView } from './TreeMapView';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 5,
        orderBy: 'value/asc',
    },
    hierarchy: true,
    flatType: 'id/value' as const,
    advancedMode: false,
    advancedModeSpec: null,
    tooltip: false,
    tooltipSource: 'Source',
    tooltipTarget: 'Target',
    tooltipWeight: 'Weight',
    colors: MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH,
    layout: 'squarify' as const,
    ratio: 2.0,
    aspectRatio: ASPECT_RATIO_8_5,
};

type TreeMapParams = {
    maxSize?: number;
    orderBy?: string;
};

type TreeMapArgs = {
    params?: TreeMapParams;
    hierarchy?: boolean;
    flatType?: 'id/value' | 'source/target/weight';
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    tooltip: boolean;
    tooltipSource: string;
    tooltipTarget: string;
    tooltipWeight?: string;
    colors?: string;
    layout?: TreeMapLayout;
    ratio?: number;
    aspectRatio: AspectRatio;
};

type TreeMapAdminProps = {
    args?: TreeMapArgs;
    onChange: (args: TreeMapArgs) => void;
    showMaxSize: boolean;
    showMaxValue: boolean;
    showMinValue: boolean;
    showOrderBy: boolean;
};

const TreeMapAdmin = ({
    args = defaultArgs,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    onChange,
}: TreeMapAdminProps) => {
    const { translate } = useTranslate();
    const {
        hierarchy,
        flatType,
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
        params,
        layout,
        ratio,
        aspectRatio,
    } = args;

    const dataset = useMemo(() => {
        if (hierarchy) {
            return TreeMapSourceTargetWeight;
        }
        if (flatType === 'id/value') {
            return StandardIdValue;
        }
        return StandardSourceTargetWeight;
    }, [hierarchy, flatType]);

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

        const specBuilder = new TreeMap();

        specBuilder.setHierarchy(hierarchy);
        specBuilder.setColors(colors.split(' '));
        specBuilder.setTooltip(tooltip);
        specBuilder.setThirdTooltip(
            hierarchy || (!hierarchy && flatType !== 'id/value'),
        );
        specBuilder.setTooltipSource(tooltipSource);
        specBuilder.setTooltipTarget(tooltipTarget);
        specBuilder.setTooltipWeight(tooltipWeight);
        specBuilder.setRatio(ratio);
        specBuilder.setLayout(layout);

        specBuilder.setEditMode(true);
        return JSON.stringify(specBuilder.buildSpec(400), null, 2);
    }, [
        advancedMode,
        advancedModeSpec,
        colors,
        flatType,
        hierarchy,
        layout,
        ratio,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
    ]);

    const handleParams = useCallback(
        (params: TreeMapParams) => {
            onChange({
                ...args,
                params,
            });
        },
        [args, onChange],
    );

    const toggleAdvancedMode = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                advancedMode: event.target.checked,
            });
        },
        [args, onChange],
    );

    const toggleHierarchy = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                hierarchy: event.target.checked,
            });
        },
        [args, onChange],
    );

    const handleFlatType = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                flatType: event.target.value as
                    | 'id/value'
                    | 'source/target/weight',
            });
        },
        [args, onChange],
    );

    const handleAdvancedModeSpec = useCallback(
        (advancedModeSpec: string | null) => {
            onChange({
                ...args,
                advancedModeSpec,
            });
        },
        [args, onChange],
    );

    const clearAdvancedModeSpec = useCallback(() => {
        handleAdvancedModeSpec(null);
    }, [handleAdvancedModeSpec]);

    const toggleTooltip = useCallback(
        (tooltip: boolean) => {
            onChange({
                ...args,
                tooltip,
            });
        },
        [args, onChange],
    );

    const handleTooltipSource = useCallback(
        (tooltipSource: string) =>
            onChange({
                ...args,
                tooltipSource,
            }),
        [args, onChange],
    );

    const handleTooltipTarget = useCallback(
        (tooltipTarget: string) => {
            onChange({
                ...args,
                tooltipTarget,
            });
        },
        [args, onChange],
    );

    const handleTooltipWeight = useCallback(
        (tooltipWeight: string) => {
            onChange({
                ...args,
                tooltipWeight,
            });
        },
        [args, onChange],
    );

    const handleColors = useCallback(
        (colors: string) => {
            onChange({
                ...args,
                colors,
            });
        },
        [args, onChange],
    );

    const handleLayout = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                layout: e.target.value as TreeMapLayout,
            });
        },
        [args, onChange],
    );

    const handleRatio = useCallback(
        (_: unknown, value: number | number[]) => {
            onChange({
                ...args,
                ratio: Array.isArray(value) ? value[0] : value,
            });
        },
        [args, onChange],
    );

    const handleAspectRatio = useCallback(
        (aspectRatio: AspectRatio) => {
            onChange({
                ...args,
                aspectRatio,
            });
        },
        [args, onChange],
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
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={hierarchy}
                                onChange={toggleHierarchy}
                            />
                        }
                        label={translate('treemap_hierarchy_data')}
                    />
                </FormGroup>
                {!hierarchy ? (
                    <TextField
                        fullWidth
                        select
                        label={translate('treemap_flat_data_type')}
                        onChange={handleFlatType}
                        value={flatType}
                    >
                        <MenuItem value="id/value">_id / value</MenuItem>
                        <MenuItem value="source/target/weight">
                            source / target / weight
                        </MenuItem>
                    </TextField>
                ) : null}
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
                            thirdValue={
                                hierarchy ||
                                (!hierarchy && flatType !== 'id/value')
                            }
                            onThirdValueChange={handleTooltipWeight}
                            thirdValueTitle={tooltipWeight}
                        />
                        <ColorPickerParamsAdmin
                            colors={colors}
                            onChange={handleColors}
                            monochromatic={false}
                        />
                        <TextField
                            fullWidth
                            select
                            label={translate('layout')}
                            onChange={handleLayout}
                            value={layout}
                        >
                            <MenuItem value="squarify">
                                {translate('squarify')}
                            </MenuItem>
                            <MenuItem value="binary">
                                {translate('binary')}
                            </MenuItem>
                            <MenuItem value="slicedice">
                                {translate('slicedice')}
                            </MenuItem>
                        </TextField>
                        <div
                            style={{
                                marginLeft: '4px',
                                marginRight: '4px',
                                width: 'calc(100% - 8px)',
                            }}
                        >
                            <Typography
                                gutterBottom
                                sx={{ marginBottom: '-2px' }}
                            >
                                {translate('treemap_ratio')}
                            </Typography>
                            <Slider
                                aria-label="Ratio"
                                defaultValue={ratio}
                                value={ratio}
                                onChange={handleRatio}
                                valueLabelDisplay="auto"
                                step={0.1}
                                marks
                                min={1}
                                max={5}
                            />
                        </div>
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
                PreviewComponent={TreeMapAdminView}
                datasets={[dataset]}
                showDatasetsSelector={false}
            />
        </FormatGroupedFieldSet>
    );
};

export default TreeMapAdmin;
