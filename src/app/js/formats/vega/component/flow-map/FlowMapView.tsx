// @ts-expect-error TS6133
import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../../propTypes';
import { CustomActionVega } from '../../../utils/components/vega-component';
import FlowMap from '../../models/FlowMap';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_DATA_INJECT_TYPE_B,
} from '../../../utils/chartsUtils';
// @ts-expect-error TS7016
import { schemeBlues } from 'd3-scale-chromatic';
import MouseIcon from '../../../utils/components/MouseIcon';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import injectData from '../../../injectData';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const FlowMapView = ({
    // @ts-expect-error TS7031
    advancedMode,
    // @ts-expect-error TS7031
    advancedModeSpec,
    // @ts-expect-error TS7031
    p,
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
    color,
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
                    width * 0.6,
                );
            } catch (e) {
                // @ts-expect-error TS18046
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new FlowMap();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(color.split(' ')[0]);
        specBuilder.setColorScheme(
            colorScheme !== undefined ? colorScheme : schemeBlues[9].split(' '),
        );

        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipCategory,
        tooltipValue,
        color,
        colorScheme,
    ]);

    if (spec === null) {
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        // @ts-expect-error TS2322
        <div style={styles.container} ref={ref}>
            <CustomActionVega
                // @ts-expect-error TS2322
                spec={spec}
                data={data}
                injectType={VEGA_DATA_INJECT_TYPE_B}
                aspectRatio={aspectRatio}
            />
            <MouseIcon polyglot={p} />
        </div>
    );
};

FlowMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    data: PropTypes.any,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
    aspectRatio: PropTypes.string,
};

FlowMapView.defaultProps = {
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

// @ts-expect-error TS6133
export const FlowMapAdminView = connect((state, props) => {
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
})(FlowMapView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(FlowMapView);
