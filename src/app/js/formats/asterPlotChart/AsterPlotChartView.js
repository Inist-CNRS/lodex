import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import get from 'lodash.get';
import { getShortText } from '../../lib/longTexts';

import injectData from '../injectData';
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

function getRandomValue(decimals = 2) {
    return parseFloat(Math.random() * 100).toFixed(decimals);
}

const prepareData = (data = []) =>
    data
        .map(d => {
            const title = getShortText(d['target-title']);

            const value = getRandomValue(2);
            const label = `<div>${title} <br/><br/> ${value}% similarity</div>`;

            return {
                label,
                value,
            };
        })
        .sort(sortByKey('index'));

const styles = stylesToClassname(
    {
        container: {
            margin: '10px',
        },
    },
    'aster-plot-chart-view',
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

const mapStateToProps = (_, { formatData }) => ({
    data: prepareData(formatData),
});

export default compose(
    injectData(),
    connect(mapStateToProps),
)(AsterPlotChartView);
