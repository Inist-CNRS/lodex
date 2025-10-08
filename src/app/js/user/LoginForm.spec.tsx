import React from 'react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { LoginFormComponent } from './LoginForm';
import { act, fireEvent, render } from '../../../test-utils';

// Mock store for redux-form
const store = createStore(() => ({
    form: formReducer(undefined, { type: '@@INIT' }),
}));

// Wrapper component to provide Redux context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe('<LoginForm />', () => {
    const defaultProps = {
        p: { t: (key: string) => key },
        handleSubmit: jest.fn(),
        onSubmit: jest.fn(),
    };

    it('should render form', () => {
        const screen = render(
            <TestWrapper>
                <LoginFormComponent {...defaultProps} />
            </TestWrapper>,
        );
        expect(screen.getByLabelText('Username *')).toBeInTheDocument();
        expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    });
    it('should enable submit button when form is valid', async () => {
        const props = {
            ...defaultProps,
            onSubmit: jest.fn(),
        };

        const screen = render(
            <TestWrapper>
                <LoginFormComponent {...props} />
            </TestWrapper>,
        );

        expect(screen.getByText('Sign in')).toBeDisabled();
        expect(screen.getByLabelText('Username *')).toHaveValue('');
        expect(screen.getByLabelText('Password *')).toHaveValue('');
        await act(async () => {
            fireEvent.change(screen.getByLabelText('Username *'), {
                target: { value: 'testuser' },
            });
            fireEvent.change(screen.getByLabelText('Password *'), {
                target: { value: 'testpassword' },
            });
        });
        expect(screen.getByLabelText('Username *')).toHaveValue('testuser');
        expect(screen.getByLabelText('Password *')).toHaveValue('testpassword');
        expect(screen.queryAllByText('This field is required')).toHaveLength(0);
        expect(screen.getByText('Sign in')).not.toBeDisabled();

        await act(async () => {
            fireEvent.click(screen.getByText('Sign in'));
        });
        expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should display error when trying to submit with empty fields', async () => {
        const propsWithError = {
            ...defaultProps,
            onSubmit: jest.fn(),
        };

        const screen = render(
            <TestWrapper>
                <LoginFormComponent {...propsWithError} />
            </TestWrapper>,
        );

        expect(screen.getByText('Sign in')).toBeDisabled();
        expect(screen.getByLabelText('Username *')).toHaveValue('');
        expect(screen.getByLabelText('Password *')).toHaveValue('');
        await act(async () => {
            fireEvent.change(screen.getByLabelText('Username *'), {
                target: { value: 'testuser' },
            });
            fireEvent.change(screen.getByLabelText('Password *'), {
                target: { value: 'testpassword' },
            });
        });
        expect(screen.getByLabelText('Username *')).toHaveValue('testuser');
        expect(screen.getByLabelText('Password *')).toHaveValue('testpassword');
        expect(screen.queryAllByText('This field is required')).toHaveLength(0);
        expect(screen.getByText('Sign in')).not.toBeDisabled();
        await act(async () => {
            fireEvent.change(screen.getByLabelText('Password *'), {
                target: { value: '' },
            });
        });
        expect(screen.getByText('Sign in')).toBeDisabled();

        expect(screen.getAllByText('error_field_required')).toHaveLength(1);
        await act(async () => {
            fireEvent.change(screen.getByLabelText('Username *'), {
                target: { value: '' },
            });
        });

        expect(screen.getAllByText('error_field_required')).toHaveLength(2);
    });
});
