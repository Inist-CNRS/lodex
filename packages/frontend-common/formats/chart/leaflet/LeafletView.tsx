import React, { useMemo, useState, Suspense, useCallback } from 'react';
import compose from 'recompose/compose';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';

import injectData from '../../injectData';
import Loading from '../../../components/Loading';
import { useTranslate } from '../../../i18n/I18NContext';
import { ClientOnly, useClientOnly } from 'react-client-only';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
        width: '100%',
        height: '500px',
        maxHeight: typeof window !== 'undefined' ? window.innerHeight - 96 : 0,
    },
};

const LazyMap = React.lazy(() => import('./LeafletMap'));

interface LeafletViewProps {
    formatData: unknown[];
    p: unknown;
    zoom?: number;
    center?: number[];
}

const LeafletView = ({
    formatData,

    zoom,

    center,
}: LeafletViewProps) => {
    const mounted = useClientOnly();

    const { translate } = useTranslate();

    const [{ width, height }, setDimensions] = useState({
        width: '100%',
        height: '500px',
    });

    // @ts-expect-error TS7006
    const containerRef = useCallback((node) => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(() => {
            if (node)
                setDimensions({
                    width: `${node.clientWidth}px`,
                    height: `${node.clientHeight}px`,
                });
        });
        resizeObserver.observe(node);
    }, []);

    const { input } = useMemo(() => {
        if (!formatData) {
            return {
                input: [],
            };
        }
        const formatDataNormalized = flatten(
            formatData
                .map((x) => {
                    // Multi values for all cases
                    // @ts-expect-error TS18046
                    let a = x._id;
                    // @ts-expect-error TS18046
                    let b = x.value;
                    if (
                        // @ts-expect-error TS18046
                        typeof x._id === 'string' &&
                        // @ts-expect-error TS18046
                        typeof x.value === 'string'
                    ) {
                        // Exemple : { "_id": "39.5015541259931", "value": "-99.0602406280213"] }
                        // @ts-expect-error TS18046
                        a = [[x._id, x.value]];
                        // @ts-expect-error TS18046
                        b = [[x._id, x.value]];
                    }
                    if (
                        // @ts-expect-error TS18046
                        typeof x._id === 'string' &&
                        // @ts-expect-error TS18046
                        Array.isArray(x.value) &&
                        // @ts-expect-error TS18046
                        x.value.length === 2
                    ) {
                        // Exemple : { "_id": "FRANCE" , "value": ["39.5015541259931","-99.0602406280213"] }
                        // @ts-expect-error TS18046
                        a = [x.value];
                        // @ts-expect-error TS18046
                        b = [x._id];
                    }
                    if (
                        // @ts-expect-error TS18046
                        typeof x._id === 'string' &&
                        // @ts-expect-error TS18046
                        typeof x.value === 'object'
                    ) {
                        // Exemple : { "_id": "FRANCE" , "value": {lat: "39.5015541259931", lnt:"-99.0602406280213"} }
                        // @ts-expect-error TS18046
                        a = [x.value];
                        // @ts-expect-error TS18046
                        b = [x._id];
                    }
                    // @ts-expect-error TS18046
                    if (Array.isArray(x._id) && x._id.length === 2) {
                        // Exemple : { "_id": ["39.5015541259931","-99.0602406280213"], "value": "FRANCE" }
                        // @ts-expect-error TS18046
                        a = [x._id];
                        // @ts-expect-error TS18046
                        b = [x.value];
                    }
                    // @ts-expect-error TS18046
                    if (typeof x._id === 'object') {
                        // Exemple : { "_id":  {lat: "39.5015541259931", lnt:"-99.0602406280213"}, "value": "FRANCE" }
                        // @ts-expect-error TS18046
                        a = [x._id];
                        // @ts-expect-error TS18046
                        b = [x.value];
                    }
                    return {
                        a,
                        b,
                    };
                })
                .map((y) => {
                    return zip(y.a, y.b);
                }),
        );
        const input = formatDataNormalized.map(([_id, value]) => {
            let latlng; // see https://leafletjs.com/reference.html#latlng
            try {
                latlng = typeof _id === 'string' ? JSON.parse(_id) : _id;
            } catch (e) {
                console.warn('Unable to parse latlng', e);
            }
            if (!latlng && !value) {
                return {};
            }
            let txt;
            if (!latlng && value) {
                latlng = value;
                txt = _id;
            }
            if (!txt) {
                if (typeof value === 'number') {
                    txt = `${value} ${translate('document_tooltip')}(s)`;
                } else {
                    txt = String(value);
                }
            }
            if (Array.isArray(latlng)) {
                return {
                    txt,
                    lat: Number(latlng[0]),
                    lng: Number(latlng[1]),
                };
            }
            if (latlng.lng && latlng.lat) {
                return {
                    txt,
                    lat: Number(latlng.lat),
                    lng: Number(latlng.lng),
                };
            }
            if (latlng.longitude && latlng.latitude) {
                return {
                    txt,
                    lat: Number(latlng.latitude),
                    lng: Number(latlng.longitude),
                };
            }
            return {};
        });
        return {
            input,
        };
    }, [formatData, translate]);
    if (!mounted) {
        return <Loading>{translate('loading')}</Loading>;
    }
    return (
        <div style={{ height }}>
            {/*
                // @ts-expect-error TS2559 */}
            <ClientOnly>
                {/*
                        // @ts-expect-error TS2322 */}
                <div style={styles.container} ref={containerRef}>
                    <Suspense
                        fallback={<Loading>{translate('loading')}</Loading>}
                    >
                        <LazyMap
                            input={input}
                            width={width}
                            height={height}
                            zoom={zoom || 13}
                            center={center || [48.8569, 2.3522]}
                        />
                    </Suspense>
                </div>
            </ClientOnly>
        </div>
    );
};

// @ts-expect-error TS2345
export default compose(injectData(null, null, true))(LeafletView);
