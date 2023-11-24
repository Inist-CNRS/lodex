import React, { useMemo, useState } from 'react';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../../propTypes';
import PropTypes from 'prop-types';
import { CustomActionVega } from '../vega-component';
import FlowMap from '../../models/FlowMap';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_DATA_INJECT_TYPE_B,
} from '../../../chartsUtils';
import { schemeBlues } from 'd3-scale-chromatic';
import MouseIcon from '../../../shared/MouseIcon';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../vega-utils/chartsHooks';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const FlowMapView = ({
    advancedMode,
    advancedModeSpec,
    p,
    field,
    data,
    tooltip,
    tooltipCategory,
    tooltipValue,
    color,
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
                    width * 0.6,
                );
            } catch (e) {
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

        return specBuilder.buildSpec(width, data.values.length);
    }, [
        width,
        data.values,
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
        <div style={styles.container} ref={ref}>
            <CustomActionVega
                spec={spec}
                data={data}
                injectType={VEGA_DATA_INJECT_TYPE_B}
            />
            <MouseIcon polyglot={p} />
        </div>
    );
};

FlowMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

FlowMapView.defaultProps = {
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

export const FlowMapAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: [
                { source: 'FRA', target: 'JPN', weight: 28 },
                { source: 'FRA', target: 'GBR', weight: 55 },
                { source: 'FRA', target: 'CAN', weight: 43 },
                { source: 'FRA', target: 'TUN', weight: 15 },
            ],
        },
    };
})(FlowMapView);

export default compose(injectData(), connect(mapStateToProps))(FlowMapView);
