import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CustomActionVegaLite } from '../vega-lite-component';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import HeatMap from '../../models/HeatMap';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import {
    lodexOrderToIdOrder,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { VEGA_ACTIONS_WIDTH } from '../vega-lite-component/VegaLiteComponent';

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
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                const advancedSpec = JSON.parse(advancedModeSpec);
                return {
                    ...advancedSpec,
                    width: width - VEGA_ACTIONS_WIDTH,
                };
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

    useEffect(() => {
        if (!ref || !ref.current) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            try {
                setWidth(ref.current.offsetWidth);
                // eslint-disable-next-line no-empty
            } catch (e) {}
        });

        resizeObserver.observe(ref.current);
    }, [ref.current]);

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
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    params: PropTypes.any.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    flipAxis: PropTypes.bool.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipSource: PropTypes.string.isRequired,
    tooltipTarget: PropTypes.string.isRequired,
    tooltipWeight: PropTypes.string.isRequired,
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

export default compose(injectData(), connect(mapStateToProps))(HeatMapView);
