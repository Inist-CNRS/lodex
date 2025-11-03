import React, { useCallback } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    size: 4,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    params: {
        maxSize: 200,
    },
};

type EmphasedNumberParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
};

type EmphasedNumberArgs = {
    size?: number;
    colors?: string;
    params?: EmphasedNumberParams;
};

type EmphasedNumberAdminProps = {
    args?: EmphasedNumberArgs;
    onChange: (args: EmphasedNumberArgs) => void;
};

const EmphasedNumberAdmin = ({
    args = defaultArgs,
    onChange,
}: EmphasedNumberAdminProps) => {
    const { translate } = useTranslate();

    const handleSize = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                size: parseInt(event.target.value, 10),
            });
        },
        [onChange, args],
    );

    const handleColorsChange = useCallback(
        (colors: string) => {
            onChange({
                ...args,
                colors: colors.split(' ')[0]!,
            });
        },
        [onChange, args],
    );

    const handleParams = useCallback(
        (params: EmphasedNumberParams) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const { size = defaultArgs.size, params = defaultArgs.params } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params}
                    onChange={handleParams}
                    showMaxSize={true}
                    showMaxValue={true}
                    showMinValue={true}
                    showOrderBy={false}
                />
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('list_format_select_size')}
                    onChange={handleSize}
                    value={size}
                    variant="standard"
                >
                    <MenuItem value={1}>{translate('size1')}</MenuItem>
                    <MenuItem value={2}>{translate('size2')}</MenuItem>
                    <MenuItem value={3}>{translate('size3')}</MenuItem>
                    <MenuItem value={4}>{translate('size4')}</MenuItem>
                </TextField>
                <ColorPickerParamsAdmin
                    colors={args.colors}
                    onChange={handleColorsChange}
                    monochromatic={true}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default EmphasedNumberAdmin;
