import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, Paper } from '@mui/material';

import injectData from '../../../injectData';
import { field as fieldPropTypes } from '../../../../propTypes';
import LdaChart from './LdaChart';

const LdaChartView = props => {
    const { values, topics } = useMemo(() => {
        const rawValues = props.data.values ?? [];

        const topics = _.chain(rawValues)
            .flatMap(o => Object.keys(o.value.topics))
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

        /**
         * @type {Map<string, {word: string, word_weight: string}[]>}
         */
        const values = new Map();

        for (const rawValue of rawValues) {
            /**
             * @type {any}
             */
            const topicsValues = rawValue.value.topics;
            Object.entries(topicsValues).forEach(entry => {
                const key = entry[0];
                /**
                 * @type {{word: string, word_weight: string}[]}
                 */
                let current = entry[1].words;
                const previous = values.get(key);

                if (previous) {
                    current = current.map(v => {
                        const pre = previous.find(preV => preV.word === v.word);
                        return {
                            word: v.word,
                            word_weight:
                                parseFloat(v.word_weight) +
                                parseFloat(pre.word_weight),
                        };
                    });
                    current.sort((a, b) => {
                        if (a.word_weight > b.word_weight) {
                            return -1;
                        }
                        if (a.word_weight < b.word_weight) {
                            return 1;
                        }
                        return 0;
                    });
                }

                values.set(key, current);
            });
        }

        return {
            values: Object.fromEntries(values),
            topics,
        };
    }, [props]);

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
                            <LdaChart data={values[topic]} title={topic} />
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
};

export default compose(injectData(), connect(mapStateToProps))(LdaChartView);
