// @ts-expect-error TS6133
import React, { useMemo } from 'react';

import { CustomActionVegaLite } from '../../utils/components/vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A, flip } from '../../utils/chartsUtils';

interface ClusteredChartProps {
    data: unknown[];
    topic: string;
    params?: {
        colors: string;
        xTitle?: string;
        yTitle?: string;
        flipAxis?: boolean;
    };
}

/**
 * @param data {{values: Array<{_id: string, source: string, target: string, weight: string}>}}
 * @param topic {string}
 * @param params {{colors: string, xTitle: string, yTitle: string, flipAxis: boolean}}
 * @returns {JSX.Element}
 * @constructor
 */
const ClusteredChart = ({
    data,
    topic,
    params
}: ClusteredChartProps) => {
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
            background: null,
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
            // @ts-expect-error TS2339
            specToReturn.encoding.x.title = xTitle;
        }

        if (yTitle && yTitle !== '') {
            // @ts-expect-error TS2339
            specToReturn.encoding.y.title = yTitle;
        }

        return specToReturn;
    }, [values, topic, params]);
    return (
        <CustomActionVegaLite
            // @ts-expect-error TS2322
            spec={spec}
            data={{
                values,
            }}
            injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
            disableZoom
        />
    );
};

export default ClusteredChart;
