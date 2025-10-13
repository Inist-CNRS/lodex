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

    const updateParams = useUpdateAdminArgs<HierarchyArgs, 'params'>('params', {
        args,
        onChange,
    });

    const handleParams = (params: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
        maxLabelLength?: number;
        labelOffset?: number;
        minimumScaleValue?: number;
        uri?: string;
    }) => {
        const newParams = {
            ...args.params,
            ...params,
        };
        updateParams(newParams);
    };

    const updateColors = useUpdateAdminArgs<HierarchyArgs, 'colors'>('colors', {
        args,
        onChange,
    });

    const handleColors = (newColors: string) => {
        const color = newColors.split(' ')[0] || defaultArgs.colors;
        updateColors(color);
    };

    const handleMaxLabelLength = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const maxLabelLength = parseInt(event.target.value, 10);
        handleParams({
            ...args.params,
            maxLabelLength,
        });
    };

    const handleLabelOffset = (event: React.ChangeEvent<HTMLInputElement>) => {
        const labelOffset = parseInt(event.target.value, 10);
        handleParams({
            ...args.params,
            labelOffset,
        });
    };

    const handleMinimumScaleValue = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const minimumScaleValue = parseInt(event.target.value, 10);
        handleParams({
            ...args.params,
            minimumScaleValue,
        });
    };

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
