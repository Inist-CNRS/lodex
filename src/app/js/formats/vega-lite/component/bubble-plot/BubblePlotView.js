import React, { useMemo, useState } from 'react';
import { CustomActionVegaLite } from '../vega-lite-component';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import {
    convertSpecTemplate,
    lodexOrderToIdOrder,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';
import BubblePlot from '../../models/BubblePlot';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../vega-utils/chartsHooks';
import { ASPECT_RATIO_1_1 } from '../../../aspectRatio';

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
