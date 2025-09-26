import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import PropTypes from 'prop-types';

import { CustomActionVega } from '../../../utils/components/vega-component';
import RadarChart from '../../models/RadarChart';
import {
    convertSpecTemplate,
    lodexScaleToIdScale,
    VEGA_ACTIONS_WIDTH,
    VEGA_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import { field as fieldPropTypes } from '../../../../propTypes';
import injectData from '../../../injectData';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const RadarChartView = ({
    // @ts-expect-error TS7031
    advancedMode,
    // @ts-expect-error TS7031
    advancedModeSpec,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    data,
    // @ts-expect-error TS7031
    colors,
    // @ts-expect-error TS7031
    tooltip,
    // @ts-expect-error TS7031
    tooltipCategory,
    // @ts-expect-error TS7031
    tooltipValue,
    // @ts-expect-error TS7031
    scale,
    // @ts-expect-error TS7031
    aspectRatio,
}) => {
    const formattedData = useMemo(() => {
        if (!data) {
            return data;
        }

        const tmpData = {
            ...data,
        };

        // @ts-expect-error TS7006
        tmpData.values.forEach((value) => {
            value.category = 0;
        });

        return tmpData;
    }, [data]);

    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    width * 0.76,
                );
            } catch (e) {
                // @ts-expect-error TS18046
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

        // @ts-expect-error TS2554
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

    if (spec === null) {
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        // @ts-expect-error TS2322
        <div style={styles.container} ref={ref}>
            <CustomActionVega
                spec={spec}
                data={formattedData}
                injectType={VEGA_DATA_INJECT_TYPE_A}
                aspectRatio={aspectRatio}
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
    aspectRatio: PropTypes.string,
};

RadarChartView.defaultProps = {
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

export const RadarChartAdminView = connect((state, props) => {
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
})(RadarChartView);

export default compose(injectData(), connect(mapStateToProps))(RadarChartView);
