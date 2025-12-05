import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
import { clamp } from 'lodash';

import { buildPieChartSpec } from '../../models/PieChart';
import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import injectData from '../../../injectData';
import type { Field } from '../../../../fields/types';
import { useSearchPaneContextOrDefault } from '../../../../search/useSearchPaneContext';

const styles = {
    container: {
        userSelect: 'none',
    },
};

interface PieChartViewProps {
    field?: Field;
    resource?: object;
    data?: {
        values: any;
    };
    colors?: string;
    tooltip?: boolean;
    tooltipCategory?: string;
    tooltipValue?: string;
    labels?: boolean;
    advancedMode?: boolean;
    advancedModeSpec?: string;
    aspectRatio?: string;
}

const PieChartView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    tooltip,
    tooltipCategory,
    tooltipValue,
    colors,
    labels,
    aspectRatio,
}: PieChartViewProps) => {
    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');
    const { selectOne } = useSearchPaneContextOrDefault();

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

        const spec = buildPieChartSpec({
            hasTooltip: tooltip,
            tooltipCategory,
            tooltipValue,
            labels,
            colors: colors ? colors.split(' ') : undefined,
        });

        // enable the orderBy in vega-lite
        let count = 1;
        // @ts-expect-error TS7006
        data.values.forEach((entry) => {
            entry.order = count++;
        });

        return spec;
    }, [
        advancedMode,
        data?.values,
        tooltip,
        tooltipCategory,
        tooltipValue,
        labels,
        colors,
        advancedModeSpec,
        width,
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

export const PieChartAdminView = connect((_state, props) => {
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
})(PieChartView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(PieChartView);
