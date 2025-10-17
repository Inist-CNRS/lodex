import { Checkbox, FormControlLabel, TextField } from '@mui/material';

import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import RoutineParamsAdmin, {
    type RoutineParams,
} from '../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../i18n/I18NContext';
import { useCallback, type ChangeEvent } from 'react';

type ClusterChartArgs = {
    params: RoutineParams;
    colors?: string;
    xTitle?: string;
    yTitle?: string;
    flipAxis?: boolean;
};

export const defaultArgs: ClusterChartArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    flipAxis: false,
};

type ClusteredChartAdminProps = {
    args?: ClusterChartArgs;
    onChange: (args: ClusterChartArgs) => void;
};

const ClusteredChartAdmin = (props: ClusteredChartAdminProps) => {
    const { translate } = useTranslate();
    const { args = defaultArgs, onChange } = props;
    const { params, colors, xTitle, yTitle, flipAxis } = args;

    const handleParams = useCallback(
        (params: RoutineParams) => onChange({ ...args, params }),
        [onChange, args],
    );

    const handleColors = useCallback(
        (colors: string) => onChange({ ...args, colors }),
        [onChange, args],
    );

    const handleXAxisTitle = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                xTitle: event.target.value,
            });
        },
        [onChange, args],
    );

    const handleYAxisTitle = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                yTitle: event.target.value,
            });
        },
        [onChange, args],
    );

    const toggleFlipAxis = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                flipAxis: event.target.checked,
            });
        },
        [onChange, args],
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params}
                    onChange={handleParams}
                    showMaxSize
                    showMaxValue
                    showMinValue
                    showOrderBy
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet defaultExpanded>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={toggleFlipAxis}
                            checked={flipAxis}
                        />
                    }
                    label={translate('flip_axis')}
                />
                <ColorPickerParamsAdmin
                    colors={colors}
                    onChange={handleColors}
                />
                <TextField
                    fullWidth
                    label={translate('format_x_axis_title')}
                    onChange={handleXAxisTitle}
                    value={xTitle}
                />
                <TextField
                    fullWidth
                    label={translate('format_y_axis_title')}
                    onChange={handleYAxisTitle}
                    value={yTitle}
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default ClusteredChartAdmin;
