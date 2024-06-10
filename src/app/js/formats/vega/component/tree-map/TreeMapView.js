import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import TreeMap, { TREE_MAP_LAYOUT } from '../../models/TreeMap';
import React, { useMemo, useState } from 'react';
import { useSizeObserver } from '../../../utils/chartsHooks';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_DATA_INJECT_TYPE_C,
} from '../../../utils/chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { CustomActionVega } from '../../../utils/components/vega-component';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const TreeMapView = (props) => {
    const {
        data,
        field,
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
        if (!data) {
            return data;
        }

        let idIncrement = 0;
        /**
         * @type {Map<string, number>}
         */
        const ids = new Map();
        /**
         * @type {Map<string, {parent: number?, size: number?}>}
         */
        const tmpData = new Map();

        data.values.forEach((value) => {
            const parent = value.source;
            const name = value.target;
            const size = value.weight;

            if (!tmpData.has(parent)) {
                tmpData.set(parent, {});
                if (!ids.has(parent)) {
                    ids.set(parent, ++idIncrement);
                }
            }

            if (!ids.has(name)) {
                ids.set(name, ++idIncrement);
            }

            tmpData.set(name, {
                parent: ids.get(parent),
                size,
            });
        });

        const nodes = new Set();

        let outputData = new Map();
        tmpData.forEach((value, key) => {
            if (value.parent && !nodes.has(value.parent)) {
                nodes.add(value.parent);
            }
            outputData.set(ids.get(key), {
                id: ids.get(key),
                name: key,
                ...value,
            });
        });

        return {
            ...data,
            values: Array.from(outputData, ([id, value]) => {
                if (nodes.has(id)) {
                    delete value.size;
                } else {
                    const maxRecursion = 10;
                    let recursion = 0;
                    const getHierarchy = (parentId) => {
                        recursion++;
                        if (recursion > maxRecursion) {
                            return [];
                        }
                        if (!outputData.has(parentId)) {
                            return [];
                        }
                        const parent = outputData.get(parentId);
                        if (parent.parent) {
                            return [
                                ...getHierarchy(parent.parent),
                                parent.name,
                            ];
                        }
                        return [parent.name];
                    };

                    value.hierarchy = getHierarchy(value.parent).join(', ');
                }
                return value;
            }),
        };
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
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new TreeMap();

        specBuilder.setColors(colors.split(' '));
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipSource(tooltipSource);
        specBuilder.setTooltipTarget(tooltipTarget);
        specBuilder.setTooltipWeight(tooltipWeight);
        specBuilder.setRatio(ratio);
        specBuilder.setLayout(layout);

        return specBuilder.buildSpec(width);
    }, [
        width,
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
        <div style={styles.container} ref={ref}>
            <CustomActionVega
                spec={spec}
                data={formattedData}
                injectType={VEGA_DATA_INJECT_TYPE_C}
                aspectRatio={aspectRatio}
            />
        </div>
    );
};

TreeMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
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

export const TreeMapAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: props.dataset.values ?? [],
        },
    };
})(TreeMapView);

export default compose(injectData(), connect(mapStateToProps))(TreeMapView);
