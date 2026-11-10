import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import Loading from '../components/Loading';

const RELOADED_KEY = 'lodex-chunk-reload';

// Chunks are hashed and replaced on every deploy: a tab opened before a deploy
// requests chunks that no longer exist. Reload once to get the new ones, and
// rethrow if it still fails so that the nearest error boundary handles it.
export const reloadOnceOnError =
    <T,>(load: () => Promise<T>) =>
    () =>
        load().then(
            (module) => {
                sessionStorage.removeItem(RELOADED_KEY);
                return module;
            },
            (error) => {
                if (sessionStorage.getItem(RELOADED_KEY)) {
                    throw error;
                }
                sessionStorage.setItem(RELOADED_KEY, '1');
                window.location.reload();
                return new Promise<T>(() => {});
            },
        );

/**
 * Moves a heavy component (and its dependencies) out of the main bundle:
 * its chunk is only downloaded the first time it is rendered.
 */
export const lazyComponent = <P extends object>(
    load: () => Promise<{ default: ComponentType<P> }>,
    { fallback = <Loading>{null}</Loading> }: { fallback?: ReactNode } = {},
) => {
    const LazyComponent = lazy(reloadOnceOnError(load));
    const LazyLoadedComponent = (props: P) => (
        <Suspense fallback={fallback}>
            {/* @ts-expect-error TS2322: props are forwarded as is */}
            <LazyComponent {...props} />
        </Suspense>
    );
    return LazyLoadedComponent;
};
