import { renderHook } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { useResourceUri } from './useResourceUri';

// @ts-expect-error TS7031
function TestRouter({ children, ...rest }) {
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

TestRouter.propTypes = {
    children: PropTypes.node.isRequired,
    initialEntries: PropTypes.arrayOf(PropTypes.string),
    initialIndex: PropTypes.number,
};

describe('useResourceUri', () => {
    it('should return resource id for UID resources', () => {
        const { result } = renderHook(() => useResourceUri(), {
            // @ts-expect-error TS2322
            wrapper: TestRouter,
            initialProps: {
                initialEntries: ['/uid:/0579J7JN'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBe('uid:/0579J7JN');
    });

    it('should return resource id for ARK resources', () => {
        const { result } = renderHook(() => useResourceUri(), {
            // @ts-expect-error TS2322
            wrapper: TestRouter,
            initialProps: {
                initialEntries: ['/ark:/67375/1BB-1JGMFXJK-2'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBe('ark:/67375/1BB-1JGMFXJK-2');
    });

    it('should return "/graph/:name" for graph', () => {
        const { result } = renderHook(() => useResourceUri(), {
            // @ts-expect-error TS2322
            wrapper: TestRouter,
            initialProps: {
                initialEntries: ['/graph/gavF'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBe('/graph/gavF');
    });

    it('should return "/" for home', () => {
        const { result } = renderHook(() => useResourceUri(), {
            // @ts-expect-error TS2322
            wrapper: TestRouter,
            initialProps: {
                initialEntries: ['/'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBe('/');
    });

    it('should return null otherwise', () => {
        const { result } = renderHook(() => useResourceUri(), {
            // @ts-expect-error TS2322
            wrapper: TestRouter,
            initialProps: {
                initialEntries: ['/other'],
                initialIndex: 0,
            },
        });

        expect(result.current).toBeNull();
    });
});
