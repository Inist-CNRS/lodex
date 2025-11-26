import {
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import React, { useCallback, type ChangeEvent } from 'react';

import { FieldSelector } from '../../../fields/form/FieldSelector';
import { ColorPickerInput } from '../../../form-fields/ColorPickerInput';
import { useTranslate } from '../../../i18n/I18NContext';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { ColorScaleGroup } from './ColorScaleGroup';
import { type ColorScaleItemMaybe } from './ColorScaleInput';

type NetworkArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
        uri?: string;
    };
    displayWeighted?: boolean;
    zoomAdjustNodeSize?: boolean;
    minRadius?: number;
    maxRadius?: number;
    colors?: string;
    fieldToFilter?: string | null;
    isAdvancedColorMode?: boolean;
    colorScale?: ColorScaleItemMaybe[];
};

export const defaultArgs: NetworkArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
        maxValue: undefined,
        minValue: undefined,
        uri: undefined,
    },
    displayWeighted: true,
    zoomAdjustNodeSize: false,
    minRadius: 1,
    maxRadius: 20,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    fieldToFilter: null,
};

type NetworkAdminProps = {
    args?: NetworkArgs;
    onChange: (args: NetworkArgs) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
    format?: string;
};

const NetworkAdmin: React.FC<NetworkAdminProps> = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    format,
}) => {
    const { translate } = useTranslate();

    const handleParams = useCallback(
        (params: NetworkArgs['params']) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const handleChangeDisplayWeighted = useCallback(
        (_: unknown, checked: boolean) => {
            onChange({
                ...args,
                displayWeighted: checked,
            });
        },
        [onChange, args],
    );

    const handleChangeZoomAdjustNodeSize = useCallback(
        (_: unknown, checked: string) => {
            onChange({
                ...args,
                zoomAdjustNodeSize: checked === 'true',
            });
        },
        [onChange, args],
    );

    const handleChangeMinRadius = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                minRadius: Number(e.target.value),
            });
        },
        [onChange, args],
    );

    const handleChangeMaxRadius = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                maxRadius: Number(e.target.value),
            });
        },
        [onChange, args],
    );

    const handleToggleAdvancedColors = useCallback(
        (isAdvancedColorMode: boolean) => {
            onChange({
                ...args,
                isAdvancedColorMode,
            });
        },
        [onChange, args],
    );

    const handleColorScaleChange = useCallback(
        (colorScale: ColorScaleItemMaybe[]) => {
            onChange({
                ...args,
                colorScale,
            });
        },
        [onChange, args],
    );

    const handleDefaultColorChange = useCallback(
        (colors: string) => {
            onChange({
                ...args,
                colors,
            });
        },
        [onChange, args],
    );

    const { params } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={{
                        ...defaultArgs.params,
                        ...params,
                    }}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                    showUri={false}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet defaultExpanded>
                <FormControlLabel
                    control={<Switch defaultChecked />}
                    checked={args.displayWeighted ?? true}
                    onChange={handleChangeDisplayWeighted}
                    label={translate('display_weighted')}
                />
                <FormControl fullWidth>
                    <FormLabel>{translate('zoom_adjust_node_size')}</FormLabel>
                    <RadioGroup
                        value={args.zoomAdjustNodeSize ?? false}
                        onChange={handleChangeZoomAdjustNodeSize}
                    >
                        <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label={translate('zoom_adapt_radius')}
                        />
                        <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label={translate('zoom_fixed_radius')}
                        />
                    </RadioGroup>
                </FormControl>
                <TextField
                    type="number"
                    label={translate('minRadius')}
                    sx={{
                        flex: 1,
                    }}
                    onChange={handleChangeMinRadius}
                    value={args.minRadius}
                />
                <TextField
                    type="number"
                    label={translate('maxRadius')}
                    sx={{
                        flex: 1,
                    }}
                    onChange={handleChangeMaxRadius}
                    value={args.maxRadius}
                />
                <FieldSelector
                    value={args?.fieldToFilter ?? null}
                    onChange={(fieldToFilter) =>
                        onChange({
                            ...args,
                            fieldToFilter: fieldToFilter || null,
                        })
                    }
                />

                <FormGroup
                    aria-label={translate('Color')}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
                    <Typography variant="h3" sx={{ fontSize: '1rem' }}>
                        {translate('Color')}
                    </Typography>

                    {format === 'network' && (
                        <ColorScaleGroup
                            isAdvancedColorMode={args.isAdvancedColorMode}
                            colorScale={args.colorScale}
                            handleToggleAdvancedColors={
                                handleToggleAdvancedColors
                            }
                            handleColorScaleChange={handleColorScaleChange}
                        />
                    )}

                    <ColorPickerInput
                        label={translate('default_color')}
                        value={args.colors}
                        onChange={handleDefaultColorChange}
                    />
                </FormGroup>
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default NetworkAdmin;
