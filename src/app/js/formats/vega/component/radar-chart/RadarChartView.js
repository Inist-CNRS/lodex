import React, { useEffect, useMemo, useRef, useState } from 'react';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import { CustomActionVega } from '../vega-component';
import RadarChart from '../../models/RadarChart';
import {
    lodexScaleToIdScale,
    VEGA_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';

import InvalidFormat from '../../../InvalidFormat';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const RadarChartView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    colors,
    tooltip,
    tooltipCategory,
    tooltipValue,
    scale,
}) => {
    const formattedData = useMemo(() => {
        if (!data) {
            return data;
        }

        const tmpData = {
            ...data,
        };

        tmpData.values.forEach(value => {
            value.category = 0;
        });

        return tmpData;
    }, [data]);

    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                const advancedSpec = JSON.parse(advancedModeSpec);
                return {
                    ...advancedSpec,
                    width: width - width * 0.06,
                    height: width - width * 0.24,
                };
            } catch (e) {
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new RadarChart();

        specBuilder.setColors(colors.split(' '));
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setScale(lodexScaleToIdScale(scale));

        return specBuilder.buildSpec(width, formattedData.values.length);
    }, [
        width,
        formattedData.values,
        advancedMode,
        advancedModeSpec,
        colors,
        tooltip,
        tooltipCategory,
        tooltipValue,
        scale,
    ]);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            setWidth(ref.current.offsetWidth);
        });

        resizeObserver.observe(ref.current);
    }, [ref.current]);

    if (spec === null) {
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        <div style={styles.container} ref={ref}>
            <CustomActionVega
                spec={spec}
                data={formattedData}
                injectType={VEGA_DATA_INJECT_TYPE_A}
            />
        </div>
    );
};

RadarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    scale: PropTypes.string.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

RadarChartView.defaultProps = {
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

export default compose(injectData(), connect(mapStateToProps))(RadarChartView);
