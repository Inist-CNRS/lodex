import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
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
} from '../../../chartsUtils';
import BarChart from '../../models/BarChart';
import { CustomActionVegaLite } from '../vega-lite-component';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../vega-utils/chartsHooks';
import { ASPECT_RATIO_16_6 } from '../../../aspectRatio';

const styles = {
    container: {
        userSelect: 'none',
    },
};

const BarChartView = ({
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
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
                spec={spec}
                data={data}
                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
                aspectRatio={ASPECT_RATIO_16_6}
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

export const BarChartAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: props.dataset.values ?? [],
        },
    };
})(BarChartView);

export default compose(injectData(), connect(mapStateToProps))(BarChartView);
