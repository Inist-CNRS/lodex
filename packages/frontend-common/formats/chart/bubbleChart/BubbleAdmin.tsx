import { useState, useEffect, type ChangeEvent, useCallback } from 'react';
import { TextField } from '@mui/material';

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
import { FieldSelector } from '../../../fields/form/FieldSelector';

export const defaultArgs = {
    params: {
        maxSize: 200,
        maxValue: undefined,
        minValue: undefined,
        orderBy: 'value/asc',
        uri: undefined,
    },
    fieldToFilter: null,
    diameter: 500,
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

type BubbleAdminArgs = {
    params?: RoutineParams;
    diameter?: number;
    colors?: string;
    fieldToFilter?: string | null;
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
        fieldToFilter?: string | null;
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

    const handleParams = useCallback(
        (params: RoutineParams) => {
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
                colors,
            });
        },
        [onChange, args],
    );

    const handleDiameter = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            onChange({
                ...args,
                diameter: parseInt(event.target.value, 10),
            }),
        [onChange, args],
    );

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
                <FieldSelector
                    value={args?.fieldToFilter ?? null}
                    onChange={(fieldToFilter) =>
                        onChange({
                            ...args,
                            fieldToFilter: fieldToFilter || null,
                        })
                    }
                />
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
