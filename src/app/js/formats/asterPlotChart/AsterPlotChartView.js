import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import get from 'lodash.get';

// import injectData from '../injectData';
import stylesToClassname from '../../lib/stylesToClassName';
import AsterPlot from './AsterPlot';

const sortByKey = (key = '') => (dataA, dataB) => {
    if (key === '') {
        return 0;
    }

    const a = get(dataA, `${key}`, '');
    const b = get(dataB, `${key}`, '');

    return Math.sign(a - b);
};

function getRandomInt(min = 5, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomValue(decimals = 2) {
    return parseFloat(Math.random() * 100).toFixed(decimals);
}

const generateData = () => {
    const numberOfElements = getRandomInt();
    return d3
        .range(numberOfElements)
        .map(() => ({
            value: getRandomValue(),
        }))
        .sort(sortByKey('value'));
};

const styles = stylesToClassname(
    {
        container: {
            margin: '10px',
        },
    },
    'aster-plot-chart',
);

const AsterPlotChartView = ({ data }) => {
    return (
        <div className={styles.container}>
            <AsterPlot data={data} width={200} height={200} />
        </div>
    );
};

AsterPlotChartView.propTypes = {
    data: PropTypes.array.isRequired,
};

const mapStateToProps = () => {
    const data = generateData();

    return {
        data,
    };
};

export default compose(
    // injectData(),
    connect(mapStateToProps),
)(AsterPlotChartView);
