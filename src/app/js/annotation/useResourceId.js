import { useMemo } from 'react';
import { useRouteMatch } from 'react-router';

export function useResourceId() {
    const routeMatch = useRouteMatch();

    return useMemo(() => {
        const { path, params } = routeMatch;

        if (path === '/uid:/:uri') {
            return `uid:/${params.uri}`;
        }

        if (path === '/ark:/:naan/:rest') {
            return `ark:/${params.naan}/${params.rest}`;
        }

        return null;
    }, [routeMatch]);
}
