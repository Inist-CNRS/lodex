import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import { render, userEvent } from '../test-utils';
import { ButtonWithConfirm } from './ButtonWithConfirm';

describe('<ButtonWithConfirm />', () => {
    const defaultProps = {
        buttonLabel: 'Test Action',
        dialogTitle: 'Confirm Action',
        dialogContent: 'Are you sure you want to proceed?',
        onConfirm: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the button with the correct label', () => {
        render(<ButtonWithConfirm {...defaultProps} />);

        expect(screen.getByText('Test Action')).toBeInTheDocument();
    });

    it('should render the button with default variant (contained)', () => {
        render(<ButtonWithConfirm {...defaultProps} />);

        const button = screen.getByRole('button', { name: 'Test Action' });
        expect(button).toHaveClass('MuiButton-contained');
    });

    it('should render the button with custom variant', () => {
        render(
            <ButtonWithConfirm {...defaultProps} buttonVariant="outlined" />,
        );

        const button = screen.getByRole('button', { name: 'Test Action' });
        expect(button).toHaveClass('MuiButton-outlined');
    });

    it('should not show dialog initially', () => {
        render(<ButtonWithConfirm {...defaultProps} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should open dialog when button is clicked', async () => {
        const user = userEvent.setup();
        render(<ButtonWithConfirm {...defaultProps} />);

        const button = screen.getByRole('button', { name: 'Test Action' });
        await user.click(button);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(
                screen.getByText('Are you sure you want to proceed?'),
            ).toBeInTheDocument();
        });
    });

    it('should show cancel and confirm buttons in dialog', async () => {
        const user = userEvent.setup();
        render(<ButtonWithConfirm {...defaultProps} />);

        const button = screen.getByRole('button', { name: 'Test Action' });
        await user.click(button);

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'cancel' }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'confirm' }),
            ).toBeInTheDocument();
        });
    });

    it('should close dialog when cancel button is clicked', async () => {
        const user = userEvent.setup();
        render(<ButtonWithConfirm {...defaultProps} />);

        const openButton = screen.getByRole('button', { name: 'Test Action' });
        await user.click(openButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole('button', { name: 'cancel' });
        await user.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('should call onConfirm and close dialog when confirm button is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();
        render(<ButtonWithConfirm {...defaultProps} onConfirm={onConfirm} />);

        const openButton = screen.getByRole('button', { name: 'Test Action' });
        await user.click(openButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const confirmButton = screen.getByRole('button', { name: 'confirm' });
        await user.click(confirmButton);

        expect(onConfirm).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('should not call onConfirm when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();
        render(<ButtonWithConfirm {...defaultProps} onConfirm={onConfirm} />);

        const openButton = screen.getByRole('button', { name: 'Test Action' });
        await user.click(openButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole('button', { name: 'cancel' });
        await user.click(cancelButton);

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('should handle multiple open/close cycles', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();
        render(<ButtonWithConfirm {...defaultProps} onConfirm={onConfirm} />);

        const openButton = screen.getByRole('button', { name: 'Test Action' });

        // First cycle - cancel
        await user.click(openButton);
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        await user.click(screen.getByRole('button', { name: 'cancel' }));
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        // Second cycle - confirm
        await user.click(openButton);
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        await user.click(screen.getByRole('button', { name: 'confirm' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('should pass event to onConfirm callback', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();
        render(<ButtonWithConfirm {...defaultProps} onConfirm={onConfirm} />);

        const openButton = screen.getByRole('button', { name: 'Test Action' });
        await user.click(openButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const confirmButton = screen.getByRole('button', { name: 'confirm' });
        await user.click(confirmButton);

        expect(onConfirm).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'click',
            }),
        );
    });
});
