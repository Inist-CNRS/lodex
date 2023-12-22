import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { clamp } from 'lodash';

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

    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    clamp((width - VEGA_ACTIONS_WIDTH) * 0.76, 300, 1200),
                );
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

export const RadarChartAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: props.dataset.values ?? [],
        },
    };
})(RadarChartView);

export default compose(injectData(), connect(mapStateToProps))(RadarChartView);
