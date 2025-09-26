import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import React, { useMemo, useState } from 'react';
// @ts-expect-error TS7016
import { clamp } from 'lodash';

import PieChart from '../../models/PieChart';
import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import { field as fieldPropTypes } from '../../../../propTypes';
import injectData from '../../../injectData';

const styles = {
    container: {
        userSelect: 'none',
    },
};

const PieChartView = ({
    // @ts-expect-error TS7031
    advancedMode,
    // @ts-expect-error TS7031
    advancedModeSpec,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    data,
    // @ts-expect-error TS7031
    tooltip,
    // @ts-expect-error TS7031
    tooltipCategory,
    // @ts-expect-error TS7031
    tooltipValue,
    // @ts-expect-error TS7031
    colors,
    // @ts-expect-error TS7031
    labels,
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

        const specBuilder = new PieChart();

        // enable the orderBy in vega-lite
        let count = 1;
        // @ts-expect-error TS7006
        data.values.forEach((entry) => {
            entry.order = count++;
        });

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(colors);
        specBuilder.setLabels(labels);

        return specBuilder.buildSpec();
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

PieChartView.propTypes = {
    field: fieldPropTypes,
    resource: PropTypes.object,
    data: PropTypes.shape({
        values: PropTypes.any.isRequired,
    }),
    colors: PropTypes.string,
    tooltip: PropTypes.bool,
    tooltipCategory: PropTypes.string,
    tooltipValue: PropTypes.string,
    labels: PropTypes.bool,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
    aspectRatio: PropTypes.string,
};

PieChartView.defaultProps = {
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

export const PieChartAdminView = connect((state, props) => {
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
})(PieChartView);

export default compose(injectData(), connect(mapStateToProps))(PieChartView);
