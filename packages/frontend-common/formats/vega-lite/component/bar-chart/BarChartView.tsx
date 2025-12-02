import { clamp } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import type { Field } from '../../../../fields/types';
import { useSearchPaneContextOrDefault } from '../../../../search/useSearchPaneContext';
import injectData from '../../../injectData';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import {
    AXIS_X,
    AXIS_Y,
    convertSpecTemplate,
    lodexDirectionToIdDirection,
    lodexScaleToIdScale,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import BarChart from '../../models/BarChart';

const styles = {
    container: {
        userSelect: 'none',
    },
};

interface BarChartViewProps {
    field?: Field;
    resource?: object;
    data?: {
        values: any;
    };
    colors?: string;
    direction?: string;
    orderBy?: string;
    diagonalCategoryAxis?: boolean;
    diagonalValueAxis?: boolean;
    scale?: string;
    params?: any;
    axisRoundValue?: boolean;
    tooltip?: boolean;
    tooltipCategory?: string;
    tooltipValue?: string;
    labels?: string;
    labelOverlap?: string;
    barSize?: number;
    advancedMode?: boolean;
    advancedModeSpec?: string;
    aspectRatio?: string;
}

const BarChartView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    direction,
    scale,
    colors,
    axisRoundValue,
    tooltip,
    tooltipCategory,
    tooltipValue,
    labels,
    labelOverlap,
    barSize,
    diagonalCategoryAxis,
    diagonalValueAxis,
    aspectRatio,
}: BarChartViewProps) => {
    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');
    const { filters, selectOne } = useSearchPaneContextOrDefault();

    const fieldToFilter =
        typeof field?.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
            : null;

    const handleClick = useCallback(
        (data: { _id: string }) => {
            if (fieldToFilter) {
                selectOne({
                    fieldName: fieldToFilter,
                    value: data?._id ?? null,
                });
            }
        },
        [fieldToFilter, selectOne],
    );

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    clamp((width - VEGA_ACTIONS_WIDTH) * 0.6, 300, 1200),
                );
            } catch (e) {
                // @ts-expect-error TS18046
                setError(e.message);
                return null;
            }
        }

        const selectedDatum = data?.values.find(
            (d: { _id: string }) => d._id === filters?.at(0)?.value,
        );

        const specBuilder = new BarChart({
            enableSelection: !!fieldToFilter,
        });

        specBuilder.setAxisDirection(lodexDirectionToIdDirection(direction));

        specBuilder.setScale(lodexScaleToIdScale(scale));
        specBuilder.setColor(colors);
        specBuilder.setRoundValue(axisRoundValue);
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setLabels(labels);
        specBuilder.setLabelOverlap(labelOverlap);
        specBuilder.setSize(barSize);

        if (diagonalCategoryAxis) specBuilder.setLabelAngle(AXIS_X, -45);
        if (diagonalValueAxis) specBuilder.setLabelAngle(AXIS_Y, -45);

        return specBuilder.buildSpec({
            selectedDatum,
        });
    }, [
        advancedMode,
        data?.values,
        fieldToFilter,
        direction,
        scale,
        colors,
        axisRoundValue,
        tooltip,
        tooltipCategory,
        tooltipValue,
        labels,
        labelOverlap,
        barSize,
        diagonalCategoryAxis,
        diagonalValueAxis,
        advancedModeSpec,
        width,
        filters,
    ]);

    if (!spec) {
        // @ts-expect-error TS18046
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        // @ts-expect-error TS2322
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
                // @ts-expect-error TS2322
                spec={spec}
                data={data}
                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
                aspectRatio={aspectRatio}
                onClick={handleClick}
            />
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {
            data: {
                values: [],
            },
        };
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export const BarChartAdminView = connect((_state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            // @ts-expect-error TS2339
            values: props.dataset.values ?? [],
        },
    };
    // @ts-expect-error TS2345
})(BarChartView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(BarChartView);
