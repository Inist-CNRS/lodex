import { TaskStatus } from '@lodex/common';
import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import { render, userEvent } from '../test-utils';
import { RunButton } from './RunButton';

describe('<RunButton />', () => {
    const setup = (props?: Partial<React.ComponentProps<typeof RunButton>>) => {
        const handleLaunchPrecomputed = jest.fn();
        render(
            <RunButton
                handleLaunchPrecomputed={handleLaunchPrecomputed}
                precomputedStatus={TaskStatus.FINISHED}
                variant="contained"
                {...props}
            />,
        );
        return { handleLaunchPrecomputed };
    };

    it('renders the Run button', () => {
        setup();
        expect(screen.getByRole('button', { name: 'run' })).toBeInTheDocument();
    });

    it.each([TaskStatus.CANCELED, TaskStatus.ERROR, undefined])(
        'calls handleLaunchPrecomputed  when status is %s and button is clicked',
        async (status) => {
            const user = userEvent.setup();
            const { handleLaunchPrecomputed } = setup({
                precomputedStatus: status,
            });

            await act(() => {
                return user.click(screen.getByRole('button', { name: 'run' }));
            });

            expect(handleLaunchPrecomputed).toHaveBeenCalledTimes(1);
        },
    );

    it('opens a confirmation modal when the button is clicked and status is FINISHED', async () => {
        const user = userEvent.setup();
        setup();

        await act(() => {
            return user.click(screen.getByRole('button', { name: /run/i }));
        });

        await waitFor(() => {
            expect(
                screen.getByRole('dialog', { name: 'precomputed_confirm_run' }),
            ).toBeVisible();
        });
    });

    it('closes the modal when cancel is clicked', async () => {
        const user = userEvent.setup();
        setup();

        await act(() => {
            return user.click(screen.getByRole('button', { name: /run/i }));
        });

        await waitFor(() => {
            expect(
                screen.getByRole('dialog', { name: 'precomputed_confirm_run' }),
            ).toBeVisible();
        });

        await act(() => {
            return user.click(screen.getByRole('button', { name: 'cancel' }));
        });

        await waitFor(() => {
            expect(
                screen.queryByRole('dialog', {
                    name: 'precomputed_confirm_run',
                }),
            ).not.toBeInTheDocument();
        });
    });

    it('calls handleLaunchPrecomputed when confirm is clicked', async () => {
        const user = userEvent.setup();
        const { handleLaunchPrecomputed } = setup();

        await act(() => {
            return user.click(screen.getByRole('button', { name: /run/i }));
        });

        await waitFor(() => {
            expect(
                screen.getByRole('dialog', { name: 'precomputed_confirm_run' }),
            ).toBeVisible();
        });

        await act(() => {
            return user.click(screen.getByRole('button', { name: 'confirm' }));
        });

        await waitFor(() => {
            expect(handleLaunchPrecomputed).toHaveBeenCalledTimes(1);
        });
    });

    it.each([TaskStatus.IN_PROGRESS, TaskStatus.PENDING, TaskStatus.ON_HOLD])(
        'disables the Run button when status is %s',
        (status) => {
            setup({ precomputedStatus: status });
            const runButton = screen.getByRole('button', { name: 'run' });
            expect(runButton).toBeDisabled();
        },
    );
});
