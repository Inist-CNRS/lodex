import {
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from '@mui/material';
import { useCallback } from 'react';
import { ColorPickerInput } from '../../../form-fields/ColorPickerInput';
import { useTranslate } from '../../../i18n/I18NContext';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import {
    DEFAULT_DEPTH,
    DEFAULT_MAXIMUM_SCALE_VALUE,
    DEFAULT_MINIMUM_SCALE_VALUE,
    DEFAULT_NODE_HEIGHT,
    DEFAULT_NODE_WIDTH,
    DEFAULT_ORIENTATION,
    DEFAULT_SPACE_BETWEEN_NODES,
    DEFAULT_ZOOM,
} from './const';

export const defaultArgs: HierarchicalTreeArgs = {
    params: {
        maxSize: 5000,
        orderBy: 'value/asc',
        maxValue: undefined,
        minValue: undefined,
        uri: undefined,
    },
    orientation: DEFAULT_ORIENTATION,
    nodeWidth: DEFAULT_NODE_WIDTH,
    nodeHeight: DEFAULT_NODE_HEIGHT,
    spaceBetweenNodes: DEFAULT_SPACE_BETWEEN_NODES,

    initialZoom: DEFAULT_ZOOM,
    initialDepth: DEFAULT_DEPTH,

    minimumScaleValue: DEFAULT_MINIMUM_SCALE_VALUE,
    maximumScaleValue: DEFAULT_MAXIMUM_SCALE_VALUE,

    colors: '#000000',
};

export default function HierarchicalTreeAdmin({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = false,
    showMinValue = false,
    showOrderBy = true,
}: HierarchicalTreeAdminProps) {
    const { translate } = useTranslate();

    const {
        params,
        orientation,
        nodeWidth,
        nodeHeight,
        spaceBetweenNodes,
        initialZoom,
        initialDepth,

        minimumScaleValue,
        maximumScaleValue,
        colors,
    } = {
        params: {
            ...defaultArgs.params,
            ...args.params,
        },
        ...defaultArgs,
        ...args,
    };

    const handleParamsChange = useCallback(
        (params: Partial<HierarchicalTreeArgs['params']>) => {
            onChange({
                ...args,
                params: {
                    ...args.params,
                    ...params,
                },
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

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params}
                    onChange={handleParamsChange}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                    showUri={false}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet defaultExpanded>
                <Stack
                    sx={{ width: '100%', alignItems: 'center' }}
                    direction="row"
                    gap="4rem"
                >
                    <FormLabel>{translate('orientation')}</FormLabel>
                    <RadioGroup
                        value={orientation}
                        onChange={(_e, orientation) => {
                            onChange({
                                ...args,
                                orientation:
                                    orientation as HierarchicalTreeArgs['orientation'],
                            });
                        }}
                        sx={{
                            flexDirection: 'row',
                            gap: '1rem',
                        }}
                        aria-label={translate('orientation')}
                    >
                        <FormControlLabel
                            value="horizontal"
                            control={<Radio />}
                            label={translate('orientation_horizontal')}
                        />
                        <FormControlLabel
                            value="vertical"
                            control={<Radio />}
                            label={translate('orientation_vertical')}
                        />
                    </RadioGroup>
                </Stack>

                <Stack direction="row" gap="1rem" sx={{ width: '100%' }}>
                    <TextField
                        type="number"
                        label={translate('node_width')}
                        value={nodeWidth?.toString() ?? ''}
                        onChange={(e) => {
                            onChange({
                                ...args,
                                nodeWidth: e.target.value
                                    ? Number.parseInt(e.target.value, 10)
                                    : null,
                            });
                        }}
                        fullWidth
                    />
                    <TextField
                        type="number"
                        label={translate('node_height')}
                        value={nodeHeight?.toString() ?? ''}
                        onChange={(e) => {
                            onChange({
                                ...args,
                                nodeHeight: e.target.value
                                    ? Number.parseInt(e.target.value, 10)
                                    : null,
                            });
                        }}
                        fullWidth
                    />
                    <TextField
                        type="number"
                        label={translate('space_between_nodes')}
                        value={spaceBetweenNodes?.toString() ?? ''}
                        onChange={(e) => {
                            onChange({
                                ...args,
                                spaceBetweenNodes: e.target.value
                                    ? Number.parseInt(e.target.value, 10)
                                    : null,
                            });
                        }}
                        fullWidth
                    />
                </Stack>

                <Stack direction="row" gap="1rem" sx={{ width: '100%' }}>
                    <TextField
                        type="number"
                        inputProps={{ step: '0.05' }}
                        label={translate('initial_zoom')}
                        value={initialZoom?.toString() ?? ''}
                        onChange={(e) => {
                            onChange({
                                ...args,
                                initialZoom: e.target.value
                                    ? Number.parseFloat(e.target.value)
                                    : null,
                            });
                        }}
                        fullWidth
                    />

                    <TextField
                        type="number"
                        label={translate('initial_depth')}
                        value={initialDepth?.toString() ?? ''}
                        onChange={(e) => {
                            onChange({
                                ...args,
                                initialDepth: e.target.value
                                    ? Number.parseInt(e.target.value, 10)
                                    : null,
                            });
                        }}
                        fullWidth
                    />
                </Stack>

                <Stack direction="row" gap="1rem" sx={{ width: '100%' }}>
                    <TextField
                        type="number"
                        inputProps={{ step: '0.1' }}
                        label={translate('minimum_scale_value')}
                        value={minimumScaleValue?.toString() ?? ''}
                        onChange={(e) => {
                            onChange({
                                ...args,
                                minimumScaleValue: e.target.value
                                    ? Number.parseFloat(e.target.value)
                                    : null,
                            });
                        }}
                        fullWidth
                    />
                    <TextField
                        type="number"
                        inputProps={{ step: '0.1' }}
                        label={translate('maximum_scale_value')}
                        value={maximumScaleValue?.toString() ?? ''}
                        onChange={(e) => {
                            onChange({
                                ...args,
                                maximumScaleValue: e.target.value
                                    ? Number.parseFloat(e.target.value)
                                    : null,
                            });
                        }}
                        fullWidth
                    />
                </Stack>

                <ColorPickerInput
                    label={translate('default_color')}
                    value={colors ?? ''}
                    onChange={handleDefaultColorChange}
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
}

type HierarchicalTreeAdminProps = {
    args?: HierarchicalTreeArgs;
    onChange(args: HierarchicalTreeArgs): void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

type HierarchicalTreeArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
        uri?: string;
    };
    orientation?: 'horizontal' | 'vertical';
    nodeWidth?: number | null;
    nodeHeight?: number | null;
    spaceBetweenNodes?: number | null;
    initialZoom?: number | null;
    initialDepth?: number | null;
    minimumScaleValue?: number | null;
    maximumScaleValue?: number | null;
    colors?: string;
};
