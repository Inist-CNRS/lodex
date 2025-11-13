import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { useResourceUri } from './useResourceUri';

interface TestRouterProps {
    children: React.ReactNode;
    initialEntries?: string[];
    initialIndex?: number;
}

function TestRouter({ children, ...rest }: TestRouterProps) {
    return (
        <MemoryRouter {...rest}>
            <Switch>
                <Route exact path="/" render={() => children} />
                <Route exact path="/graph/:name" render={() => children} />
                <Route exact path="/uid:/:uri" render={() => children} />
                <Route exact path="/ark:/:naan/:rest" render={() => children} />
                <Route exact path="/other" render={() => children} />
            </Switch>
        </MemoryRouter>
    );
}

describe('useResourceUri', () => {
    it('should return resource id for UID resources', () => {
        const { result } = renderHook(() => useResourceUri(), {
            wrapper: TestRouter,
            // @ts-expect-error TS2741
            initialProps: {
                initialEntries: ['/uid:/0579J7JN'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBe('uid:/0579J7JN');
    });

    it('should return resource id for ARK resources', () => {
        const { result } = renderHook(() => useResourceUri(), {
            wrapper: TestRouter,
            // @ts-expect-error TS2741
            initialProps: {
                initialEntries: ['/ark:/67375/1BB-1JGMFXJK-2'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBe('ark:/67375/1BB-1JGMFXJK-2');
    });

    it('should return "/graph/:name" for graph', () => {
        const { result } = renderHook(() => useResourceUri(), {
            wrapper: TestRouter,
            // @ts-expect-error TS2741
            initialProps: {
                initialEntries: ['/graph/gavF'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBe('/graph/gavF');
    });

    it('should return "/" for home', () => {
        const { result } = renderHook(() => useResourceUri(), {
            wrapper: TestRouter,
            // @ts-expect-error TS2741
            initialProps: {
                initialEntries: ['/'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBe('/');
    });

    it('should return null otherwise', () => {
        const { result } = renderHook(() => useResourceUri(), {
            wrapper: TestRouter,
            // @ts-expect-error TS2741
            initialProps: {
                initialEntries: ['/other'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBeNull();
    });
});
