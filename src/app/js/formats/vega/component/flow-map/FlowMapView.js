import React, { useEffect, useMemo, useRef, useState } from 'react';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../../propTypes';
import PropTypes from 'prop-types';
import { CustomActionVega } from '../vega-component';
import FlowMap from '../../models/FlowMap';
import { VEGA_DATA_INJECT_TYPE_B } from '../../../chartsUtils';
import { schemeBlues } from 'd3-scale-chromatic';
import MouseIcon from '../../../shared/MouseIcon';
import InvalidFormat from '../../../InvalidFormat';
import { VEGA_ACTIONS_WIDTH } from '../../../vega-lite/component/vega-lite-component/VegaLiteComponent';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const FlowMapView = props => {
    const {
        advancedMode,
        advancedModeSpec,
        p,
        field,
        data,
        tooltip,
        tooltipCategory,
        tooltipValue,
        color,
        colorScheme,
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
                    height: width * 0.6,
                };
            } catch (e) {
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new FlowMap();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(color.split(' ')[0]);
        specBuilder.setColorScheme(
            colorScheme !== undefined ? colorScheme : schemeBlues[9].split(' '),
        );

        return specBuilder.buildSpec(width, data.values.length);
    }, [
        width,
        data.values,
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipCategory,
        tooltipValue,
        color,
        colorScheme,
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
                data={data}
                injectType={VEGA_DATA_INJECT_TYPE_B}
            />
            <MouseIcon polyglot={p} />
        </div>
    );
};

FlowMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

FlowMapView.defaultProps = {
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

export default compose(injectData(), connect(mapStateToProps))(FlowMapView);
