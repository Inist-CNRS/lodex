import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, Paper } from '@mui/material';

import injectData from '../../../injectData';
import { field as fieldPropTypes } from '../../../../propTypes';
import LdaChart from './LdaChart';

const LdaChartView = ({ data, colors }) => {
    const { values } = data;

    const topics = useMemo(() => {
        return _.chain(values)
            .map(value => value.source)
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
            <Grid
                container
                justifyContent="center"
                rowSpacing={1}
                columnSpacing={1}
            >
                {topics.map(topic => (
                    <Grid key={topic} item xs={6}>
                        <Paper style={{ padding: '6px' }}>
                            <LdaChart
                                data={values}
                                topic={topic}
                                colors={colors}
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
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

LdaChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
};

export default compose(injectData(), connect(mapStateToProps))(LdaChartView);
