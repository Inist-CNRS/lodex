import { useContext, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { clamp } from 'lodash';

import injectData from '../../../injectData';
import {
    AXIS_X,
    AXIS_Y,
    convertSpecTemplate,
    lodexDirectionToIdDirection,
    lodexScaleToIdScale,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import BarChart from '../../models/BarChart';
import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import type { Field } from '../../../../fields/types';
import { SearchPaneContext } from '../../../../search/SearchPaneContext';

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
    params,
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
    const searchPane = useContext(SearchPaneContext);

    const fieldToFilter =
        typeof field?.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
            : null;

    const handleClick = (data: { _id: string }) => {
        if (fieldToFilter && data && data._id) {
            searchPane?.setFilter({
                field: fieldToFilter,
                value: data._id,
            });
        }
    };

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

        const specBuilder = new BarChart();

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

        // @ts-expect-error TS2554
        return specBuilder.buildSpec(width, data.values.length);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        field,
        // @ts-expect-error TS18048
        data.values,
        direction,
        params,
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
                onClick={fieldToFilter ? handleClick : undefined}
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
