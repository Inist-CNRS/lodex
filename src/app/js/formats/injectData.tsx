import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import { withRouter } from 'react-router';
// @ts-expect-error TS7016
import isEqual from 'lodash/isEqual';
// @ts-expect-error TS7016
import get from 'lodash/get';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';
import { fromFormat } from '../public/selectors';
import { preLoadFormatData, loadFormatData, unLoadFormatData } from './reducer';
import Loading from '../lib/components/Loading';
import InvalidFormat from './InvalidFormat';
import { CircularProgress } from '@mui/material';
import { translate } from '../i18n/I18NContext';

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
            backgroundColor: 'rgba(0,0,0,0.15)',
            opacity: 0,
            animationDuration: '150ms',
            animationFillMode: 'forwards',
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

const animationKeyframes = `
@keyframes injectDataLoadingStart {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes injectDataLoadingEnd {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}`;

// @ts-expect-error TS7006
const getCreateUrl = (url) => {
    if (typeof url === 'function') {
        return url;
    }
    if (typeof url === 'string') {
        return () => url;
    }
    // @ts-expect-error TS7031
    return ({ field, resource }) => resource[field.name];
};

// @ts-expect-error TS7006
const isHomePage = (location) => get(location, 'pathname', '') === '/';

export default (url = null, checkFormatLoaded = null, withUri = false) =>
    // @ts-expect-error TS7006
    (FormatView) => {
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
                isFormatLoading: PropTypes.bool.isRequired,
                error: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
                location: PropTypes.shape({ pathname: PropTypes.string }),
                p: polyglotPropTypes.isRequired,
            };

            // @ts-expect-error TS7006
            constructor(props) {
                super(props);
                this.state = {
                    isLoading: true,
                };
                this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
            }

            loadFormatData = ({ ...args }) => {
                // @ts-expect-error TS2339
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

            // @ts-expect-error TS7006
            filterFormatData = (filter) => {
                this.loadFormatData({
                    filter,
                });
            };

            unLoadFormatData = ({ ...args }) => {
                // @ts-expect-error TS2339
                const { unLoadFormatData } = this.props;
                unLoadFormatData({ ...args });
            };

            UNSAFE_componentWillMount() {
                // @ts-expect-error TS2339
                const { field } = this.props;
                if (!field) {
                    return;
                }
                this.loadFormatData({});
            }

            componentWillUnmount() {
                // @ts-expect-error TS2339
                const { field } = this.props;
                if (!field) {
                    return;
                }
                this.unLoadFormatData(field);
            }

            // @ts-expect-error TS7006
            componentDidUpdate(prevProps) {
                // @ts-expect-error TS2339
                const { field, resource } = this.props;

                // @ts-expect-error TS2339
                if (!this.state.isLoading && this.props.isFormatLoading) {
                    this.setState({
                        isLoading: true,
                    });
                }

                if (
                    !field ||
                    (isEqual(field, prevProps.field) &&
                        resource[field.name] ===
                            prevProps.resource[prevProps.field.name])
                ) {
                    return;
                }

                this.loadFormatData({});
            }

            handleAnimationEnd() {
                // @ts-expect-error TS2339
                if (this.state.isLoading && !this.props.isFormatLoading) {
                    this.setState({
                        isLoading: false,
                    });
                }
            }

            render() {
                const {
                    // @ts-expect-error TS2339
                    loadFormatData,
                    // @ts-expect-error TS2339
                    formatTotal,
                    // @ts-expect-error TS2339
                    formatData,
                    // @ts-expect-error TS2339
                    p: polyglot,
                    // @ts-expect-error TS2339
                    field,
                    // @ts-expect-error TS2339
                    isLoaded,
                    // @ts-expect-error TS2339
                    isFormatLoading,
                    // @ts-expect-error TS2339
                    error,
                    // @ts-expect-error TS2339
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
                        <p style={styles.message}>
                            {polyglot.t('chart_error')}
                        </p>
                    );
                }

                if (
                    formatData === 'no result' ||
                    (formatData != undefined && formatData.length === 0)
                ) {
                    return (
                        <p style={styles.message}>
                            {polyglot.t('no_chart_data')}
                        </p>
                    );
                }

                if (!isLoaded) {
                    return <Loading>{polyglot.t('loading')}</Loading>;
                }

                return (
                    // @ts-expect-error TS2322
                    <div style={styles.format.container}>
                        <style>{animationKeyframes}</style>
                        <div
                            onAnimationEnd={this.handleAnimationEnd}
                            // @ts-expect-error TS2322
                            style={{
                                ...styles.format.loading,
                                animationName: isFormatLoading
                                    ? 'injectDataLoadingStart'
                                    : 'injectDataLoadingEnd',
                            }}
                        ></div>
                        {/*
                         // @ts-expect-error TS2339 */}
                        {this.state.isLoading ? (
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

        // @ts-expect-error TS2339
        GraphItem.WrappedComponent = FormatView;

        // @ts-expect-error TS7006
        const mapStateToProps = (state, { field, resource }) => {
            const isLoaded =
                typeof checkFormatLoaded == 'function'
                    // @ts-expect-error TS2349
                    ? checkFormatLoaded(field)
                    // @ts-expect-error TS2339
                    : field && fromFormat.isFormatDataLoaded(state, field.name);
            return {
                resource,
                // @ts-expect-error TS2339
                formatData: fromFormat.getFormatData(state, field.name),
                // @ts-expect-error TS2339
                formatTotal: fromFormat.getFormatTotal(state, field.name),
                isLoaded,
                isFormatLoading: get(state, 'dataset.formatLoading', false),
                // @ts-expect-error TS2339
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
