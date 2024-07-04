import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, Paper } from '@mui/material';

import injectData from '../../injectData';
import { field as fieldPropTypes } from '../../../propTypes';
import ClusteredChart from './ClusteredChart';
import { flip } from '../../utils/chartsUtils';
import ZoomableFormat from '../../utils/components/ZoomableFormat';

/**
 * Clustered chart view components use to render the chart with given parameters
 * @param data {{values: Array<{_id: string, source: string, target: string, weight: string}>}}
 * @param colors {string}
 * @param xTitle {string}
 * @param yTitle {string}
 * @param flipAxis {boolean}
 * @returns {JSX.Element}
 */
const ClusteredChartView = ({ data, colors, xTitle, yTitle, flipAxis }) => {
    const { values } = data;

    const topics = useMemo(() => {
        return _.chain(values)
            .map((value) => flip(flipAxis, value.target, value.source))
            .uniq()
            .sort((a, b) =>
                a.localeCompare(b, 'fr', {
                    sensitivity: 'accent',
                    numeric: true,
                    usage: 'sort',
                    ignorePunctuation: true,
                }),
            )
            .value();
    }, [values]);

    return (
        <div style={{ margin: '12px' }}>
            <ZoomableFormat>
                <Grid
                    container
                    justifyContent="center"
                    rowSpacing={1}
                    columnSpacing={1}
                >
                    {topics.map((topic) => (
                        <Grid key={topic} item xs={6}>
                            <Paper style={{ padding: '6px' }}>
                                <ClusteredChart
                                    data={values}
                                    topic={topic}
                                    params={{
                                        colors,
                                        xTitle,
                                        yTitle,
                                        flipAxis,
                                    }}
                                />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </ZoomableFormat>
        </div>
    );
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {
            data: {
                values: [],
            },
        };
    }
    return {
        data: {
            values: formatData,
        },
    };
};

ClusteredChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
    xTitle: PropTypes.string,
    yTitle: PropTypes.string,
    flipAxis: PropTypes.bool,
};

export default compose(
    injectData(),
    connect(mapStateToProps),
)(ClusteredChartView);
