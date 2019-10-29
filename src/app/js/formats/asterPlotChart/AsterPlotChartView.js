import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import AsterPlot from './AsterPlot';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomValue() {
    return Math.random() * 100;
}

const AsterPlotChartView = () => {
    const generateData = (value, length) =>
        d3.range(length).map((item, index) => ({
            date: index,
            value,
        }));

    const [data, setData] = useState(generateData(0, 10));

    const changeData = () => {
        const value = getRandomValue();
        const length = getRandomInt(5, 10);
        setData(generateData(value, length));
    };

    useEffect(() => {
        setData(generateData());
    }, [!data]);

    return (
        <div>
            <div>
                <button onClick={changeData}>Random</button>
            </div>

            <AsterPlot data={data} width={300} height={300} />
        </div>
    );
};

export default AsterPlotChartView;
