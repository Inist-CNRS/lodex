import { waitFor } from '@testing-library/dom';
import { render } from '../../../../src/test-utils';
import { TestI18N } from '../../../../src/app/js/i18n/I18NContext';
import { DeleteManyButton } from './DeleteManyButton';
import { useDeleteManyAnnotation } from './hooks/useDeleteManyAnnotation';

jest.mock('./hooks/useDeleteManyAnnotation');

function TestButton({ selectedRowIds }: { selectedRowIds: string[] }) {
    return (
        <TestI18N>
            <DeleteManyButton selectedRowIds={selectedRowIds} />
        </TestI18N>
    );
}

describe('DeleteManyButton', () => {
    it('should not render button if no annotation is selected', async () => {
        // @ts-expect-error TS2345
        jest.mocked(useDeleteManyAnnotation).mockImplementation(() => ({
            mutate: jest.fn(),
            isLoading: false,
        }));

        const screen = render(<TestButton selectedRowIds={[]} />);

        expect(screen.container).toBeEmptyDOMElement();
    });

    it('should delete selected annotations', async () => {
        const mutate = jest.fn();

        // @ts-expect-error TS2345
        jest.mocked(useDeleteManyAnnotation).mockImplementation(() => ({
            mutate,
            isLoading: false,
        }));

        const screen = render(<TestButton selectedRowIds={['1', '2']} />);

        screen
            .getByRole('button', {
                name: 'annotation_delete_many_button_label',
            })
            .click();

        await waitFor(() =>
            expect(
                screen.getByText(
                    'annotation_delete_many_modal_title+{"smart_count":2}',
                ),
            ).toBeInTheDocument(),
        );

        screen
            .getByRole('button', {
                name: 'delete',
            })
            .click();

        expect(mutate).toHaveBeenCalledWith(['1', '2']);
    });

    it('should support canceling deletion', async () => {
        const mutate = jest.fn();

        // @ts-expect-error TS2345
        jest.mocked(useDeleteManyAnnotation).mockImplementation(() => ({
            mutate,
            isLoading: false,
        }));

        const screen = render(<TestButton selectedRowIds={['1', '2']} />);

        screen
            .getByRole('button', {
                name: 'annotation_delete_many_button_label',
            })
            .click();

        await waitFor(() =>
            expect(
                screen.getByText(
                    'annotation_delete_many_modal_title+{"smart_count":2}',
                ),
            ).toBeInTheDocument(),
        );

        screen
            .getByRole('button', {
                name: 'cancel',
            })
            .click();

        expect(mutate).not.toHaveBeenCalled();
    });

    it('should support disable modal actions when loading', async () => {
        const mutate = jest.fn();

        // @ts-expect-error TS2345
        jest.mocked(useDeleteManyAnnotation).mockImplementation(() => ({
            mutate,
            isLoading: true,
        }));

        const screen = render(<TestButton selectedRowIds={['1', '2']} />);

        screen
            .getByRole('button', {
                name: 'annotation_delete_many_button_label',
            })
            .click();

        await waitFor(() => {
            expect(
                screen.getByRole('button', {
                    name: 'delete',
                }),
            ).toBeInTheDocument();
        });

        expect(
            screen.getByRole('button', {
                name: 'delete',
            }),
        ).toBeDisabled();

        expect(
            screen.getByRole('button', {
                name: 'cancel',
            }),
        ).toBeDisabled();

        expect(mutate).not.toHaveBeenCalled();
    });
});
