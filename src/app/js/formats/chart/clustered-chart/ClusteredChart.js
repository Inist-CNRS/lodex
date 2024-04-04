import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { CustomActionVegaLite } from '../../utils/components/vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A, flip } from '../../utils/chartsUtils';

/**
 * @param data {{values: Array<{_id: string, source: string, target: string, weight: string}>}}
 * @param topic {string}
 * @param params {{colors: string, xTitle: string, yTitle: string, flipAxis: boolean}}
 * @returns {JSX.Element}
 * @constructor
 */
const ClusteredChart = ({ data, topic, params }) => {
    const values = useMemo(() => {
        return data.filter((value) =>
            flip(
                params.flipAxis,
                value.target === topic,
                value.source === topic,
            ),
        );
    }, [data, topic]);

    const spec = useMemo(() => {
        const { colors, xTitle, yTitle, flipAxis } = params;
        const specToReturn = {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            config: { legend: { disable: true } },
            title: topic,
            mark: 'bar',
            encoding: {
                y: {
                    field: flip(flipAxis, 'source', 'target'),
                    type: 'nominal',
                    sort: null,
                },
                x: { field: 'weight', type: 'quantitative', sort: null },
                color: {
                    field: 'weight',
                    scale: { range: colors.split(' ') },
                },
            },
            width: 'container',
            height: { step: 20 },
        };

        if (xTitle && xTitle !== '') {
            specToReturn.encoding.x.title = xTitle;
        }

        if (yTitle && yTitle !== '') {
            specToReturn.encoding.y.title = yTitle;
        }

        return specToReturn;
    }, [values, topic, params]);
    return (
        <CustomActionVegaLite
            spec={spec}
            data={{
                values,
            }}
            injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
        />
    );
};

ClusteredChart.propTypes = {
    data: PropTypes.array.isRequired,
    topic: PropTypes.string.isRequired,
    params: PropTypes.shape({
        colors: PropTypes.string.isRequired,
        xTitle: PropTypes.string,
        yTitle: PropTypes.string,
        flipAxis: PropTypes.bool,
    }),
};

export default ClusteredChart;
