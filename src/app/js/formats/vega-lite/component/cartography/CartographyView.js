import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { CustomActionVegaLite } from '../vega-lite-component';
import {
    MAP_FRANCE,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../../chartsUtils';
import { field as fieldPropTypes } from '../../../../propTypes';
import injectData from '../../../injectData';
import Cartography from '../../models/Cartography';
import { schemeOrRd } from 'd3-scale-chromatic';
import InvalidFormat from '../../../InvalidFormat';
import { VEGA_ACTIONS_WIDTH } from '../vega-lite-component/VegaLiteComponent';

const styles = {
    container: {
        userSelect: 'none',
    },
};

const CartographyView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    tooltip,
    tooltipCategory,
    tooltipValue,
    worldPosition,
    colorScheme,
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
                    height: (width - VEGA_ACTIONS_WIDTH) * 0.6,
                };
            } catch (e) {
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new Cartography();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setWorldPosition(worldPosition);
        specBuilder.setColor(
            colorScheme !== undefined ? colorScheme.join(' ') : schemeOrRd[9],
        );

        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        field,
        tooltip,
        tooltipCategory,
        tooltipValue,
        worldPosition,
        colorScheme,
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
                injectType={
                    worldPosition === MAP_FRANCE
                        ? VEGA_LITE_DATA_INJECT_TYPE_C
                        : VEGA_LITE_DATA_INJECT_TYPE_B
                }
            />
        </div>
    );
};

CartographyView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    worldPosition: PropTypes.string.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
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

export default compose(injectData(), connect(mapStateToProps))(CartographyView);
