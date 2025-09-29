import { useMemo } from 'react';
import { useRouteMatch } from 'react-router';

export function useResourceUri() {
    const routeMatch = useRouteMatch();

    return useMemo(() => {
        const { path, params } = routeMatch;

        if (path === '/uid:/:uri') {
            // @ts-expect-error TS2339
            return `uid:/${params.uri}`;
        }

        if (path === '/ark:/:naan/:rest') {
            // @ts-expect-error TS2339
            return `ark:/${params.naan}/${params.rest}`;
        }

        if (path === '/graph/:name') {
            // @ts-expect-error TS2339
            return `/graph/${params.name}`;
        }

        if (path === '/') {
            return '/';
        }

        return null;
    }, [routeMatch]);
}
