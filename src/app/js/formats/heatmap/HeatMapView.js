import React from 'react';

import injectData from '../injectData';

const HeatMapView = ({ chartData }) => {
    const { xAxis, yAxis } = chartData.reduce(
        (acc, { source, target }) => ({
            xAxis: acc.xAxis.concat(source),
            yAxis: acc.yAxis.concat(target),
        }),
        { xAxis: [], yAxis: [] },
    );

    return <p>soon</p>;
};

export default injectData(HeatMapView);
