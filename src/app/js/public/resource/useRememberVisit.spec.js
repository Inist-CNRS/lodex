import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useIsVisited, useRememberVisit } from './useRememberVisit';
import { createMemoryHistory } from 'history';
import configureStore from '../../configureStore';
import reducers from '../reducers';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { newResourceVisited } from '../search/reducer';

global.__DEBUG__ = false;
const memoryHistory = createMemoryHistory();
const { store } = configureStore(
    reducers,
    function* sagas() {},
    {},
    memoryHistory,
);

function TestWrapper({ children, dispatch }) {
    return <Provider store={{ ...store, dispatch }}>{children}</Provider>;
}
TestWrapper.propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func,
};

describe('useRememberVisit', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should store resource.uri in localStorage and dispatch newResourceVisited', () => {
        const dispatch = jest.fn();
        renderHook(() => useRememberVisit({ uri: 'resource/uri' }), {
            wrapper: TestWrapper,
            initialProps: { dispatch },
        });
        expect(
            JSON.parse(localStorage.getItem('default-viewed-resources')),
        ).toEqual(['resource/uri']);

        expect(dispatch).toHaveBeenCalledWith(newResourceVisited());
    });

    it('should add resource.uri to other uri in localStorage and dispatch newResourceVisited', () => {
        const dispatch = jest.fn();
        localStorage.setItem(
            'default-viewed-resources',
            JSON.stringify(['uri/1', 'uri/2']),
        );
        renderHook(() => useRememberVisit({ uri: 'resource/uri' }), {
            wrapper: TestWrapper,
            initialProps: { dispatch },
        });
        expect(
            JSON.parse(localStorage.getItem('default-viewed-resources')),
        ).toEqual(['uri/1', 'uri/2', 'resource/uri']);
        expect(dispatch).toHaveBeenCalledWith(newResourceVisited());
    });

    it('should not add resource.uri in localStorage if it is already here and not dispatch newResourceVisited', () => {
        const dispatch = jest.fn();
        localStorage.setItem(
            'default-viewed-resources',
            JSON.stringify(['uri/1', 'uri/2', 'resource/uri']),
        );
        renderHook(() => useRememberVisit({ uri: 'resource/uri' }), {
            wrapper: TestWrapper,
            initialProps: { dispatch },
        });
        expect(
            JSON.parse(localStorage.getItem('default-viewed-resources')),
        ).toEqual(['uri/1', 'uri/2', 'resource/uri']);
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('should not add anything if resource has no uri', () => {
        const dispatch = jest.fn();
        localStorage.setItem(
            'default-viewed-resources',
            JSON.stringify(['uri/1', 'uri/2']),
        );
        renderHook(() => useRememberVisit({}), {
            wrapper: TestWrapper,
            initialProps: { dispatch },
        });
        expect(
            JSON.parse(localStorage.getItem('default-viewed-resources')),
        ).toEqual(['uri/1', 'uri/2']);

        expect(dispatch).not.toHaveBeenCalled();
    });

    describe('useIsVisited', () => {
        it('should return false if resource.uri is an URL', () => {
            const { result } = renderHook(() =>
                useIsVisited({ uri: 'http://example.com' }),
            );
            expect(result.current).toBe(false);
        });

        it("should return false if resource.uri isn't in localStorage", () => {
            const { result } = renderHook(() =>
                useIsVisited({ uri: 'resource/uri' }),
            );
            expect(result.current).toBe(false);
        });

        it('should return true if resource.uri is in localStorage', () => {
            localStorage.setItem(
                'default-viewed-resources',
                JSON.stringify(['uri/a', 'resource/uri', 'uri/b']),
            );
            const { result } = renderHook(() =>
                useIsVisited({ uri: 'resource/uri' }),
            );
            expect(result.current).toBe(true);
        });
    });
});
