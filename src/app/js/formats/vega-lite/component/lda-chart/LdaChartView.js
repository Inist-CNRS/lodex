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
                const topic = entry[0];
                /**
                 * @type {{word: string, word_weight: string}[]}
                 */
                let currentWords = entry[1].words;
                const previousWords = values.get(topic);

                if (previousWords) {
                    currentWords = currentWords.map(word => {
                        const preWord = previousWords.find(
                            preV => preV.word === word.word,
                        );
                        return {
                            word: word.word,
                            word_weight:
                                parseFloat(word.word_weight) +
                                parseFloat(preWord.word_weight),
                        };
                    });
                    currentWords.sort((a, b) => {
                        if (a.word_weight > b.word_weight) {
                            return -1;
                        }
                        if (a.word_weight < b.word_weight) {
                            return 1;
                        }
                        return 0;
                    });
                }

                values.set(topic, currentWords);
            });
        }

        return {
            values: Object.fromEntries(values),
            topics,
        };
    }, [props.data]);

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
                                data={values[topic]}
                                title={topic}
                                colors={props.colors}
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
