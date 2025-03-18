import { renderHook } from '@testing-library/react-hooks';
import { useIsVisited, useRememberVisit } from './useRememberVisit';

describe('useRememberVisit', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should store resource.uri in localStorage', () => {
        renderHook(() => useRememberVisit({ uri: 'resource/uri' }));
        expect(
            JSON.parse(localStorage.getItem('default-viewed-resources')),
        ).toEqual(['resource/uri']);
    });

    it('should add resource.uri to other uri in localStorage', () => {
        localStorage.setItem(
            'default-viewed-resources',
            JSON.stringify(['uri/1', 'uri/2']),
        );
        renderHook(() => useRememberVisit({ uri: 'resource/uri' }));
        expect(
            JSON.parse(localStorage.getItem('default-viewed-resources')),
        ).toEqual(['uri/1', 'uri/2', 'resource/uri']);
    });

    it('should not add resource.uri in localStorage if it is already here and not dispatch newResourceVisited', () => {
        localStorage.setItem(
            'default-viewed-resources',
            JSON.stringify(['uri/1', 'uri/2', 'resource/uri']),
        );
        renderHook(() => useRememberVisit({ uri: 'resource/uri' }));
        expect(
            JSON.parse(localStorage.getItem('default-viewed-resources')),
        ).toEqual(['uri/1', 'uri/2', 'resource/uri']);
    });

    it('should not add anything if resource has no uri', () => {
        localStorage.setItem(
            'default-viewed-resources',
            JSON.stringify(['uri/1', 'uri/2']),
        );
        renderHook(() => useRememberVisit({}));
        expect(
            JSON.parse(localStorage.getItem('default-viewed-resources')),
        ).toEqual(['uri/1', 'uri/2']);
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
