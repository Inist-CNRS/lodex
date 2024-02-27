import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import clamp from 'lodash/clamp';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../../../propTypes';
import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import injectData from '../../../injectData';
import {
    convertSpecTemplate,
    lodexOrderToIdOrder,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import BubblePlot from '../../models/BubblePlot';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import { ASPECT_RATIO_1_1 } from '../../../utils/aspectRatio';

const styles = {
    container: {
        userSelect: 'none',
    },
};

const BubblePlotView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    colors,
    params,
    flipAxis,
    tooltip,
    tooltipSource,
    tooltipTarget,
    tooltipWeight,
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
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new BubblePlot();

        specBuilder.setColor(colors);
        specBuilder.setOrderBy(lodexOrderToIdOrder(params.orderBy));
        specBuilder.flipAxis(flipAxis);
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipSource);
        specBuilder.setTooltipTarget(tooltipTarget);
        specBuilder.setTooltipValue(tooltipWeight);

        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        field,
        colors,
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
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
                spec={spec}
                data={data}
                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
                aspectRatio={ASPECT_RATIO_1_1}
            />
        </div>
    );
};

BubblePlotView.propTypes = {
    field: fieldPropTypes,
    resource: PropTypes.object,
    data: PropTypes.shape({
        values: PropTypes.any.isRequired,
    }),
    params: PropTypes.any,
    colors: PropTypes.string,
    flipAxis: PropTypes.bool,
    tooltip: PropTypes.bool,
    tooltipSource: PropTypes.string,
    tooltipTarget: PropTypes.string,
    tooltipWeight: PropTypes.string,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

BubblePlotView.defaultProps = {
    className: null,
};

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

export const BubblePlotAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: props.dataset.values ?? [],
        },
    };
})(BubblePlotView);

export default compose(injectData(), connect(mapStateToProps))(BubblePlotView);
