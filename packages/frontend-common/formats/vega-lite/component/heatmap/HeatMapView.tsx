import { useCallback, useContext, useMemo, useState } from 'react';
import { clamp } from 'lodash';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { buildHeatMapSpec } from '../../models/HeatMap';
import {
    convertSpecTemplate,
    lodexOrderToIdOrder,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import injectData from '../../../injectData';
import type { Field } from '../../../../fields/types';
import { SearchPaneContext } from '../../../../search/SearchPaneContext';

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

    const { setFilter } = useContext(SearchPaneContext) ?? {
        setFilter: () => {},
    };

    const fieldToFilter =
        typeof field?.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
            : null;

    const handleClick = useCallback(
        (data: { source: string; target: string }) => {
            if (fieldToFilter) {
                setFilter({
                    field: fieldToFilter,
                    value: data ? [data.target, data.source] : null,
                });
            }
        },
        [fieldToFilter, setFilter],
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
            selectionEnabled: !!fieldToFilter,
        });
    }, [
        advancedMode,
        colorScheme,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
        flipAxis,
        params.orderBy,
        fieldToFilter,
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
