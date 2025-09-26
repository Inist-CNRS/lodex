import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import TreeMap, { TREE_MAP_LAYOUT } from '../../models/TreeMap';
// @ts-expect-error TS6133
import React, { useMemo, useState } from 'react';
import { useSizeObserver } from '../../../utils/chartsHooks';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_DATA_INJECT_TYPE_C,
} from '../../../utils/chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { CustomActionVega } from '../../../utils/components/vega-component';
import TreeMapData from './TreeMapData';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

// @ts-expect-error TS7006
const TreeMapView = (props) => {
    const {
        data,
        field,
        hierarchy,
        flatType,
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
        colors,
        layout,
        ratio,
        aspectRatio,
    } = props;

    const formattedData = useMemo(() => {
        if (!data || !data.values || !Array.isArray(data.values)) {
            return data;
        }

        let values = data.values;
        if (!hierarchy) {
            if (flatType === 'id/value') {
                // @ts-expect-error TS2339
                values = TreeMapData.transformIdValue(data.values);
            }
            if (flatType === 'source/target/weight') {
                // @ts-expect-error TS2339
                values = TreeMapData.transformSourceTargetWeight(data.values);
            }
        }

        const treeMapDataBuilder = new TreeMapData(values, hierarchy);
        return {
            ...data,
            values: treeMapDataBuilder.build(),
        };
    }, [data, hierarchy, flatType]);

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

        const specBuilder = new TreeMap();

        specBuilder.setHierarchy(hierarchy);
        specBuilder.setColors(colors.split(' '));
        specBuilder.setTooltip(tooltip);
        specBuilder.setThirdTooltip(
            hierarchy || (!hierarchy && flatType !== 'id/value'),
        );
        specBuilder.setTooltipSource(tooltipSource);
        specBuilder.setTooltipTarget(tooltipTarget);
        specBuilder.setTooltipWeight(tooltipWeight);
        specBuilder.setRatio(ratio);
        specBuilder.setLayout(layout);

        return specBuilder.buildSpec(width);
    }, [
        width,
        hierarchy,
        flatType,
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
        colors,
        layout,
        ratio,
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
                data={formattedData}
                injectType={VEGA_DATA_INJECT_TYPE_C}
                aspectRatio={aspectRatio}
            />
        </div>
    );
};

TreeMapView.propTypes = {
    field: fieldPropTypes,
    resource: PropTypes.object,
    data: PropTypes.any,
    hierarchy: PropTypes.bool,
    flatType: PropTypes.oneOf(['id/value', 'source/target/weight']),
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
    tooltip: PropTypes.bool,
    tooltipSource: PropTypes.string,
    tooltipTarget: PropTypes.string,
    tooltipWeight: PropTypes.string,
    colors: PropTypes.string,
    layout: PropTypes.oneOf(TREE_MAP_LAYOUT),
    ratio: PropTypes.number,
    aspectRatio: PropTypes.string,
};

TreeMapView.defaultProps = {
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
export const TreeMapAdminView = connect((state, props) => {
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
})(TreeMapView);

export default compose(injectData(), connect(mapStateToProps))(TreeMapView);
