import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';
import React from 'react';
import fetch from '../lib/fetch';
import { useCreateAnnotation } from './useCreateAnnotation';

const queryClient = new QueryClient();

function TestWrapper({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

TestWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

const annotation = {
    comment: 'test',
};

jest.mock('../lib/fetch', () =>
    jest.fn().mockImplementation(() => {
        return Promise.resolve({
            response: { total: 1, data: annotation },
            error: null,
        });
    }),
);

describe('useCreateAnnotation', () => {
    beforeEach(() => {
        window.localStorage.setItem(
            'redux-localstorage',
            JSON.stringify({ user: { token: 'token' } }),
        );
    });

    afterEach(() => {
        window.localStorage.clear();
        jest.clearAllMocks();
    });

    it('should call POST /api/annotation with annotation body', async () => {
        const { result } = renderHook(() => useCreateAnnotation(), {
            wrapper: TestWrapper,
        });

        await result.current.handleCreateAnnotation(annotation);

        expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/api/annotation',
                method: 'POST',
                body: '{"comment":"test"}',
            }),
        );
    });
});
