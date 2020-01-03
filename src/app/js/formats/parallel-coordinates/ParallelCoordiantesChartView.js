import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import stylesToClassname from '../../lib/stylesToClassName';
import injectData from '../injectData';
import ParallelCoordinatesChart from './ParallelCoordinatesChart';

const styles = stylesToClassname(
    {
        container: {
            margin: '10px',
        },
    },
    'parallel-coordinates-chart-view',
);

const ParallelCoordinatesChartView = ({ data, colorSet }) => {
    return (
        <div className={styles.container}>
            <ParallelCoordinatesChart
                fieldNames={['Test', 'Author']}
                data={data}
                width={600}
                height={200}
                colorSet={colorSet}
            />
        </div>
    );
};

ParallelCoordinatesChartView.propTypes = {
    data: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = (_, { formatData }) => ({
    data: formatData,
});

export default compose(
    translate,
    withRouter,
    injectData(),
    connect(mapStateToProps),
)(ParallelCoordinatesChartView);
