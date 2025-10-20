import React from 'react';
import '@testing-library/jest-dom';

import { LoginFormComponent } from './LoginForm';
import { act, render } from '../../../test-utils';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from '../api/login';

jest.mock('../api/login', () => ({
    useLogin: jest
        .fn()
        .mockReturnValue({ login: jest.fn(), error: null, isLoading: false }),
}));

// Wrapper component to provide Redux context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
);

describe('<LoginForm />', () => {
    it('should render form', () => {
        const screen = render(
            <TestWrapper>
                <LoginFormComponent />
            </TestWrapper>,
        );
        expect(screen.getByLabelText('Username *')).toBeInTheDocument();
        expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    });
    it('should enable submit button when form is valid', async () => {
        const login = jest.fn();
        (useLogin as jest.Mock).mockReturnValue({
            login,
            error: null,
            isLoading: false,
        });
        const screen = render(
            <TestWrapper>
                <LoginFormComponent />
            </TestWrapper>,
        );

        expect(screen.getByText('Sign in')).toBeDisabled();
        expect(screen.getByLabelText('Username *')).toHaveValue('');
        expect(screen.getByLabelText('Password *')).toHaveValue('');
        await act(async () => {
            screen.fireEvent.change(screen.getByLabelText('Username *'), {
                target: { value: 'testuser' },
            });
            screen.fireEvent.change(screen.getByLabelText('Password *'), {
                target: { value: 'testpassword' },
            });
        });
        expect(screen.getByLabelText('Username *')).toHaveValue('testuser');
        expect(screen.getByLabelText('Password *')).toHaveValue('testpassword');
        expect(screen.queryAllByText('This field is required')).toHaveLength(0);
        expect(screen.getByText('Sign in')).not.toBeDisabled();

        await act(async () => {
            screen.fireEvent.click(screen.getByText('Sign in'));
        });
        expect(login).toHaveBeenCalledTimes(1);
        expect(login).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'testpassword',
        });
    });

    it('should display error when trying to submit with empty fields', async () => {
        const screen = render(
            <TestWrapper>
                <LoginFormComponent />
            </TestWrapper>,
        );

        expect(screen.getByText('Sign in')).toBeDisabled();
        expect(screen.getByLabelText('Username *')).toHaveValue('');
        expect(screen.getByLabelText('Password *')).toHaveValue('');
        await act(async () => {
            screen.fireEvent.change(screen.getByLabelText('Username *'), {
                target: { value: 'testuser' },
            });
            screen.fireEvent.change(screen.getByLabelText('Password *'), {
                target: { value: 'testpassword' },
            });
        });
        expect(screen.getByLabelText('Username *')).toHaveValue('testuser');
        expect(screen.getByLabelText('Password *')).toHaveValue('testpassword');
        expect(screen.queryAllByText('This field is required')).toHaveLength(0);
        expect(screen.getByText('Sign in')).not.toBeDisabled();
        await act(async () => {
            screen.fireEvent.change(screen.getByLabelText('Password *'), {
                target: { value: '' },
            });
        });
        expect(screen.getByText('Sign in')).toBeDisabled();

        expect(screen.getAllByText('error_field_required')).toHaveLength(1);
        await act(async () => {
            screen.fireEvent.change(screen.getByLabelText('Username *'), {
                target: { value: '' },
            });
        });

        expect(screen.getAllByText('error_field_required')).toHaveLength(2);
    });
});
