import { renderHook } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';
import React from 'react';

import { waitFor } from '@testing-library/react';
import {
    AnnotationStorageProvider,
    getFieldKey,
    getStorageKey,
    useGetFieldAnnotationIds,
    useSaveAnnotationId,
    useSetFieldAnnotationIds,
} from './annotationStorage';

function TestWrapper({ children }) {
    return <AnnotationStorageProvider>{children}</AnnotationStorageProvider>;
}
TestWrapper.propTypes = {
    children: PropTypes.node,
};

describe('annotationStorage', () => {
    beforeEach(() => {
        localStorage.clear();

        localStorage.setItem(
            getStorageKey(),
            JSON.stringify({
                [getFieldKey({
                    fieldId: 'fieldId',
                    resourceUri: 'resourceUri',
                })]: ['annotation1', 'annotation2'],
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
                },
            );

            expect(result.current).toStrictEqual([]);
        });
    });

    describe('useSaveAnnotationId', () => {
        it('should append to existing field annotations', async () => {
            const { result, rerender } = renderHook(
                () => useSaveAnnotationId(),
                {
                    wrapper: TestWrapper,
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
                [getFieldKey({
                    fieldId: 'fieldId',
                    resourceUri: 'resourceUri',
                })]: ['annotation1', 'annotation2', 'annotation3'],
            });
        });

        it('should create a new field entry', async () => {
            const { result, rerender } = renderHook(
                () => useSaveAnnotationId(),
                {
                    wrapper: TestWrapper,
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
                [getFieldKey({
                    fieldId: 'fieldId',
                    resourceUri: 'resourceUri',
                })]: ['annotation1', 'annotation2'],
                [getFieldKey({
                    fieldId: 'fieldId2',
                    resourceUri: 'resourceUri2',
                })]: ['annotation3'],
            });
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
                [getFieldKey({
                    fieldId: 'fieldId',
                    resourceUri: 'resourceUri',
                })]: ['annotation3', 'annotation4'],
            });
        });
    });
});
