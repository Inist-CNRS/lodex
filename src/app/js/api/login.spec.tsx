import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useLogin } from './login';
import {
    Wrapper as DefaultWrapper,
    getStore,
} from '@lodex/frontend-common/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter, useHistory } from 'react-router';
import { getUserSessionStorageInfo } from '../../../../packages/admin-app/src/api/tools';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { loginSuccess } from '../user/reducer';

jest.mock('../../../../packages/admin-app/src/api/tools', () => ({
    getUserSessionStorageInfo: jest.fn(),
}));

jest.mock('../lib/fetch', () => jest.fn());

jest.mock('../user', () => ({
    ...jest.requireActual('../user'),
    loginSuccess: jest
        .fn()
        .mockImplementation((payload) => ({ type: 'LOGIN_SUCCESS', payload })),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: jest.fn(),
}));

const queryClient = new QueryClient();

const createWrapper = (initialPath = '/') => {
    const store = getStore({});

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <DefaultWrapper store={store}>
            <MemoryRouter initialEntries={[initialPath]}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </MemoryRouter>
        </DefaultWrapper>
    );
    return Wrapper;
};

describe('useLogin', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        // Reset mocks
        jest.clearAllMocks();
    });

    afterEach(() => {
        queryClient.clear();
    });

    it('should return login function, loading state, and error state', () => {
        const wrapper = createWrapper('/?page=/admin/dashboard');
        const { result } = renderHook(() => useLogin(), {
            wrapper,
        });

        expect(result.current.login).toBeInstanceOf(Function);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should call login API and dispatch success action on successful login', async () => {
        const mockResponse = { user: { id: 1, username: 'testuser' } };
        (getUserSessionStorageInfo as jest.Mock).mockReturnValue({
            token: 'mock-token',
        });
        (fetch as jest.Mock).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                error: null,
                                response: mockResponse,
                            }),
                        100,
                    ),
                ),
        );

        const { result, waitFor } = renderHook(() => useLogin(), {
            wrapper: createWrapper('/?page=/admin/dashboard'),
        });

        result.current.login({
            username: 'testuser',
            password: 'password123',
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(getUserSessionStorageInfo).toHaveBeenCalledTimes(1);
        expect(getUserSessionStorageInfo).toHaveBeenCalledWith();
        expect(fetch).toHaveBeenCalledWith({
            url: '/api/login',
            method: 'POST',
            body: JSON.stringify({
                password: 'password123',
                username: 'testuser',
            }),
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer mock-token',
                'Content-Type': 'application/json',
                Cookie: undefined,
            },
        });

        expect(loginSuccess).toHaveBeenCalledWith(mockResponse);
    });

    it('should redirect to root path on successful login when no page param', async () => {
        (useHistory as jest.Mock).mockReturnValue({ push: jest.fn() });

        (getUserSessionStorageInfo as jest.Mock).mockReturnValue({
            token: 'mock-token',
        });
        const mockResponse = { token: 'new-mock-token', role: 'admin' };
        (fetch as jest.Mock).mockResolvedValue({
            error: null,
            response: mockResponse,
        });

        const { result, waitFor } = renderHook(() => useLogin(), {
            wrapper: createWrapper('/login'),
        });

        result.current.login({
            username: 'testuser',
            password: 'password123',
        });

        await waitFor(() => {
            expect(loginSuccess).toHaveBeenCalledWith(mockResponse);
        });

        expect(useHistory().push).toHaveBeenCalledWith('/');
    });

    it('should redirect to page when page is set', async () => {
        (useHistory as jest.Mock).mockReturnValue({ push: jest.fn() });

        (getUserSessionStorageInfo as jest.Mock).mockReturnValue({
            token: 'mock-token',
        });
        const mockResponse = { token: 'new-mock-token', role: 'admin' };
        (fetch as jest.Mock).mockResolvedValue({
            error: null,
            response: mockResponse,
        });

        const { result, waitFor } = renderHook(() => useLogin(), {
            wrapper: createWrapper('/admin/login?page=/some/page'),
        });

        result.current.login({
            username: 'testuser',
            password: 'password123',
        });

        await waitFor(() => {
            expect(loginSuccess).toHaveBeenCalledWith(mockResponse);
        });

        expect(useHistory().push).toHaveBeenCalledWith('/some/page');
    });

    it('should return error state on failed login', async () => {
        (getUserSessionStorageInfo as jest.Mock).mockReturnValue({
            token: 'mock-token',
        });
        (fetch as jest.Mock).mockResolvedValue({
            error: new Error('Invalid credentials'),
            response: null,
        });

        const { result, waitFor } = renderHook(() => useLogin(), {
            wrapper: createWrapper('/login'),
        });

        result.current.login({
            username: 'testuser',
            password: 'wrongpassword',
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        await waitFor(() => {
            expect(result.current.error).toEqual(
                new Error('Invalid credentials'),
            );
        });
        expect(loginSuccess).not.toHaveBeenCalled();
    });
});
