import { TextField } from '@mui/material';

import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../i18n/I18NContext';
import { useCallback } from 'react';

export const defaultArgs = {
    params: {
        maxSize: 5000,
        orderBy: 'value/asc',
        maxLabelLength: 25,
        labelOffset: 50,
        minimumScaleValue: 5,
        maxValue: undefined,
        minValue: undefined,
        uri: undefined,
    },
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

type HierarchyArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
        maxLabelLength?: number;
        labelOffset?: number;
        minimumScaleValue?: number;
        uri?: string;
    };
    colors?: string;
};

type HierarchyAdminProps = {
    args?: HierarchyArgs;
    onChange: (args: {
        params?: {
            maxSize?: number;
            maxValue?: number;
            minValue?: number;
            orderBy?: string;
            maxLabelLength?: number;
            labelOffset?: number;
            minimumScaleValue?: number;
            uri?: string;
        };
        colors?: string;
    }) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

const HierarchyAdmin = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = false,
    showMinValue = false,
    showOrderBy = true,
}: HierarchyAdminProps) => {
    const { translate } = useTranslate();

    const handleParams = useUpdateAdminArgs<
        HierarchyArgs,
        'params',
        Partial<HierarchyArgs['params']>
    >('params', {
        args,
        onChange,
        parseValue: (params) => ({
            ...args.params,
            ...params,
        }),
    });

    const handleColors = useUpdateAdminArgs<HierarchyArgs, 'colors', string>(
        'colors',
        {
            args,
            onChange,
            parseValue: (value) => value || defaultArgs.colors,
        },
    );

    const handleMaxLabelLength = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const maxLabelLength = parseInt(event.target.value, 10);
            handleParams({
                ...args.params,
                maxLabelLength,
            });
        },
        [args.params, handleParams],
    );

    const handleLabelOffset = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const labelOffset = parseInt(event.target.value, 10);
            handleParams({
                ...args.params,
                labelOffset,
            });
        },
        [args.params, handleParams],
    );

    const handleMinimumScaleValue = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const minimumScaleValue = parseInt(event.target.value, 10);
            handleParams({
                ...args.params,
                minimumScaleValue,
            });
        },
        [args.params, handleParams],
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
                <ColorPickerParamsAdmin
                    colors={args.colors}
                    onChange={handleColors}
                    monochromatic={true}
                />
                <TextField
                    label={translate('max_char_number_in_labels')}
                    onChange={handleMaxLabelLength}
                    value={
                        params?.maxLabelLength ||
                        defaultArgs.params.maxLabelLength
                    }
                    fullWidth
                />
                <TextField
                    label={translate('label_offset')}
                    onChange={handleLabelOffset}
                    value={
                        params?.labelOffset || defaultArgs.params.labelOffset
                    }
                    fullWidth
                />
                <TextField
                    label={translate('minimum_scale_value')}
                    onChange={handleMinimumScaleValue}
                    value={
                        params?.minimumScaleValue ||
                        defaultArgs.params.minimumScaleValue
                    }
                    fullWidth
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default HierarchyAdmin;
