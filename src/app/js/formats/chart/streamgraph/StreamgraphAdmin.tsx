import { TextField } from '@mui/material';
import { useTranslate } from '../../../i18n/I18NContext';

import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH } from '../../utils/colorUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import type { ChangeEvent } from 'react';

type StreamgraphArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
        uri?: string;
    };
    colors?: string;
    maxLegendLength?: number;
    height?: number;
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/desc',
        maxValue: undefined,
        minValue: undefined,
        uri: undefined,
    },
    colors: MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH,
    maxLegendLength: 30,
    height: 300,
};

type StreamgraphAdminProps = {
    args?: StreamgraphArgs;
    onChange: (args: StreamgraphArgs) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

const StreamgraphAdmin = ({
    args = defaultArgs,
    onChange,
    showMaxSize = true,
    showMaxValue = false,
    showMinValue = false,
    showOrderBy = true,
}: StreamgraphAdminProps) => {
    const { translate } = useTranslate();

    const handleParams = useUpdateAdminArgs<StreamgraphArgs, 'params'>(
        'params',
        {
            args,
            onChange,
        },
    );

    const handleColors = useUpdateAdminArgs<StreamgraphArgs, 'colors', string>(
        'colors',
        {
            args,
            onChange,
            parseValue: (value) => value || defaultArgs.colors,
        },
    );

    const handleMaxLegendLength = useUpdateAdminArgs<
        StreamgraphArgs,
        'maxLegendLength',
        ChangeEvent<HTMLInputElement>
    >('maxLegendLength', {
        args,
        onChange,
        parseValue: (event) => parseInt(event.target.value, 10),
    });

    const handleHeight = useUpdateAdminArgs<
        StreamgraphArgs,
        'height',
        ChangeEvent<HTMLInputElement>
    >('height', {
        args,
        onChange,
        parseValue: (event) => parseInt(event.target.value, 10),
    });

    const { params, maxLegendLength, height } = args;

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
                    colors={args.colors}
                    onChange={handleColors}
                />
                <TextField
                    label={translate('max_char_number_in_legends')}
                    onChange={handleMaxLegendLength}
                    value={maxLegendLength || defaultArgs.maxLegendLength}
                    fullWidth
                />
                <TextField
                    label={translate('height_px')}
                    onChange={handleHeight}
                    value={height || defaultArgs.height}
                    fullWidth
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default StreamgraphAdmin;
