import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, userEvent, waitFor } from '../../../../test-utils';
import { HideResource } from './HideResource';
import { ADMIN_ROLE } from '../../../../common/tools/tenantTools';
import { hideResource } from '../api/hideResource';

jest.mock('../api/hideResource', () => ({
    hideResource: jest.fn(),
}));

describe('HideResourceForm', () => {
    beforeEach(() => {
        (hideResource as jest.Mock).mockReset();
    });
    it('should render a button opening dialog and calling hideResource on submit', async () => {
        (hideResource as jest.Mock).mockResolvedValue({
            reason: 'reason',
            removedAt: new Date().toISOString(),
        });
        const user = userEvent.setup();
        const screen = render(
            <QueryClientProvider client={new QueryClient()}>
                <HideResource />
            </QueryClientProvider>,
            {
                initialState: {
                    user: { role: ADMIN_ROLE },
                    resource: {
                        resource: { uri: '/uri', versions: [{}] },
                    },
                },
            },
        );
        expect(screen.getByText('hide')).toBeInTheDocument();
        await user.click(screen.getByText('hide'));
        expect(screen.getByText('enter_reason *')).toBeInTheDocument();

        await user.type(screen.getByLabelText('enter_reason *'), 'reason');
        await user.click(screen.getByText('save'));

        await waitFor(() =>
            expect(
                screen.queryByText('enter_reason *'),
            ).not.toBeInTheDocument(),
        );
        expect(hideResource).toHaveBeenCalledWith({
            uri: '/uri',
            reason: 'reason',
        });
    });

    it('should close the dialog on cancel without calling hideResource', async () => {
        const user = userEvent.setup();
        const screen = render(
            <QueryClientProvider client={new QueryClient()}>
                <HideResource />
            </QueryClientProvider>,
            {
                initialState: {
                    user: { role: ADMIN_ROLE },
                    resource: {
                        resource: { uri: '/uri', versions: [{}] },
                    },
                },
            },
        );
        expect(screen.getByText('hide')).toBeInTheDocument();
        await user.click(screen.getByText('hide'));
        await waitFor(() =>
            expect(screen.getByText('enter_reason *')).toBeInTheDocument(),
        );

        await user.click(screen.getByText('cancel'));

        waitFor(() =>
            expect(
                screen.queryByText('enter_reason *'),
            ).not.toBeInTheDocument(),
        );
        expect(hideResource).not.toHaveBeenCalled();
    });

    it('should disable the submit button when reason is not set', async () => {
        const user = userEvent.setup();
        const screen = render(
            <QueryClientProvider client={new QueryClient()}>
                <HideResource />
            </QueryClientProvider>,
            {
                initialState: {
                    user: { role: ADMIN_ROLE },
                    resource: {
                        resource: { uri: '/uri', versions: [{}] },
                    },
                },
            },
        );
        expect(screen.getByText('hide')).toBeInTheDocument();
        await user.click(screen.getByText('hide'));
        await waitFor(() =>
            expect(screen.getByText('enter_reason *')).toBeInTheDocument(),
        );

        expect(screen.getByText('save')).toBeDisabled();

        await user.type(screen.getByLabelText('enter_reason *'), 'reason');

        expect(screen.getByText('save')).toBeEnabled();

        await user.clear(screen.getByLabelText('enter_reason *'));

        expect(screen.getByText('save')).toBeDisabled();
    });

    it('should display an error message when hideResource fails', async () => {
        (hideResource as jest.Mock).mockRejectedValue(
            new Error('hide resource error'),
        );
        const user = userEvent.setup();
        const screen = render(
            <QueryClientProvider client={new QueryClient()}>
                <HideResource />
            </QueryClientProvider>,
            {
                initialState: {
                    user: { role: ADMIN_ROLE },
                    resource: {
                        resource: { uri: '/uri', versions: [{}] },
                    },
                },
            },
        );
        expect(screen.getByText('hide')).toBeInTheDocument();
        await user.click(screen.getByText('hide'));
        expect(screen.getByText('enter_reason *')).toBeInTheDocument();

        await user.type(screen.getByLabelText('enter_reason *'), 'reason');
        await user.click(screen.getByText('save'));
        expect(hideResource).toHaveBeenCalledWith({
            uri: '/uri',
            reason: 'reason',
        });

        await waitFor(() =>
            expect(screen.getByText('hide resource error')).toBeInTheDocument(),
        );
    });
});
