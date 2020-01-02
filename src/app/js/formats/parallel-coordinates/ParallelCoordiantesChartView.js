import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import stylesToClassname from '../../lib/stylesToClassName';
import injectData from '../injectData';

const styles = stylesToClassname(
    {
        container: {
            margin: '10px',
        },
    },
    'parallel-coordinates-chart-view',
);

const ParallelCoordinatesChartView = ({ data, colorSet }) => {
    console.log(data, colorSet);

    return <div className={styles.container}>parallel coordinates chart</div>;
};

ParallelCoordinatesChartView.propTypes = {
    data: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

export default compose(
    translate,
    withRouter,
    injectData,
)(ParallelCoordinatesChartView);
