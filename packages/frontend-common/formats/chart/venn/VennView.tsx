import { Suspense, useCallback, useMemo, useState } from 'react';
import compose from 'recompose/compose';

import Loading from '../../../components/Loading';
import { useTranslate } from '../../../i18n/I18NContext';
import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import VennDiagram from './VennDiagram';

const styles = {
    wrapper: {
        width: '100%',
        height: 'min(70vh, 600px)',
        minHeight: '350px',
        position: 'relative',
    },
    container: {
        overflow: 'hidden',
        userSelect: 'none',
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    mouseIcon: {
        position: 'absolute',
        right: 8,
        top: 8,
        zIndex: 2,
    },
} as const;

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
        if (!node) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
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
        <div style={styles.wrapper}>
            <FormatFullScreenMode forceRerenderOnToggle>
                <div style={styles.container} ref={containerRef}>
                    <Suspense
                        fallback={<Loading>{translate('loading')}</Loading>}
                    >
                        <VennDiagram
                            input={input}
                            width={Math.max(width - 40, 0)}
                            height={Math.max(height - 40, 0)}
                            colorSet={colorSet}
                        />
                    </Suspense>

                    <div style={styles.mouseIcon}>
                        <MouseIcon />
                    </div>
                </div>
            </FormatFullScreenMode>
        </div>
    );
};

// @ts-expect-error TS2345
export default compose(injectData(null, null, true))(Venn);
