import React, { useState } from 'react';
import * as d3 from 'd3';

import AsterPlot from './AsterPlot';

function getRandomInt(min = 5, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomValue() {
    return Math.random() * 100;
}

const AsterPlotChartView = () => {
    const generateData = () => {
        const numberOfElements = getRandomInt();
        return d3.range(numberOfElements).map((item, index) => ({
            date: index,
            value: getRandomValue(),
        }));
    };

    const [data, setData] = useState(generateData());

    const changeData = () => {
        const newData = generateData();
        setData(newData);
    };

    return (
        <div>
            <div>
                <button onClick={changeData}>Random</button>
            </div>

            <AsterPlot data={data} width={200} height={200} />
        </div>
    );
};

export default AsterPlotChartView;
