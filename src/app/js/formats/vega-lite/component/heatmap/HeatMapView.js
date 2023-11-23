import React, { useMemo, useState } from 'react';
import { CustomActionVegaLite } from '../vega-lite-component';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import HeatMap from '../../models/HeatMap';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import {
    convertSpecTemplate,
    lodexOrderToIdOrder,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../vega-utils/chartsHooks';

const styles = {
    container: {
        userSelect: 'none',
    },
};

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
}) => {
    const { ref, width, height } = useSizeObserver();
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    height,
                );
            } catch (e) {
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new HeatMap();

        specBuilder.setColor(colorScheme.join(' '));
        specBuilder.setOrderBy(lodexOrderToIdOrder(params.orderBy));
        specBuilder.flipAxis(flipAxis);
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipSource);
        specBuilder.setTooltipTarget(tooltipTarget);
        specBuilder.setTooltipValue(tooltipWeight);

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
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
                spec={spec}
                data={data}
                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
            />
        </div>
    );
};

HeatMapView.propTypes = {
    field: fieldPropTypes,
    resource: PropTypes.object,
    data: PropTypes.shape({
        values: PropTypes.any.isRequired,
    }),
    params: PropTypes.any,
    colorScheme: PropTypes.arrayOf(PropTypes.string),
    flipAxis: PropTypes.bool,
    tooltip: PropTypes.bool,
    tooltipSource: PropTypes.string,
    tooltipTarget: PropTypes.string,
    tooltipWeight: PropTypes.string,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

HeatMapView.defaultProps = {
    className: null,
};

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

export const HeatMapAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: [
                { source: 'A', target: 'A', weight: 28 },
                { source: 'A', target: 'B', weight: 55 },
                { source: 'A', target: 'C', weight: 43 },
                { source: 'B', target: 'A', weight: 15 },
                { source: 'B', target: 'B', weight: 68 },
                { source: 'B', target: 'C', weight: 45 },
                { source: 'C', target: 'A', weight: 85 },
                { source: 'C', target: 'B', weight: 32 },
                { source: 'C', target: 'C', weight: 17 },
            ],
        },
    };
})(HeatMapView);

export default compose(injectData(), connect(mapStateToProps))(HeatMapView);
