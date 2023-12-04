import { CustomActionVegaLite } from '../vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A } from '../../../chartsUtils';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const LdaChart = ({ data, topic, colors }) => {
    const values = useMemo(() => {
        return data.filter(value => value.source === topic);
    }, [data, topic]);

    const spec = useMemo(() => {
        return {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            config: { legend: { disable: true } },
            title: topic,
            encoding: {
                y: {
                    title: 'word',
                    field: 'target',
                    type: 'nominal',
                    sort: null,
                },
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
    }, [values, topic, colors]);
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

LdaChart.propTypes = {
    data: PropTypes.array.isRequired,
    topic: PropTypes.string.isRequired,
    colors: PropTypes.string.isRequired,
};

export default LdaChart;
