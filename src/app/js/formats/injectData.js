import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import isEqual from 'lodash.isequal';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes.js';
import { fromFormat, fromResource } from '../public/selectors';
import { fromCharacteristic } from '../sharedSelectors';
import {
    preLoadFormatData,
    loadFormatData,
    unLoadFormatData,
} from '../formats/reducer';
import Loading from '../lib/components/Loading';
import InvalidFormat from './InvalidFormat';

const styles = {
    message: {
        margin: 20,
    },
};

const getCreateUrl = url => {
    if (typeof url === 'function') {
        return url;
    }
    if (typeof url === 'string') {
        return () => url;
    }

    return ({ field, resource }) => resource[field.name];
};

export default url => FormatView => {
    const createUrl = getCreateUrl(url);

    class GraphItem extends Component {
        static propTypes = {
            field: fieldPropTypes.isRequired,
            resource: PropTypes.object.isRequired,
            preLoadFormatData: PropTypes.func.isRequired,
            unLoadFormatData: PropTypes.func.isRequired,
            loadFormatData: PropTypes.func.isRequired,
            formatData: PropTypes.any,
            isLoaded: PropTypes.bool.isRequired,
            error: PropTypes.object,
            p: polyglotPropTypes.isRequired,
        };

        loadFormatData = () => {
            const { loadFormatData } = this.props;

            const value = createUrl(this.props);
            if (!value) {
                return;
            }

            loadFormatData({ ...this.props, value });
        };

        UNSAFE_componentWillMount() {
            const { field } = this.props;
            if (!field) {
                return;
            }
            this.loadFormatData();
        }
        componentWillUnmount() {
            const { field, unLoadFormatData } = this.props;
            if (!field) {
                return;
            }

            unLoadFormatData(field);
        }

        componentDidUpdate(prevProps) {
            const { field, resource } = this.props;
            if (
                !field ||
                (isEqual(field, prevProps.field) &&
                    resource[field.name] ===
                        prevProps.resource[prevProps.field.name])
            ) {
                return;
            }

            this.loadFormatData();
        }

        filterFormatData = filter => {
            const { field, loadFormatData } = this.props;
            loadFormatData({
                field,
                value: createUrl(this.props),
                filter,
            });
        };

        render() {
            const {
                loadFormatData,
                formatData,
                p: polyglot,
                field,
                isLoaded,
                error,
                resource,
                ...props
            } = this.props;

            if (error) {
                return error === 'bad value' ? (
                    <InvalidFormat
                        format={field.format}
                        value={resource[field.name]}
                    />
                ) : (
                    <p style={styles.message}>{polyglot.t('chart_error')}</p>
                );
            }

            if (
                formatData === 'no result' ||
                (formatData != undefined && formatData.length === 0)
            ) {
                return (
                    <p style={styles.message}>{polyglot.t('no_chart_data')}</p>
                );
            }

            if (!isLoaded) {
                return <Loading>{polyglot.t('loading')}</Loading>;
            }

            return (
                <FormatView
                    {...props}
                    p={polyglot}
                    field={field}
                    resource={resource}
                    formatData={formatData}
                    filterFormatData={this.filterFormatData}
                />
            );
        }
    }

    GraphItem.WrappedComponent = FormatView;

    const mapStateToProps = (state, { field }) => ({
        resource:
            field.cover === 'dataset'
                ? fromCharacteristic.getCharacteristicsAsResource(state)
                : fromResource.getResourceLastVersion(state),
        formatData: fromFormat.getFormatData(state, field.name),
        isLoaded: !!field,
        error: fromFormat.getFormatError(state, field.name),
    });

    const mapDispatchToProps = {
        preLoadFormatData,
        unLoadFormatData,
        loadFormatData,
    };

    return compose(
        connect(
            mapStateToProps,
            mapDispatchToProps,
        ),
        translate,
    )(GraphItem);
};
