import { lazy, Suspense, type ComponentType } from 'react';
import Loading from '../components/Loading';

/**
 * Moves a heavy component (and its dependencies) out of the main bundle:
 * its chunk is only downloaded the first time it is rendered.
 */
export const lazyComponent = <P extends object>(
    load: () => Promise<{ default: ComponentType<P> }>,
) => {
    const LazyComponent = lazy(load);
    const LazyLoadedComponent = (props: P) => (
        <Suspense fallback={<Loading>{null}</Loading>}>
            {/* @ts-expect-error TS2322: props are forwarded as is */}
            <LazyComponent {...props} />
        </Suspense>
    );
    return LazyLoadedComponent;
};
