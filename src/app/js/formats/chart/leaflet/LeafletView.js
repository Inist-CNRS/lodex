import React, {
    useEffect,
    useMemo,
    useState,
    Suspense,
    useCallback,
} from 'react';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import compose from 'recompose/compose';
import zip from 'lodash/zip';
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

const LazyMap = React.lazy(() => import("./LeafletMap.js"));

const LeafletView = ({
    formatData,
    p,
    zoom,
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
            .map(x => {
                if (!Array.isArray(x._id)) {
                    return {
                        _id: [x._id],
                        value: [x.value],
                    }
                }
                return x;
            })
            .map(x => {
                return zip(x._id, x.value)
            }));
        return {
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
                    txt = value;
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

