import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import get from 'lodash.get';

import { getPercentValue } from '../../lib/getPercentage';
import { getShortText } from '../../lib/longTexts';
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

const ROUTINE_NAME = 'distance-with/';

const prepareData = (data = [], history, polyglot) =>
    data.map(d => {
        const title = getShortText(d['target-title']);
        const onClick = () => {
            history.push({
                pathname: `/${d.target}`,
                state: {},
            });
        };
        const value = getPercentValue(d, 2);
        const label = `<div>${title}<br/><br/>${value}% ${polyglot.t(
            'similar',
        )}</div>`;
        return {
            label,
            weights: d.weights.map(weight => weight * 100),
            onClick,
        };
    });

const ParallelCoordinatesChartView = ({ fieldNames, data, colorSet }) => {
    return (
        <div className={styles.container}>
            <ParallelCoordinatesChart
                fieldNames={fieldNames}
                data={data}
                width={600}
                height={200}
                colorSet={colorSet}
            />
        </div>
    );
};

ParallelCoordinatesChartView.propTypes = {
    fieldNames: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

const getFieldNames = (field, fields, resource) => {
    const characteristicPath = get(resource, field.name, '');
    const pathIndex = characteristicPath.indexOf(ROUTINE_NAME);
    if (pathIndex === -1) {
        return [];
    }
    const characteristics = characteristicPath
        .substring(pathIndex + ROUTINE_NAME.length)
        .split('/');
    return characteristics.map(characteristic => {
        const fieldName = fields.find(field => field.name === characteristic);
        return get(fieldName, 'label', '');
    });
};

const mapStateToProps = (
    _,
    { field, fields, resource, formatData, history, p: polyglot },
) => {
    return {
        fieldNames: getFieldNames(field, fields, resource),
        data: prepareData(formatData, history, polyglot),
    };
};

export default compose(
    translate,
    withRouter,
    injectData(null, null, true),
    connect(mapStateToProps),
)(ParallelCoordinatesChartView);
