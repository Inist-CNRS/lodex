import React, { useCallback } from 'react';

import { FormControlLabel, Switch } from '@mui/material';
import { FieldSelector } from '../../../fields/form/FieldSelector';
import { useTranslate } from '../../../i18n/I18NContext';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

type NetworkArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
        uri?: string;
    };
    displayWeighted?: boolean;
    colors?: string;
    fieldToFilter?: string | null;
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
        maxValue: undefined,
        minValue: undefined,
        uri: undefined,
    },
    displayWeighted: true,
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
};

const NetworkAdmin: React.FC<NetworkAdminProps> = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
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

    const handleColors = useCallback(
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
                    colors={args.colors}
                    onChange={handleColors}
                    monochromatic={true}
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default NetworkAdmin;
