import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { field as fieldPropTypes } from '../../../../propTypes';
import {
    AXIS_HORIZONTAL,
    AXIS_VERTICAL,
    AXIS_X,
    AXIS_Y,
    lodexOrderToIdOrder,
    lodexScaleToIdScale,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';
import BarChart from '../../models/BarChart';
import { CustomActionVegaLite } from '../vega-lite-component';
import InvalidFormat from '../../../InvalidFormat';
import { VEGA_ACTIONS_WIDTH } from '../vega-lite-component/VegaLiteComponent';

const styles = {
    container: {
        userSelect: 'none',
    },
};

const BarChartView = props => {
    const {
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
    } = props;

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

        const specBuilder = new BarChart();

        specBuilder.setAxisDirection(
            direction === 'vertical' ? AXIS_VERTICAL : AXIS_HORIZONTAL,
        );

        specBuilder.setOrderBy(lodexOrderToIdOrder(params.orderBy));
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

        return specBuilder.buildSpec(width, data.values.length);
    }, [width, advancedMode, advancedModeSpec, field, data.values]);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            setWidth(ref.current.offsetWidth);
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

BarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    diagonalCategoryAxis: PropTypes.bool.isRequired,
    diagonalValueAxis: PropTypes.bool.isRequired,
    scale: PropTypes.string.isRequired,
    params: PropTypes.any.isRequired,
    axisRoundValue: PropTypes.bool.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    labels: PropTypes.string.isRequired,
    labelOverlap: PropTypes.string.isRequired,
    barSize: PropTypes.number.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

BarChartView.defaultProps = {
    className: null,
};

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

export default compose(injectData(), connect(mapStateToProps))(BarChartView);
