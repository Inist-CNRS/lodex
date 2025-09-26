import React, { useMemo, useState } from 'react';
// @ts-expect-error TS7016
import { clamp } from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import compose from 'recompose/compose';

import HeatMap from '../../models/HeatMap';
import { field as fieldPropTypes } from '../../../../propTypes';
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

const HeatMapView = ({
    // @ts-expect-error TS7031
    advancedMode,
    // @ts-expect-error TS7031
    advancedModeSpec,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    data,
    // @ts-expect-error TS7031
    colorScheme,
    // @ts-expect-error TS7031
    params,
    // @ts-expect-error TS7031
    flipAxis,
    // @ts-expect-error TS7031
    tooltip,
    // @ts-expect-error TS7031
    tooltipSource,
    // @ts-expect-error TS7031
    tooltipTarget,
    // @ts-expect-error TS7031
    tooltipWeight,
    // @ts-expect-error TS7031
    aspectRatio,
}) => {
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
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        // @ts-expect-error TS2322
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
                spec={spec}
                data={data}
                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
                aspectRatio={aspectRatio}
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
    aspectRatio: PropTypes.string,
};

HeatMapView.defaultProps = {
    className: null,
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

export const HeatMapAdminView = connect((state, props) => {
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

export default compose(injectData(), connect(mapStateToProps))(HeatMapView);
