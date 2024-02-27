import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import clamp from 'lodash/clamp';
import { schemeOrRd } from 'd3-scale-chromatic';

import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import {
    convertSpecTemplate,
    MAP_FRANCE,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../../utils/chartsUtils';
import { field as fieldPropTypes } from '../../../../propTypes';
import injectData from '../../../injectData';
import Cartography from '../../models/Cartography';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';

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
    field: fieldPropTypes,
    resource: PropTypes.object,
    data: PropTypes.shape({
        values: PropTypes.any.isRequired,
    }),
    tooltip: PropTypes.bool,
    tooltipCategory: PropTypes.string,
    tooltipValue: PropTypes.string,
    colorScheme: PropTypes.arrayOf(PropTypes.string),
    worldPosition: PropTypes.string,
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

export const CartographyAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: props.dataset.values ?? [],
        },
    };
})(CartographyView);

export default compose(injectData(), connect(mapStateToProps))(CartographyView);
