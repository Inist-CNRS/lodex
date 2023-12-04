import { CustomActionVegaLite } from '../vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A } from '../../../chartsUtils';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const ClusteredChart = ({ data, topic, params }) => {
    const values = useMemo(() => {
        return data.filter(value => value.source === topic);
    }, [data, topic]);

    const spec = useMemo(() => {
        const { colors, xTitle, yTitle } = params;
        const specToReturn = {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            config: { legend: { disable: true } },
            title: topic,
            encoding: {
                y: { field: 'target', type: 'nominal', sort: null },
                x: { field: 'weight', type: 'quantitative', sort: null },
            },
            layer: [
                {
                    mark: 'bar',
                    encoding: {
                        color: {
                            field: 'weight',
                            scale: { range: colors.split(' ') },
                        },
                    },
                },
                {
                    mark: {
                        type: 'text',
                        align: 'left',
                        baseline: 'middle',
                        dx: 3,
                    },
                    encoding: {
                        text: {
                            field: 'weight',
                            type: 'quantitative',
                            format: '.4f',
                        },
                    },
                },
            ],
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
    }),
};

export default ClusteredChart;
