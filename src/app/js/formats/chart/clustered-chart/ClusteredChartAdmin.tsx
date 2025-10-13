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
import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';

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

    const handleParams = useUpdateAdminArgs<ClusterChartArgs, 'params'>(
        'params',
        {
            args,
            onChange,
        },
    );

    const handleColors = useUpdateAdminArgs<ClusterChartArgs, 'colors'>(
        'colors',
        {
            args,
            onChange,
        },
    );

    const handleXAxisTitle = useUpdateAdminArgs<ClusterChartArgs, 'xTitle'>(
        'xTitle',
        {
            args,
            onChange,
        },
    );

    const handleYAxisTitle = useUpdateAdminArgs<ClusterChartArgs, 'yTitle'>(
        'yTitle',
        {
            args,
            onChange,
        },
    );

    const toggleFlipAxis = useUpdateAdminArgs<ClusterChartArgs, 'flipAxis'>(
        'flipAxis',
        {
            args,
            onChange,
        },
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
                            onChange={(e) => toggleFlipAxis(e.target.checked)}
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
                    onChange={(e) => handleXAxisTitle(e.target.value)}
                    value={xTitle}
                />
                <TextField
                    fullWidth
                    label={translate('format_y_axis_title')}
                    onChange={(e) => handleYAxisTitle(e.target.value)}
                    value={yTitle}
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default ClusteredChartAdmin;
