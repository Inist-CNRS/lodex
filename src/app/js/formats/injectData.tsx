import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import get from 'lodash/get';

import {
    loadFormatData as loadFormatDataAction,
    unLoadFormatData as unLoadFormatDataAction,
} from './reducer';
import Loading from '../lib/components/Loading';
import InvalidFormat from './InvalidFormat';
import { CircularProgress } from '@mui/material';
import type { Field } from '../propTypes';
import { useTranslate } from '../i18n/I18NContext';

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

interface GraphItemProps {
    field: Field;
    resource: object;
}

export default (url = null, checkFormatLoaded = null, withUri = false) =>
    // @ts-expect-error TS7006
    (FormatView) => {
        const createUrl = getCreateUrl(url);

        const GraphItem = (props: GraphItemProps) => {
            const location = useLocation();
            const dispatch = useDispatch();
            const formatState = useSelector(
                (state: any) => state.format[props.field.name],
            );

            const isFormatLoading = useSelector((state: any) =>
                get(state, 'dataset.formatLoading', false),
            );
            const { isFormatLoaded, formatData, formatTotal, formatError } =
                useMemo(() => {
                    if (!formatState || formatState === 'loading') {
                        return {
                            isFormatDataLoaded: false,
                            isFormatLoading: true,
                        };
                    }
                    return {
                        isFormatLoaded: true,
                        formatData: formatState.data,
                        formatTotal: formatState.total,
                        formatError: formatState.error,
                    };
                }, [formatState]);
            const isLoaded = useMemo(
                () =>
                    typeof checkFormatLoaded == 'function'
                        ? // @ts-expect-error TS2349
                          checkFormatLoaded(props.field)
                        : props.field && isFormatLoaded,
                [props.field, isFormatLoaded],
            );
            const { translate } = useTranslate();

            const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);

            const loadFormatData = useCallback(
                (values: object) => {
                    const value = createUrl(props);

                    if (!value) {
                        return;
                    }

                    const withFacets = !isHomePage(location);
                    dispatch(
                        loadFormatDataAction({
                            field: props.field,
                            resource: props.resource,
                            value,
                            withUri,
                            withFacets,
                            ...values,
                        }),
                    );
                },
                [dispatch, props, location],
            );

            const filterFormatData = useCallback(
                (filter: Record<string, unknown>) => {
                    loadFormatData({
                        filter,
                    });
                },
                [loadFormatData],
            );

            const handleAnimationEnd = useCallback(() => {
                setIsAnimationPlaying(false);
            }, []);

            // // Effect for component unmount (replaces componentWillUnmount)
            useEffect(() => {
                return () => {
                    if (!props.field) {
                        return;
                    }
                    dispatch(unLoadFormatDataAction(props.field));
                };
            }, []);

            // Effect to handle field/resource changes
            useEffect(() => {
                if (!props.field) {
                    return;
                }

                // This effect will run when field or resource changes
                loadFormatData({});
            }, [loadFormatData, props.field]);

            const { field, resource, ...restProps } = props;

            if (formatError) {
                return formatError === 'bad value' ? (
                    <InvalidFormat
                        // @ts-expect-error TS18046
                        format={field.format}
                        // @ts-expect-error TS7053
                        value={resource[field.name]}
                    />
                ) : (
                    <p style={styles.message}>{translate('chart_error')}</p>
                );
            }

            if (
                formatData === 'no result' ||
                (formatData != undefined && formatData.length === 0)
            ) {
                return (
                    <p style={styles.message}>{translate('no_chart_data')}</p>
                );
            }

            if (!isLoaded) {
                return <Loading>{translate('loading')}</Loading>;
            }

            return (
                // @ts-expect-error TS2322
                <div style={styles.format.container}>
                    <style>{animationKeyframes}</style>
                    <div
                        onAnimationEnd={handleAnimationEnd}
                        // @ts-expect-error TS2322
                        style={{
                            ...styles.format.loading,
                            animationName: isFormatLoading
                                ? 'injectDataLoadingStart'
                                : 'injectDataLoadingEnd',
                        }}
                    ></div>
                    {isAnimationPlaying || isFormatLoading ? (
                        <CircularProgress
                            sx={styles.format.progress}
                            variant="indeterminate"
                            size={40}
                        />
                    ) : null}
                    <FormatView
                        {...restProps}
                        field={field}
                        resource={resource}
                        formatData={formatData}
                        formatTotal={formatTotal}
                        filterFormatData={filterFormatData}
                    />
                </div>
            );
        };

        GraphItem.WrappedComponent = FormatView;

        return memo(GraphItem, (prevProps, nextProps) => {
            return JSON.stringify(prevProps) === JSON.stringify(nextProps);
        });
    };
