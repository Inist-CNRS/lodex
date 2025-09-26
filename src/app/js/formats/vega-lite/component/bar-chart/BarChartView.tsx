import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { clamp } from 'lodash';

import injectData from '../../../injectData';
import { field as fieldPropTypes } from '../../../../propTypes';
import {
    AXIS_X,
    AXIS_Y,
    convertSpecTemplate,
    lodexDirectionToIdDirection,
    lodexScaleToIdScale,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import BarChart from '../../models/BarChart';
import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';

const styles = {
    container: {
        userSelect: 'none',
    },
};

const BarChartView = ({
    // @ts-expect-error TS7031
    advancedMode,
    // @ts-expect-error TS7031
    advancedModeSpec,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    data,
    // @ts-expect-error TS7031
    direction,
    // @ts-expect-error TS7031
    params,
    // @ts-expect-error TS7031
    scale,
    // @ts-expect-error TS7031
    colors,
    // @ts-expect-error TS7031
    axisRoundValue,
    // @ts-expect-error TS7031
    tooltip,
    // @ts-expect-error TS7031
    tooltipCategory,
    // @ts-expect-error TS7031
    tooltipValue,
    // @ts-expect-error TS7031
    labels,
    // @ts-expect-error TS7031
    labelOverlap,
    // @ts-expect-error TS7031
    barSize,
    // @ts-expect-error TS7031
    diagonalCategoryAxis,
    // @ts-expect-error TS7031
    diagonalValueAxis,
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
                    clamp((width - VEGA_ACTIONS_WIDTH) * 0.6, 300, 1200),
                );
            } catch (e) {
                // @ts-expect-error TS18046
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new BarChart();

        specBuilder.setAxisDirection(lodexDirectionToIdDirection(direction));

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

        // @ts-expect-error TS2554
        return specBuilder.buildSpec(width, data.values.length);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        field,
        data.values,
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

BarChartView.propTypes = {
    field: fieldPropTypes,
    resource: PropTypes.object,
    data: PropTypes.shape({
        values: PropTypes.any.isRequired,
    }),
    colors: PropTypes.string,
    direction: PropTypes.string,
    orderBy: PropTypes.string,
    diagonalCategoryAxis: PropTypes.bool,
    diagonalValueAxis: PropTypes.bool,
    scale: PropTypes.string,
    params: PropTypes.any,
    axisRoundValue: PropTypes.bool,
    tooltip: PropTypes.bool,
    tooltipCategory: PropTypes.string,
    tooltipValue: PropTypes.string,
    labels: PropTypes.string,
    labelOverlap: PropTypes.string,
    barSize: PropTypes.number,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
    aspectRatio: PropTypes.string,
};

BarChartView.defaultProps = {
    className: null,
};

// @ts-expect-error TS7006
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

export const BarChartAdminView = connect((state, props) => {
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
})(BarChartView);

export default compose(injectData(), connect(mapStateToProps))(BarChartView);
