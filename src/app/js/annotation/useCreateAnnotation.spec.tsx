import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';

import fetch from '../lib/fetch';
import { useCreateAnnotation } from './useCreateAnnotation';
import { AnnotationStorageProvider } from './annotationStorage';
import { TestI18N } from '../i18n/I18NContext';
import configureStore from '../configureStore';
import reducers from '../public/reducers';
// @ts-expect-error TS7016
import { createMemoryHistory } from 'history';

// @ts-expect-error TS7017
global.__DEBUG__ = false;

const memoryHistory = createMemoryHistory();

const { store } = configureStore(
    reducers,
    function* sagas() {},
    {},
    memoryHistory,
);
const queryClient = new QueryClient();

// @ts-expect-error TS7031
function TestWrapper({ children }) {
    return (
        <Provider store={store}>
            <AnnotationStorageProvider>
                <TestI18N>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </TestI18N>
            </AnnotationStorageProvider>
        </Provider>
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
                url: '/api/annotation?locale=en',
                method: 'POST',
                body: '{"comment":"test"}',
            }),
        );
    });
});
