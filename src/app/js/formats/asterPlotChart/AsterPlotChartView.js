import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

// import injectData from '../injectData';
import stylesToClassname from '../../lib/stylesToClassName';
import AsterPlot from './AsterPlot';

function getRandomInt(min = 5, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomValue() {
    return Math.random() * 100;
}

const generateData = () => {
    const numberOfElements = getRandomInt();
    return d3.range(numberOfElements).map((item, index) => ({
        date: index,
        value: getRandomValue(),
    }));
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
