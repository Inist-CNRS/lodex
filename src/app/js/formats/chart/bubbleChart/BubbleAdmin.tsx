import React, { useState, useEffect, useCallback } from 'react';
import { TextField } from '@mui/material';

import updateAdminArgs from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
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

type BubbleAdminProps = {
    args?: {
        params?: {
            maxSize?: number;
            maxValue?: number;
            minValue?: number;
            orderBy?: string;
            uri?: string;
        };
        diameter?: number;
        colors?: string;
    };
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

    const handleParams = useCallback(
        (params: {
            maxSize?: number;
            maxValue?: number;
            minValue?: number;
            orderBy?: string;
        }) => updateAdminArgs('params', params, { args, onChange }),
        [args, onChange],
    );

    const handleColors = useCallback(
        (newColors: string) => {
            setColors(newColors);
            updateAdminArgs('colors', newColors, { args, onChange });
        },
        [args, onChange, setColors],
    );

    const handleDiameter = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateAdminArgs('diameter', e.target.value, { args, onChange });
        },
        [args, onChange],
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
