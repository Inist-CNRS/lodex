import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes.js';
import { fromCharacteristic, fromFormat } from '../public/selectors';
import { preLoadFormatData, unLoadFormatData } from '../formats/reducer';
import Loading from '../lib/components/Loading';

const styles = {
    message: {
        margin: 20,
    },
};

export default FormatView => {
    class GraphItem extends Component {
        static propTypes = {
            field: fieldPropTypes.isRequired,
            resource: PropTypes.object.isRequired,
            preLoadFormatData: PropTypes.func.isRequired,
            unLoadFormatData: PropTypes.func.isRequired,
            formatData: PropTypes.any,
            isLoaded: PropTypes.bool.isRequired,
            error: PropTypes.bool,
            p: polyglotPropTypes.isRequired,
        };
        componentDidMount() {
            const { field, resource, preLoadFormatData } = this.props;
            if (!field) {
                return;
            }
            preLoadFormatData({ field, value: resource[field.name] });
        }
        componentWillUnmount() {
            const { field, unLoadFormatData } = this.props;
            if (!field) {
                return;
            }

            unLoadFormatData(field);
        }
        componentDidUpdate() {
            const { field, resource, preLoadFormatData } = this.props;
            if (!field) {
                return;
            }

            preLoadFormatData({ field, value: resource[field.name] });
        }
        render() {
            const {
                preLoadFormatData,
                formatData,
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

            if (formatData === 'no result') {
                return (
                    <p style={styles.message}>{polyglot.t('no_chart_data')}</p>
                );
            }

            if (!isLoaded) {
                return <Loading>{polyglot.t('loading')}</Loading>;
            }

            return (
                <FormatView {...props} field={field} formatData={formatData} />
            );
        }
    }

    GraphItem.WrappedComponent = FormatView;

    const mapStateToProps = (state, { field }) => ({
        resource: fromCharacteristic.getCharacteristicsAsResource(state),
        formatData: fromFormat.getFormatData(state, field.name),
        isLoaded: field && fromFormat.isFormatDataLoaded(state, field.name),
        error: fromFormat.getFormatError(state, field.name),
    });

    const mapDispatchToProps = {
        preLoadFormatData,
        unLoadFormatData,
    };

    return compose(connect(mapStateToProps, mapDispatchToProps), translate)(
        GraphItem,
    );
};
