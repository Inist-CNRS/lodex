import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import get from 'lodash.get';

import { getShortText } from '../../lib/longTexts';
import stylesToClassname from '../../lib/stylesToClassName';
import injectData from '../injectData';
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

const prepareData = (data = [], history) =>
    data
        .map(d => {
            const title = getShortText(d['target-title']);

            const value = getRandomValue(2);
            const label = `<div>${title} <br/><br/> ${value}% similarity</div>`;
            const onClick = () => {
                history.push({
                    pathname: `/${d.target}`,
                    state: {},
                });
            };

            return {
                label,
                value,
                onClick,
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
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
};

const mapStateToProps = (_, { formatData, history }) => ({
    data: prepareData(formatData, history),
});

export default compose(
    withRouter,
    injectData(),
    connect(mapStateToProps),
)(AsterPlotChartView);
