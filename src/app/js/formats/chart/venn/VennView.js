import React, {
    useEffect,
    useMemo,
    useState,
    Suspense,
    useCallback,
} from 'react';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import compose from 'recompose/compose';

import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import PropTypes from 'prop-types';
import Loading from '../../../lib/components/Loading';
import { useTranslate } from '../../../i18n/I18NContext';
import VennDiagram  from './VennDiagram';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
        width: '100%',
        height: '100%',
        maxHeight: typeof window !== 'undefined' ? window.innerHeight - 96 : 0,
    },
};

const Venn = ({ formatData, p, colorSet }) => {
    const { translate } = useTranslate();
    const [{ width, height }, setDimensions] = useState({
        width: 0,
        height: 0,
    });

    const containerRef = useCallback((node) => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(() => {
            if (node)
                setDimensions({
                    width: node.clientWidth,
                    height: node.clientHeight,
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
        return {
            input: formatData.map(x=>x),
        };
    }, [formatData]);



    return (
        <div style={{ height: `500px` }}>
            <FormatFullScreenMode>
                <div style={styles.container} ref={containerRef}>
                    <Suspense
                        fallback={<Loading>{translate('loading')}</Loading>}
                        >
                        <VennDiagram
                            input={input}
                            width={width}
                            height={height}
                            colorSet={colorSet}
                        />
                    </Suspense>
                    <div>{<MouseIcon polyglot={p} />}</div>
                </div>
            </FormatFullScreenMode>
        </div>
    );
};

Venn.propTypes = {
    colorSet: PropTypes.arrayOf(PropTypes.string),
    formatData: PropTypes.arrayOf({
        source: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
        weight: PropTypes.number,
    }),
    p: polyglotPropTypes.isRequired,
};

export default compose(injectData())(Venn);
