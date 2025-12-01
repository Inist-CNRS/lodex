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
import { buildHeatMapSpec } from '../../models/HeatMap';

const styles = {
    container: {
        userSelect: 'none',
    },
};

interface HeatMapViewProps {
    field?: Field;
    resource?: Field;
    data?: {
        values: any;
    };
    params?: any;
    colorScheme?: string[];
    flipAxis?: boolean;
    tooltip?: boolean;
    tooltipSource?: string;
    tooltipTarget?: string;
    tooltipWeight?: string;
    advancedMode?: boolean;
    advancedModeSpec?: string;
    aspectRatio?: string;
}

const HeatMapView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    colorScheme,
    params,
    flipAxis,
    tooltip,
    tooltipSource,
    tooltipTarget,
    tooltipWeight,
    aspectRatio,
}: HeatMapViewProps) => {
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

        return buildHeatMapSpec({
            colors: colorScheme || [],
            tooltip: {
                toggle: tooltip || false,
                sourceTitle: tooltipSource,
                targetTitle: tooltipTarget,
                weightTitle: tooltipWeight,
            },
            flip: flipAxis || false,
            orderBy: lodexOrderToIdOrder(params.orderBy),
            selectionEnabled: !!fieldToFilterColumn || !!fieldToFilterRow,
            selectedDatum,
        });
    }, [
        advancedMode,
        data?.values,
        colorScheme,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
        flipAxis,
        params.orderBy,
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

export const HeatMapAdminView = connect((_state, props) => {
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
})(HeatMapView);

export default compose<HeatMapViewProps, HeatMapViewProps>(
    injectData(),
    connect(mapStateToProps),
)(HeatMapView);
