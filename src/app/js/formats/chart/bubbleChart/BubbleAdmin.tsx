import { useState, useEffect, type ChangeEvent } from 'react';
import { TextField } from '@mui/material';

import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import RoutineParamsAdmin, {
    type RoutineParams,
} from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    params: {
        maxSize: 200,
        maxValue: undefined,
        minValue: undefined,
        orderBy: 'value/asc',
        uri: undefined,
    },
    diameter: 500,
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

type BubbleAdminArgs = {
    params?: RoutineParams;
    diameter?: number;
    colors?: string;
};

type BubbleAdminProps = {
    args?: BubbleAdminArgs;
    onChange: (args: {
        params?: {
            maxSize?: number;
            maxValue?: number;
            minValue?: number;
            orderBy?: string;
            uri?: string;
        };
        diameter?: number;
        colors?: string;
    }) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

const BubbleAdmin = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
}: BubbleAdminProps) => {
    const { translate } = useTranslate();
    const [colors, setColors] = useState<string>(
        args.colors || defaultArgs.colors,
    );

    useEffect(() => {
        setColors(args.colors || defaultArgs.colors);
    }, [args.colors]);

    const handleParams = useUpdateAdminArgs<BubbleAdminArgs, 'params'>(
        'params',
        {
            args,
            onChange,
        },
    );

    const handleColors = useUpdateAdminArgs<BubbleAdminArgs, 'colors'>(
        'colors',
        {
            args,
            onChange,
        },
    );

    const handleDiameter = useUpdateAdminArgs<
        BubbleAdminArgs,
        'diameter',
        ChangeEvent<HTMLInputElement>
    >('diameter', {
        args,
        onChange,
        parseValue: (event) => parseInt(event.target.value, 10),
    });

    const { params, diameter } = args;

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
                    colors={colors}
                    onChange={handleColors}
                />
                <TextField
                    label={translate('diameter')}
                    onChange={handleDiameter}
                    value={diameter}
                    fullWidth
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default BubbleAdmin;
