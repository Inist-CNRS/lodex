import { useCallback, useMemo } from 'react';

import RoutineParamsAdmin from '../utils/components/admin/RoutineParamsAdmin';
import VegaAdvancedMode from '../utils/components/admin/VegaAdvancedMode';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../utils/components/field-set/FormatFieldSets';
import VegaFieldPreview from '../utils/components/field-set/FormatFieldSetPreview';
import { VegaLiteAdminView } from './VegaLiteView';
import { ASPECT_RATIO_16_9, type AspectRatio } from '../utils/aspectRatio';
import AspectRatioSelector from '../utils/components/admin/AspectRatioSelector';
import FormatGroupedFieldSet from '../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    specTemplate: JSON.stringify({
        background: 'transparent',
        width: 'container',
        height: 'container',
        autosize: { type: 'fit', contains: 'padding' },
        mark: 'bar',
        encoding: {
            x: { field: '_id', type: 'ordinal' },
            y: { field: 'value', type: 'quantitative' },
        },
        data: { name: 'values' },
    }),
    aspectRatio: ASPECT_RATIO_16_9,
};

type VegaLiteParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
};

type VegaliteArgs = {
    params: VegaLiteParams;
    specTemplate: string;
    aspectRatio: string;
};

type VegaLiteAdminProps = {
    args: VegaliteArgs;
    onChange: (args: VegaliteArgs) => void;
    showMaxSize: boolean;
    showMaxValue: boolean;
    showMinValue: boolean;
    showOrderBy: boolean;
};

const VegaLiteAdmin = ({
    args = defaultArgs,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    onChange,
}: VegaLiteAdminProps) => {
    const { specTemplate, aspectRatio, params } = args;

    const formattedSpecTemplate = useMemo(() => {
        try {
            return JSON.stringify(JSON.parse(specTemplate), null, 2);
        } catch (e) {
            return specTemplate;
        }
    }, [specTemplate]);

    const handleParams = useCallback(
        (params: VegaLiteParams) => onChange({ ...args, params }),
        [onChange, args],
    );

    const handleSpecTemplate = useCallback(
        (specTemplate: string) => onChange({ ...args, specTemplate }),
        [onChange, args],
    );

    const handleAspectRatio = useCallback(
        (aspectRatio: AspectRatio) => onChange({ ...args, aspectRatio }),
        [onChange, args],
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet defaultExpanded>
                <VegaAdvancedMode
                    value={formattedSpecTemplate}
                    onChange={handleSpecTemplate}
                />
                <AspectRatioSelector
                    value={aspectRatio}
                    onChange={handleAspectRatio}
                />
            </FormatChartParamsFieldSet>
            <VegaFieldPreview
                args={args}
                // @ts-expect-error TS2322
                PreviewComponent={VegaLiteAdminView}
            />
        </FormatGroupedFieldSet>
    );
};

export default VegaLiteAdmin;
