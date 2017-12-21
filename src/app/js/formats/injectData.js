import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes.js';
import { fromCharacteristic, fromGraph } from '../public/selectors';
import { preLoadChartData } from '../public/graph';
import Loading from '../lib/components/Loading';

const styles = {
    message: {
        margin: 20,
    },
};

export default FormatView => {
    class GraphItem extends Component {
        propTypes = {
            field: fieldPropTypes.isRequired,
            resource: PropTypes.object.isRequired,
            preLoadChartData: PropTypes.func.isRequired,
            chartData: PropTypes.any,
            isLoaded: PropTypes.bool.isRequired,
            error: PropTypes.bool.isRequired,
            p: polyglotPropTypes.isRequired,
        };
        componentDidMount() {
            const { field, resource, preLoadChartData } = this.props;
            if (!field) {
                return;
            }

            preLoadChartData({ field, value: resource[field.name] });
        }
        componentDidUpdate() {
            const { field, resource, preLoadChartData } = this.props;
            if (!field) {
                return;
            }

            preLoadChartData({ field, value: resource[field.name] });
        }
        render() {
            const {
                preLoadChartData,
                chartData,
                p: polyglot,
                field,
                isLoaded,
                error,
                ...props
            } = this.props;

            if (error) {
                return (
                    <p style={styles.message}>{polyglot.t('chart_error')}</p>
                );
            }

            if (chartData === 'no result') {
                return (
                    <p style={styles.message}>{polyglot.t('no_chart_data')}</p>
                );
            }

            if (!isLoaded) {
                return <Loading>{polyglot.t('loading')}</Loading>;
            }

            return (
                <FormatView {...props} field={field} chartData={chartData} />
            );
        }
    }

    const mapStateToProps = (state, { field }) => ({
        resource: fromCharacteristic.getCharacteristicsAsResource(state),
        chartData: fromGraph.getChartData(state, field.name),
        isLoaded: field && fromGraph.isChartDataLoaded(state, field.name),
        error: fromGraph.getChartError(state, field.name),
    });

    const mapDispatchToProps = {
        preLoadChartData,
    };

    return compose(connect(mapStateToProps, mapDispatchToProps), translate)(
        GraphItem,
    );
};
