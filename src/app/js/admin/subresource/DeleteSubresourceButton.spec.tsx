import { DeleteSubresourceButton } from './DeleteSubresourceButton';
import { act, render, within } from '../../../../test-utils';

describe('<DeleteSubresourceButton />', () => {
    it('should display a dialog on button click and call onClick when the dialog is confirmed', async () => {
        const onClick = jest.fn();

        const screen = render(<DeleteSubresourceButton onClick={onClick} />);

        expect(screen.getByText('delete')).toBeInTheDocument();
        expect(
            screen.queryByText('confirm_delete_subresource'),
        ).not.toBeInTheDocument();
        act(() => screen.getByText('delete').click());
        expect(
            screen.getByText('confirm_delete_subresource'),
        ).toBeInTheDocument();
        expect(onClick).not.toHaveBeenCalled();

        act(() =>
            within(screen.getByRole('dialog')).getByText('delete').click(),
        );

        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it('should display a dialog on button click and do not call onClick when the dialog is cancelled', async () => {
        const onClick = jest.fn();

        const screen = render(<DeleteSubresourceButton onClick={onClick} />);

        expect(screen.getByText('delete')).toBeInTheDocument();
        expect(
            screen.queryByText('confirm_delete_subresource'),
        ).not.toBeInTheDocument();
        act(() => screen.getByText('delete').click());
        expect(
            screen.getByText('confirm_delete_subresource'),
        ).toBeInTheDocument();
        expect(onClick).not.toHaveBeenCalled();

        act(() =>
            within(screen.getByRole('dialog')).getByText('cancel').click(),
        );

        expect(onClick).not.toHaveBeenCalled();
    });
});
