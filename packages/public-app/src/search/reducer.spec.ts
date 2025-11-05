import reducer, {
    SEARCH_ANNOTATIONS,
    SEARCH_NEW_RESOURCE_ANNOTATED,
} from './reducer';

describe('search reducer', () => {
    describe('SEARCH_ANNOTATIONS', () => {
        it('should handle mode === null removing resourceUris', () => {
            const state = {
                filters: {
                    annotations: 'my-annotations',
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                },
            };
            const action = {
                type: SEARCH_ANNOTATIONS,
                payload: { mode: null, resourceUris: ['uri1', 'uri2'] },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                page: 0,
                filters: {
                    annotations: null,
                    resourceUrisWithAnnotation: undefined,
                },
            });
        });

        it('should handle mode === annotated', () => {
            const state = {
                filters: {
                    annotations: null,
                    resourceUrisWithAnnotation: undefined,
                },
            };
            const action = {
                type: SEARCH_ANNOTATIONS,
                payload: {
                    mode: 'annotated',
                    resourceUris: ['uri1', 'uri2'],
                },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                page: 0,
                filters: {
                    annotations: 'annotated',
                    resourceUrisWithAnnotation: undefined,
                },
            });
        });

        it('should handle mode === my-annotations', () => {
            const state = {
                filters: {
                    annotations: null,
                    resourceUrisWithAnnotation: undefined,
                },
            };
            const action = {
                type: SEARCH_ANNOTATIONS,
                payload: {
                    mode: 'my-annotations',
                    resourceUris: ['uri1', 'uri2'],
                },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                page: 0,
                filters: {
                    annotations: 'my-annotations',
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                },
            });
        });

        it('should handle mode === not-my-annotations', () => {
            const state = {
                filters: {
                    annotations: null,
                    resourceUrisWithAnnotation: undefined,
                },
            };
            const action = {
                type: SEARCH_ANNOTATIONS,
                payload: {
                    mode: 'not-my-annotations',
                    resourceUris: ['uri1', 'uri2'],
                },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                page: 0,
                filters: {
                    annotations: 'not-my-annotations',
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                },
            });
        });

        it('should handle mode === not-annotated', () => {
            const state = {
                filters: {
                    annotations: null,
                    resourceUrisWithAnnotation: undefined,
                },
            };
            const action = {
                type: SEARCH_ANNOTATIONS,
                payload: {
                    mode: 'not-annotated',
                    resourceUris: ['uri1', 'uri2'],
                },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                page: 0,
                filters: {
                    annotations: 'not-annotated',
                    resourceUrisWithAnnotation: undefined,
                },
            });
        });
    });
    describe('SEARCH_NEW_RESOURCE_ANNOTATED', () => {
        it('should add resourceUri to resourceUrisWithAnnotation if it is set', () => {
            const state = {
                filters: {
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                },
            };
            const action = {
                type: SEARCH_NEW_RESOURCE_ANNOTATED,
                payload: { resourceUri: 'uri3' },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                filters: {
                    resourceUrisWithAnnotation: ['uri1', 'uri2', 'uri3'],
                },
            });
        });
        it('should add resourceUri to resourceUrisWithAnnotation if it is set even if empty', () => {
            const state = {
                filters: {
                    resourceUrisWithAnnotation: [],
                },
            };
            const action = {
                type: 'SEARCH_NEW_RESOURCE_ANNOTATED',
                payload: { resourceUri: 'uri3' },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                filters: {
                    resourceUrisWithAnnotation: ['uri3'],
                },
            });
        });

        it('should not add resourceUri to resourceUrisWithAnnotation if it is not set', () => {
            const state = {
                filters: { resourceUrisWithAnnotation: null },
            };
            const action = {
                type: 'SEARCH_NEW_RESOURCE_ANNOTATED',
                payload: { resourceUri: 'uri3' },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                filters: { resourceUrisWithAnnotation: null },
            });
        });

        it('should not add resourceUri to resourceUrisWithAnnotation if it is already present', () => {
            const state = {
                filters: {
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                },
            };
            const action = {
                type: 'SEARCH_NEW_RESOURCE_ANNOTATED',
                payload: { resourceUri: 'uri2' },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                filters: {
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                },
            });
        });
    });
    describe('SEARCH_VISITED', () => {
        it('should set visited to visited', () => {
            const state = {
                filters: { visited: null },
            };
            const action = {
                type: 'SEARCH_VISITED',
                payload: { value: 'visited' },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                page: 0,
                filters: { visited: 'visited' },
            });
        });

        it('should set visited to not-visited', () => {
            const state = {
                filters: { visited: null },
            };
            const action = {
                type: 'SEARCH_VISITED',
                payload: { value: 'not-visited' },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                page: 0,
                filters: { visited: 'not-visited' },
            });
        });

        it('should set visited to null', () => {
            const state = {
                filters: { visited: 'visited' },
            };
            const action = {
                type: 'SEARCH_VISITED',
                payload: { value: null },
            };
            // @ts-expect-error TS2345
            const newState = reducer(state, action);
            expect(newState).toEqual({
                page: 0,
                filters: { visited: null },
            });
        });
    });
});
