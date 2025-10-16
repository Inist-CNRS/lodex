import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatDataParamsFieldSet,
    FormatChartParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../i18n/I18NContext';
import { TextField } from '@mui/material';
import { useCallback, type ChangeEvent } from 'react';

type LeafletArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
    };
    zoom?: number;
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    zoom: 5,
};

type LeafletAdminProps = {
    args?: LeafletArgs;
    onChange: (args: {
        params?: {
            maxSize?: number;
            maxValue?: number;
            minValue?: number;
            orderBy?: string;
        };
        zoom?: number;
    }) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

const LeafletAdmin = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
}: LeafletAdminProps) => {
    const { translate } = useTranslate();

    const handleParams = useCallback(
        (params: LeafletArgs['params']) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const handleZoom = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                zoom: event.target.value
                    ? Number(event.target.value)
                    : undefined,
            });
        },
        [onChange, args],
    );

    const { zoom } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={args.params || defaultArgs.params}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet defaultExpanded>
                <TextField
                    label={translate('zoomByDefault')}
                    onChange={handleZoom}
                    value={zoom}
                    fullWidth
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default LeafletAdmin;
