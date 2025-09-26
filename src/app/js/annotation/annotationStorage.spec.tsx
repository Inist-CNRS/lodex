import { renderHook } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';
import React from 'react';

import { waitFor } from '@testing-library/react';
import {
    AnnotationStorageProvider,
    useGetAnnotatedResourceUris,
    getStorageKey,
    useGetFieldAnnotationIds,
    useSaveAnnotationId,
    useSetFieldAnnotationIds,
} from './annotationStorage';
import { Provider } from 'react-redux';
import configureStore from '../configureStore';
import reducers from '../public/reducers';
import { createMemoryHistory } from 'history';
import { newResourceAnnotated } from '../public/search/reducer';

global.__DEBUG__ = false;
const memoryHistory = createMemoryHistory();
const { store } = configureStore(
    reducers,
    function* sagas() {},
    {},
    memoryHistory,
);

function TestWrapper({ children, dispatch }) {
    return (
        <Provider store={{ ...store, dispatch }}>
            <AnnotationStorageProvider>{children}</AnnotationStorageProvider>
        </Provider>
    );
}
TestWrapper.propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func,
};

describe('annotationStorage', () => {
    beforeEach(() => {
        localStorage.clear();

        localStorage.setItem(
            getStorageKey(),
            JSON.stringify({
                resourceUri: {
                    fieldId: ['annotation1', 'annotation2'],
                },
            }),
        );
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('useGetFieldAnnotationIds', () => {
        it('should return the annotations ids that are in the local storage', () => {
            const { result } = renderHook(
                () =>
                    useGetFieldAnnotationIds({
                        fieldId: 'fieldId',
                        resourceUri: 'resourceUri',
                    }),
                {
                    wrapper: TestWrapper,
                },
            );

            expect(result.current).toStrictEqual([
                'annotation1',
                'annotation2',
            ]);
        });

        it('should return an empty array if no annotation was found for the field', () => {
            const { result } = renderHook(
                () =>
                    useGetFieldAnnotationIds({
                        fieldId: 'fieldId',
                        resourceUri: 'resourceUri2',
                    }),
                {
                    wrapper: TestWrapper,
                    initialProps: {
                        dispatch: jest.fn(),
                    },
                },
            );

            expect(result.current).toStrictEqual([]);
        });
    });

    describe('useSaveAnnotationId', () => {
        it('should append to existing field annotations', async () => {
            const dispatch = jest.fn();
            const { result, rerender } = renderHook(
                () => useSaveAnnotationId(),
                {
                    wrapper: TestWrapper,
                    initialProps: {
                        dispatch,
                    },
                },
            );

            await waitFor(() => {
                result.current({
                    fieldId: 'fieldId',
                    resourceUri: 'resourceUri',
                    _id: 'annotation3',
                });
            });

            rerender();

            expect(
                JSON.parse(localStorage.getItem(getStorageKey())),
            ).toStrictEqual({
                resourceUri: {
                    fieldId: ['annotation1', 'annotation2', 'annotation3'],
                },
            });

            expect(dispatch).toHaveBeenCalledTimes(0);
        });

        it('should create a new  resource entry and dispatch newResourceAnnotated event', async () => {
            const dispatch = jest.fn();
            const { result, rerender } = renderHook(
                () => useSaveAnnotationId(),
                {
                    wrapper: TestWrapper,
                    initialProps: {
                        dispatch,
                    },
                },
            );

            await waitFor(() => {
                result.current({
                    fieldId: 'fieldId2',
                    resourceUri: 'resourceUri2',
                    _id: 'annotation3',
                });
            });

            rerender();

            expect(
                JSON.parse(localStorage.getItem(getStorageKey())),
            ).toStrictEqual({
                resourceUri: {
                    fieldId: ['annotation1', 'annotation2'],
                },
                resourceUri2: {
                    fieldId2: ['annotation3'],
                },
            });

            expect(dispatch).toHaveBeenCalledWith(
                newResourceAnnotated({ resourceUri: 'resourceUri2' }),
            );
        });
    });

    describe('useSetFieldAnnotationIds', () => {
        it('should overwrite annotations for a field', async () => {
            const { result, rerender } = renderHook(
                () =>
                    useSetFieldAnnotationIds({
                        fieldId: 'fieldId',
                        resourceUri: 'resourceUri',
                    }),
                {
                    wrapper: TestWrapper,
                },
            );

            await waitFor(() => {
                result.current(['annotation3', 'annotation4']);
            });

            rerender();

            expect(
                JSON.parse(localStorage.getItem(getStorageKey())),
            ).toStrictEqual({
                resourceUri: {
                    fieldId: ['annotation3', 'annotation4'],
                },
            });
        });
    });

    describe('useGetAnnotatedResourceUris', () => {
        it('should return the resourceUris that have annotations', () => {
            localStorage.setItem(
                getStorageKey(),
                JSON.stringify({
                    resourceUri: {
                        fieldId: ['annotation1', 'annotation2'],
                    },
                    resourceUri2: {
                        fieldId: ['annotation3', 'annotation4'],
                    },
                    resourceUri3: {
                        fieldId: ['annotation5', 'annotation6'],
                    },
                }),
            );

            const { result } = renderHook(() => useGetAnnotatedResourceUris(), {
                wrapper: TestWrapper,
            });

            expect(result.current).toStrictEqual([
                'resourceUri',
                'resourceUri2',
                'resourceUri3',
            ]);
        });

        it('should return an empty array if no resourceUri has annotations', () => {
            localStorage.clear();
            const { result } = renderHook(() => useGetAnnotatedResourceUris(), {
                wrapper: TestWrapper,
            });

            expect(result.current).toStrictEqual([]);
        });
    });
});
