import React, {
    useEffect,
    useMemo,
    useState,
    Suspense,
    useCallback,
} from 'react';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import zip from 'lodash/zip';
// @ts-expect-error TS7016
import flatten from 'lodash/flatten';

import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import PropTypes from 'prop-types';
import Loading from '../../../lib/components/Loading';
import { useTranslate } from '../../../i18n/I18NContext';
import { ClientOnly, useClientOnly } from "react-client-only";

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
        width: '100%',
        height: '500px',
        maxHeight: typeof window !== 'undefined' ? window.innerHeight - 96 : 0,
    },
};

const LazyMap = React.lazy(() => import("./LeafletMap"));

const LeafletView = ({
    // @ts-expect-error TS7031
    formatData,
    // @ts-expect-error TS7031
    p,
    // @ts-expect-error TS7031
    zoom,
    // @ts-expect-error TS7031
    center,
  }) => {
    const mounted = useClientOnly();

    const { translate } = useTranslate();


    const [{ width, height }, setDimensions] = useState({
        width: '100%',
        height: '500px',
   });

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
        const formatDataNormalized = flatten(formatData
            // @ts-expect-error TS7006
            .map(x => {
                // Multi values for all cases
                let a = x._id;
                let b = x.value;
                // @ts-expect-error TS2304
                if (typeof _id === 'string') {
                    a = [x._id]; // '["39.5015541259931","-99.0602406280213"]'
                }
                if (Array.isArray(x._id) && x._id.length === 2) {
                    // example: [46.123, 23.344]
                    a = [x._id];
                }
                if (!Array.isArray(x._id)) {
                    // example: { lat: 46.123, lnt : 23.344 }
                    a = [x._id];
                }
                if (!Array.isArray(x.value)) {
                    b = [x.value];
                }
                return {
                    a,
                    b,
                }
            })
            // @ts-expect-error TS7006
            .map(y => {
                return zip(y.a, y.b)
            }));
        return {
            // @ts-expect-error TS7031
            input: formatDataNormalized.map(([_id, value]) => {
                let latlng; // see https://leafletjs.com/reference.html#latlng
                try {
                    latlng = (typeof _id === 'string') ? JSON.parse(_id) : _id;
                }
                catch (e) {
                    console.warn('Unable to parse latlng', e);
                }
                if (!latlng) {
                    return {};
                }
                let txt;
                if (typeof value === 'number') {
                    txt = `${value} ${translate('document_tooltip')}(s)`;
                } else {
                    txt = String(value);
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
            }),
        };
    }, [formatData]);

    if (!mounted) {
        return <Loading>{translate('loading')}</Loading>;
    }
    return (
        <div style={{ height }}>
           <ClientOnly>
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container} ref={containerRef}>
                    <Suspense fallback={<Loading>{translate('loading')}</Loading>}>
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

LeafletView.propTypes = {
    formatData: PropTypes.array.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(injectData())(LeafletView);

