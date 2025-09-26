import { useMemo } from 'react';
// @ts-expect-error TS7016
import { useRouteMatch } from 'react-router';

export function useResourceUri() {
    const routeMatch = useRouteMatch();

    return useMemo(() => {
        const { path, params } = routeMatch;

        if (path === '/uid:/:uri') {
            return `uid:/${params.uri}`;
        }

        if (path === '/ark:/:naan/:rest') {
            return `ark:/${params.naan}/${params.rest}`;
        }

        if (path === '/graph/:name') {
            return `/graph/${params.name}`;
        }

        if (path === '/') {
            return '/';
        }

        return null;
    }, [routeMatch]);
}
