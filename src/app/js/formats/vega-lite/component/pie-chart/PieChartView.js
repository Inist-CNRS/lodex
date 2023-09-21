import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PieChart from '../../models/PieChart';
import { CustomActionVegaLite } from '../vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A } from '../../../chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { VEGA_ACTIONS_WIDTH } from '../vega-lite-component/VegaLiteComponent';

const styles = {
    container: {
        userSelect: 'none',
    },
};

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

        const specBuilder = new PieChart();

        // enable the orderBy in vega-lite
        let count = 1;
        data.values.forEach(entry => {
            entry.order = count++;
        });

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(colors);
        specBuilder.setLabels(labels);

        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        field,
        tooltip,
        tooltipCategory,
        tooltipValue,
        colors,
        labels,
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

PieChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    labels: PropTypes.bool.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

PieChartView.defaultProps = {
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

export default compose(injectData(), connect(mapStateToProps))(PieChartView);
