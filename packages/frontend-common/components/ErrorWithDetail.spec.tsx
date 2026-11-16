import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestI18N } from '../i18n/I18NContext';
import { ErrorWithDetail } from './ErrorWithDetail';

const renderError = (
    props: Partial<React.ComponentProps<typeof ErrorWithDetail>> = {},
    onClick = jest.fn(),
) =>
    render(
        <TestI18N>
            {/* a toast closes on click */}
            <div onClick={onClick}>
                <ErrorWithDetail
                    message="The source is unavailable"
                    detail="Maintenance"
                    {...props}
                />
            </div>
        </TestI18N>,
    );

const button = (name: string) => screen.getByRole('button', { name });

describe('<ErrorWithDetail />', () => {
    it('shows the detail only once asked for, with the arrow', async () => {
        renderError();
        expect(screen.getByText('The source is unavailable')).toBeVisible();
        expect(screen.getByText('Maintenance')).not.toBeVisible();
        await userEvent.click(button('error_detail'));
        expect(screen.getByText('Maintenance')).toBeVisible();
    });

    it('shows the detail only once asked for, with a link', async () => {
        renderError({ toggle: 'link' });
        expect(screen.getByText('Maintenance')).not.toBeVisible();
        await userEvent.click(button('show_error_detail'));
        expect(screen.getByText('Maintenance')).toBeVisible();
        await userEvent.click(button('hide_error_detail'));
        // once the collapse animation is over
        await waitFor(() =>
            expect(screen.getByText('Maintenance')).not.toBeVisible(),
        );
    });

    it.each([
        ['arrow', 'error_detail'],
        ['link', 'show_error_detail'],
    ] as const)(
        'does not pass the click on the %s to its container',
        async (toggle, name) => {
            const onClick = jest.fn();
            renderError({ toggle }, onClick);
            await userEvent.click(button(name));
            expect(onClick).not.toHaveBeenCalled();
        },
    );

    it('shows the message alone without detail', () => {
        renderError({ detail: undefined });
        expect(screen.queryByRole('button')).toBeNull();
    });
});
