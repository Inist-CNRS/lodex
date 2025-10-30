import { useMemo, useState, Suspense, useCallback } from 'react';
import compose from 'recompose/compose';

import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import Loading from '../../../lib/components/Loading';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import VennDiagram from './VennDiagram';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
        width: '100%',
        height: '100%',
        maxHeight: typeof window !== 'undefined' ? window.innerHeight - 96 : 0,
    },
};

interface VennProps {
    colorSet?: string[];
    formatData?: unknown[];
}

const Venn = ({ formatData, colorSet }: VennProps) => {
    const { translate } = useTranslate();
    const [{ width, height }, setDimensions] = useState({
        width: 0,
        height: 0,
    });

    // @ts-expect-error TS7006
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
            input: formatData.map((x) => x),
        };
    }, [formatData]);

    return (
        <div style={{ height: `500px` }}>
            <FormatFullScreenMode>
                {/*
                 // @ts-expect-error TS2322 */}
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
                    <div>{<MouseIcon />}</div>
                </div>
            </FormatFullScreenMode>
        </div>
    );
};

// @ts-expect-error TS2345
export default compose(injectData())(Venn);
