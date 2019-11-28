import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import get from 'lodash.get';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
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

function getValue(data, decimals = 2) {
    const value = get(data, 'weight', 0);
    return parseFloat(value).toFixed(decimals);
}

const prepareData = (data = [], history, polyglot) =>
    data
        .map(d => {
            const title = getShortText(d['target-title']);

            const value = getValue(d);
            const label = `<div>${title}<br/><br/>${value}% ${polyglot.t(
                'similar',
            )}</div>`;

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
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (_, { formatData, history, p: polyglot }) => ({
    data: prepareData(formatData, history, polyglot),
});

export default compose(
    translate,
    withRouter,
    injectData(),
    connect(mapStateToProps),
)(AsterPlotChartView);
