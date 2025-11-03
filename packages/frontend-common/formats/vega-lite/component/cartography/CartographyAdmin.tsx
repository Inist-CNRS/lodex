import { useCallback, useMemo, type ChangeEvent } from 'react';
import { useTranslate } from '../../../../i18n/I18NContext';
import { schemeOrRd } from 'd3-scale-chromatic';
import {
    FormControlLabel,
    FormGroup,
    MenuItem,
    Switch,
    TextField,
} from '@mui/material';

import { GradientSchemeSelector } from '../../../../components/ColorSchemeSelector';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';
import { MAP_EUROPE, MAP_FRANCE, MAP_WORLD } from '../../../utils/chartsUtils';
import Cartography from '../../models/Cartography';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import { MapFranceIdValue, MapIdValue } from '../../../utils/dataSet';
import VegaFieldPreview from '../../../utils/components/field-set/FormatFieldSetPreview';
import { CartographyAdminView } from './CartographyView';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import {
    ASPECT_RATIO_16_9,
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
    colorScheme: schemeOrRd[9],
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    worldPosition: MAP_WORLD,
    aspectRatio: ASPECT_RATIO_16_9,
};

type CartographyParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
};

type CartographyArgs = {
    params: CartographyParams;
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    colorScheme: readonly string[];
    tooltip: boolean;
    tooltipCategory: string;
    tooltipValue: string;
    worldPosition?: string;
    aspectRatio: AspectRatio;
};

type CartographyAdminProps = {
    args?: CartographyArgs;
    onChange: (args: CartographyArgs) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

const CartographyAdmin = ({
    args = defaultArgs,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    onChange,
}: CartographyAdminProps) => {
    const { translate } = useTranslate();

    const {
        advancedMode,
        advancedModeSpec,
        params,
        colorScheme,
        tooltip,
        tooltipCategory,
        tooltipValue,
        worldPosition,
        aspectRatio,
    } = args;

    const spec = useMemo(() => {
        if (!advancedMode) {
            return null;
        }

        if (advancedModeSpec !== null) {
            return advancedModeSpec;
        }

        const specBuilder = new Cartography();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setWorldPosition(worldPosition);
        specBuilder.setColor(
            colorScheme !== undefined ? colorScheme.join(' ') : schemeOrRd[9],
        );

        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [
        advancedMode,
        advancedModeSpec,
        colorScheme,
        tooltip,
        tooltipCategory,
        tooltipValue,
        worldPosition,
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
        (params: CartographyParams) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const handleWorldPosition = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                worldPosition: e.target.value,
            });
        },
        [onChange, args],
    );

    const handleColorScheme = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                colorScheme: event.target.value.split(','),
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
                        <TextField
                            fullWidth
                            select
                            label={translate('world_position')}
                            value={worldPosition}
                            onChange={handleWorldPosition}
                        >
                            <MenuItem value={MAP_WORLD}>
                                {translate('world_position_world')}
                            </MenuItem>
                            <MenuItem value={MAP_EUROPE}>
                                {translate('world_position_europe')}
                            </MenuItem>
                            <MenuItem value={MAP_FRANCE}>
                                {translate('world_position_france')}
                            </MenuItem>
                        </TextField>
                        <GradientSchemeSelector
                            label={translate('color_scheme')}
                            onChange={handleColorScheme}
                            value={colorScheme}
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
            <VegaFieldPreview
                args={args}
                // @ts-expect-error TS2322
                PreviewComponent={CartographyAdminView}
                datasets={
                    worldPosition === MAP_FRANCE
                        ? [MapFranceIdValue, MapIdValue]
                        : [MapIdValue, MapFranceIdValue]
                }
            />
        </FormatGroupedFieldSet>
    );
};

export default CartographyAdmin;
