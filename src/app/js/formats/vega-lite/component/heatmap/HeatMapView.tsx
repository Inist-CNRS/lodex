import { useMemo, useState } from 'react';
import { clamp } from 'lodash';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import HeatMap from '../../models/HeatMap';
import { type Field } from '../../../../propTypes';
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

const styles = {
    container: {
        userSelect: 'none',
    },
};

interface HeatMapViewProps {
    field?: unknown;
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

        const specBuilder = new HeatMap();

        // @ts-expect-error TS18048
        specBuilder.setColor(colorScheme.join(' '));
        specBuilder.setOrderBy(lodexOrderToIdOrder(params.orderBy));
        specBuilder.flipAxis(flipAxis);
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipSource);
        specBuilder.setTooltipTarget(tooltipTarget);
        specBuilder.setTooltipValue(tooltipWeight);

        // @ts-expect-error TS2554
        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        field,
        colorScheme,
        params,
        flipAxis,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
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
})(HeatMapView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(HeatMapView);
