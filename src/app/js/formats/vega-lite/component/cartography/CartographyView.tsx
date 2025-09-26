import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { clamp } from 'lodash';
// @ts-expect-error TS7016
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
    worldPosition,
    // @ts-expect-error TS7031
    colorScheme,
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

        const specBuilder = new Cartography();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setWorldPosition(worldPosition);
        specBuilder.setColor(
            colorScheme !== undefined ? colorScheme.join(' ') : schemeOrRd[9],
        );

        // @ts-expect-error TS2554
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
        // @ts-expect-error TS2322
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
                spec={spec}
                data={data}
                injectType={
                    worldPosition === MAP_FRANCE
                        ? VEGA_LITE_DATA_INJECT_TYPE_C
                        : VEGA_LITE_DATA_INJECT_TYPE_B
                }
                aspectRatio={aspectRatio}
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
    aspectRatio: PropTypes.string,
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

export const CartographyAdminView = connect((state, props) => {
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
})(CartographyView);

export default compose(injectData(), connect(mapStateToProps))(CartographyView);
