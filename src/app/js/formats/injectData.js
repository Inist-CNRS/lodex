import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import isEqual from 'lodash.isequal';
import get from 'lodash.get';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes.js';
import { fromFormat } from '../public/selectors';
import { preLoadFormatData, loadFormatData, unLoadFormatData } from './reducer';
import Loading from '../lib/components/Loading';
import InvalidFormat from './InvalidFormat';
import { CircularProgress } from '@mui/material';

const styles = {
    message: {
        margin: 20,
    },
    format: {
        container: {
            position: 'relative',
        },
        loading: {
            zIndex: 99998,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: 'none',
            transitionDuration: '150ms',
        },
        progress: {
            zIndex: 99999,
            top: 'calc(50% - 20px)',
            left: 'calc(50% - 20px)',
            position: 'absolute',
            pointerEvents: 'none',
        },
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

const isHomePage = location => get(location, 'pathname', '') === '/';

export default (
    url = null,
    checkFormatLoaded = null,
    withUri = false,
) => FormatView => {
    const createUrl = getCreateUrl(url);

    class GraphItem extends Component {
        static propTypes = {
            field: fieldPropTypes.isRequired,
            resource: PropTypes.object.isRequired,
            preLoadFormatData: PropTypes.func.isRequired,
            unLoadFormatData: PropTypes.func.isRequired,
            loadFormatData: PropTypes.func.isRequired,
            formatData: PropTypes.any,
            formatTotal: PropTypes.any,
            isLoaded: PropTypes.bool.isRequired,
            isDataSetLoading: PropTypes.bool.isRequired,
            error: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
            location: PropTypes.shape({ pathname: PropTypes.string }),
            p: polyglotPropTypes.isRequired,
        };

        loadFormatData = ({ ...args }) => {
            const { loadFormatData, location } = this.props;

            const value = createUrl(this.props);

            if (!value) {
                return;
            }

            const withFacets = !isHomePage(location);

            loadFormatData({
                ...this.props,
                value,
                withUri,
                withFacets,
                ...args,
            });
        };

        filterFormatData = filter => {
            this.loadFormatData({
                filter,
            });
        };

        unLoadFormatData = ({ ...args }) => {
            const { unLoadFormatData } = this.props;
            unLoadFormatData({ ...args });
        };

        UNSAFE_componentWillMount() {
            const { field } = this.props;
            if (!field) {
                return;
            }
            this.loadFormatData();
        }

        componentWillUnmount() {
            const { field } = this.props;
            if (!field) {
                return;
            }
            this.unLoadFormatData(field);
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

        render() {
            const {
                loadFormatData,
                formatTotal,
                formatData,
                p: polyglot,
                field,
                isLoaded,
                isDataSetLoading,
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
                <div style={styles.format.container}>
                    <div
                        style={{
                            ...styles.format.loading,
                            backgroundColor: isDataSetLoading
                                ? 'rgba(0,0,0,0.15)'
                                : 'rgba(0,0,0,0)',
                        }}
                    ></div>
                    {isDataSetLoading ? (
                        <CircularProgress
                            sx={styles.format.progress}
                            variant="indeterminate"
                            size={40}
                        />
                    ) : null}
                    <FormatView
                        {...props}
                        p={polyglot}
                        field={field}
                        resource={resource}
                        formatData={formatData}
                        formatTotal={formatTotal}
                        filterFormatData={this.filterFormatData}
                    />
                </div>
            );
        }
    }

    GraphItem.WrappedComponent = FormatView;

    const mapStateToProps = (state, { field, resource }) => {
        const isLoaded =
            typeof checkFormatLoaded == 'function'
                ? checkFormatLoaded(field)
                : field && fromFormat.isFormatDataLoaded(state, field.name);
        return {
            resource,
            formatData: fromFormat.getFormatData(state, field.name),
            formatTotal: fromFormat.getFormatTotal(state, field.name),
            isLoaded,
            isDataSetLoading: get(state, 'dataset.loading', false),
            error: fromFormat.getFormatError(state, field.name),
        };
    };

    const mapDispatchToProps = {
        preLoadFormatData,
        unLoadFormatData,
        loadFormatData,
    };

    return compose(
        connect(mapStateToProps, mapDispatchToProps),
        translate,
        withRouter,
    )(GraphItem);
};
