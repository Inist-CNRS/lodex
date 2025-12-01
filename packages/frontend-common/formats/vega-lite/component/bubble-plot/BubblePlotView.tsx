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
    convertSpecTemplate,
    lodexOrderToIdOrder,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import { buildBubblePlotSpec } from '../../models/BubblePlot';

const styles = {
    container: {
        userSelect: 'none',
    },
};

interface BubblePlotViewProps {
    field?: Field;
    resource?: object;
    data?: {
        values: any;
    };
    params?: any;
    colors?: string;
    flipAxis?: boolean;
    tooltip?: boolean;
    tooltipSource?: string;
    tooltipTarget?: string;
    tooltipWeight?: string;
    advancedMode?: boolean;
    advancedModeSpec?: string;
    aspectRatio?: string;
}

const BubblePlotView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    colors,
    params,
    flipAxis,
    tooltip,
    tooltipSource,
    tooltipTarget,
    tooltipWeight,
    aspectRatio,
}: BubblePlotViewProps) => {
    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');

    const { filters, selectOne, selectMany, clearFilters } =
        useSearchPaneContextOrDefault();

    const fieldToFilterColumn =
        typeof field?.format?.args?.fieldToFilterColumn === 'string'
            ? field.format.args.fieldToFilterColumn
            : null;

    const fieldToFilterRow =
        typeof field?.format?.args?.fieldToFilterRow === 'string'
            ? field.format.args.fieldToFilterRow
            : null;

    const handleClick = useCallback(
        (data: { source: string; target: string }) => {
            if (!data?.source || !data?.target) {
                clearFilters();
                return;
            }

            if (fieldToFilterColumn && fieldToFilterRow) {
                selectMany(
                    {
                        field: fieldToFilterColumn,
                        value: data.source,
                    },
                    {
                        field: fieldToFilterRow,
                        value: data.target,
                    },
                );
            } else if (fieldToFilterColumn) {
                selectOne({
                    field: fieldToFilterColumn,
                    value: data.source,
                });
            } else if (fieldToFilterRow) {
                selectOne({
                    field: fieldToFilterRow,
                    value: data.target,
                });
            }
        },
        [
            fieldToFilterColumn,
            fieldToFilterRow,
            selectOne,
            selectMany,
            clearFilters,
        ],
    );

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    clamp(width - VEGA_ACTIONS_WIDTH, 300, 1200),
                );
            } catch (e) {
                // @ts-expect-error TS18046
                setError(e.message);
                return null;
            }
        }

        const filter = filters?.at(0);
        const selectedDatum = data?.values.find(
            ({ source, target }: { source: string; target: string }) =>
                filter?.value?.[0] === target && filter?.value?.[1] === source,
        );

        return buildBubblePlotSpec({
            colors: colors ? colors.split(' ') : [],
            orderBy: lodexOrderToIdOrder(params?.orderBy),
            flip: flipAxis || false,
            tooltip: {
                toggle: tooltip || false,
                sourceTitle: tooltipSource,
                targetTitle: tooltipTarget,
                weightTitle: tooltipWeight,
            },
            selectionEnabled: !!fieldToFilterColumn || !!fieldToFilterRow,
            selectedDatum,
        });
    }, [
        advancedMode,
        data?.values,
        colors,
        params?.orderBy,
        flipAxis,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
        fieldToFilterColumn,
        fieldToFilterRow,
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
        return {};
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export const BubblePlotAdminView = connect((_state, props) => {
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
})(BubblePlotView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(BubblePlotView);
