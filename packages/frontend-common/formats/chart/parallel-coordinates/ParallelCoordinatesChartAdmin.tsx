import { useCallback } from 'react';
import RoutineParamsAdmin, {
    type RoutineParams,
} from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import { translate } from '../../../i18n/I18NContext';

type ParallelCoordinatesChartArgs = {
    params: RoutineParams;
    colors?: string;
};

type ParallelCoordinatesChartAdminProps = {
    args?: ParallelCoordinatesChartArgs;
    onChange: (args: ParallelCoordinatesChartArgs) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
};

export const defaultArgs = {
    params: {
        maxSize: 20,
        maxValue: 100,
        minValue: 0,
    },
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

const ParallelCoordinatesChartAdmin = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
}: ParallelCoordinatesChartAdminProps) => {
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

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={args.params}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={false}
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

export default translate(ParallelCoordinatesChartAdmin);
