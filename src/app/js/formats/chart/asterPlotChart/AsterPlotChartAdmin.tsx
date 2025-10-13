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

type AsterPlotArgs = {
    params: RoutineParams;
    colors?: string;
};

type AsterPlotChartAdminProps = {
    args: AsterPlotArgs;
    onChange: (args: AsterPlotArgs) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

export const defaultArgs = {
    params: {
        maxSize: 10,
        maxValue: 100,
        minValue: 0,
        orderBy: 'value/asc',
    },
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

const AsterPlotChartAdmin = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
}: AsterPlotChartAdminProps) => {
    const handleParams = useUpdateAdminArgs<AsterPlotArgs, 'params'>('params', {
        args,
        onChange,
    });

    const handleColors = useUpdateAdminArgs<AsterPlotArgs, 'colors'>('colors', {
        args,
        onChange,
    });

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={args.params}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet defaultExpanded>
                <ColorPickerParamsAdmin
                    colors={args.colors}
                    onChange={handleColors}
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default AsterPlotChartAdmin;
