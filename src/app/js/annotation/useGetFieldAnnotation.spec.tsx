import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';
import React from 'react';
import { toast } from '../../../common/tools/toast';
import { TestI18N } from '../i18n/I18NContext';
import fetch from '../lib/fetch';
import { AnnotationStorageProvider, getStorageKey } from './annotationStorage';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

jest.mock('../../../common/tools/toast');

const queryClient = new QueryClient({
    defaultOptions: {
        // @ts-expect-error TS2353
        retry: false,
    },
});

// @ts-expect-error TS7031
function TestWrapper({ children }) {
    return (
        <TestI18N>
            <AnnotationStorageProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </AnnotationStorageProvider>
        </TestI18N>
    );
}
TestWrapper.propTypes = {
    children: PropTypes.node,
};

const annotations = [
    {
        _id: 'annotation1',
    },
    {
        _id: 'annotation2',
    },
    {
        _id: 'annotation3',
    },
    {
        _id: 'annotation4',
    },
    {
        _id: 'annotation5',
    },
];

jest.mock('../lib/fetch', () =>
    jest.fn().mockImplementation(() => {
        return Promise.resolve({
            response: annotations,
            error: null,
        });
    }),
);

describe('useGetFieldAnnotation', () => {
    beforeEach(() => {
        // @ts-expect-error TS2339
        toast.mockClear();
        localStorage.clear();
        localStorage.setItem('redux-localstorage', '{"user":{}}');
        const storageKey = getStorageKey();

        localStorage.setItem(
            storageKey,
            JSON.stringify({
                resourceUri: {
                    fieldId: [
                        'annotation2',
                        'annotation4',
                        'deletedAnnotation',
                    ],
                    fieldId2: ['annotation1', 'annotation3'],
                },
            }),
        );
    });
    afterAll(() => {
        localStorage.clear();
    });

    it('should call GET /api/annotation/field-annotations with fieldId and resourceUri and add isMine false to all returned annotation when none present in localstorage', async () => {
        const { result } = renderHook(
            () => useGetFieldAnnotation('fieldId3', 'resourceUri'),
            {
                wrapper: TestWrapper,
            },
        );
        await waitFor(() => result.current.isSuccess);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/api/annotation/field-annotations?fieldId=fieldId3&resourceUri=resourceUri',
                method: 'GET',
            }),
        );
        await waitFor(() => {
            expect(
                result.current.isLoading === false && result.current.data,
            ).toBeTruthy();
        });
        expect(result.current.data).toStrictEqual(
            annotations.map((annotation) => ({ ...annotation, isMine: false })),
        );
        expect(toast).toHaveBeenCalledTimes(0);
    });

    it('should set isMine to true for annotation present in localStorage', async () => {
        const { result, rerender } = renderHook(
            () => useGetFieldAnnotation('fieldId2', 'resourceUri'),
            {
                wrapper: TestWrapper,
            },
        );

        await waitFor(() => result.current.isLoading === false);

        rerender();

        expect(result.current.data).toStrictEqual([
            {
                _id: 'annotation1',
                isMine: true,
            },

            {
                _id: 'annotation2',
                isMine: false,
            },

            {
                _id: 'annotation3',
                isMine: true,
            },

            {
                _id: 'annotation4',
                isMine: false,
            },

            {
                _id: 'annotation5',
                isMine: false,
            },
        ]);
        expect(toast).toHaveBeenCalledTimes(0);
    });

    it('should remove ids from localStorage if they are absent in the response', async () => {
        const { result, rerender } = renderHook(
            () => useGetFieldAnnotation('fieldId', 'resourceUri'),
            {
                wrapper: TestWrapper,
            },
        );

        await waitFor(() => result.current.isLoading === false);

        rerender();

        expect(localStorage.getItem(getStorageKey())).toBe(
            JSON.stringify({
                resourceUri: {
                    fieldId: ['annotation2', 'annotation4'],
                    fieldId2: ['annotation1', 'annotation3'],
                },
            }),
        );
        expect(toast).toHaveBeenCalledWith('annotation_deleted_by_admin', {
            type: toast.TYPE.INFO,
        });
    });
});
