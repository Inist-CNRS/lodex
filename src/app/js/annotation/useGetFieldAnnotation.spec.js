import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import fetch from '../lib/fetch';
import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';
import { waitFor } from '@testing-library/react';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            retry: false,
        },
    });

    return function TestWrapper({ children }) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };
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
        localStorage.clear();
        localStorage.setItem('redux-localstorage', '{"user":{}}');
    });
    afterAll(() => {
        localStorage.clear();
    });
    it('should call GET /api/annotation/field-annotations with fieldId and resourceUri and add isMine false to all returned annotation when none present in localstorage', async () => {
        const { result } = renderHook(
            () => useGetFieldAnnotation('fieldId', 'resourceUri'),
            {
                wrapper: createWrapper(),
            },
        );
        await waitFor(() => result.current.isSuccess);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/api/annotation/field-annotations?fieldId=fieldId&resourceUri=resourceUri',
                method: 'GET',
            }),
        );
        await waitFor(() => result.current.isLoading === false);
        expect(result.current.data).toStrictEqual(
            annotations.map((annotation) => ({ ...annotation, isMine: false })),
        );
    });
    it('should set isMine to true for annotation present in localStorage', async () => {
        localStorage.setItem(
            'annotation_fieldId_resourceUri',
            '["annotation2","annotation4"]',
        );
        const { result } = renderHook(
            () => useGetFieldAnnotation('fieldId', 'resourceUri'),
            {
                wrapper: createWrapper(),
            },
        );

        // @weird, we need to check all those to make sure the results are here
        // otherwise the test become flaky
        await waitFor(() => result.current.isSuccess);
        await waitFor(() => result.current.isLoading === false);
        await waitFor(() => !!result.current.data);

        expect(result.current.data).toStrictEqual([
            {
                _id: 'annotation1',
                isMine: false,
            },

            {
                _id: 'annotation2',
                isMine: true,
            },

            {
                _id: 'annotation3',
                isMine: false,
            },

            {
                _id: 'annotation4',
                isMine: true,
            },

            {
                _id: 'annotation5',
                isMine: false,
            },
        ]);
    });
});
