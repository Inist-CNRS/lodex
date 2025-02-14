import React from 'react';
import { render } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { DeleteManyButton } from './DeleteManyButton';
import { useDeleteManyAnnotation } from './hooks/useDeleteManyAnnotation';

jest.mock('./hooks/useDeleteManyAnnotation');

function TestButton({ selectedRows }) {
    return (
        <TestI18N>
            <DeleteManyButton selectedRows={selectedRows} />
        </TestI18N>
    );
}

TestButton.propTypes = DeleteManyButton.propTypes;

describe('DeleteManyButton', () => {
    it('should not render button if no annotation is selected', async () => {
        jest.mocked(useDeleteManyAnnotation).mockImplementation(() => ({
            mutate: jest.fn(),
            isLoading: false,
        }));

        const wrapper = render(<TestButton selectedRows={[]} />);

        expect(wrapper.container).toBeEmptyDOMElement();
    });

    it('should delete selected annotations', async () => {
        const mutate = jest.fn();

        jest.mocked(useDeleteManyAnnotation).mockImplementation(() => ({
            mutate,
            isLoading: false,
        }));

        const wrapper = render(<TestButton selectedRows={['1', '2']} />);

        wrapper
            .getByRole('button', {
                name: 'annotation_delete_many_button_label',
            })
            .click();

        wrapper
            .getByRole('button', {
                name: 'delete',
            })
            .click();

        expect(mutate).toHaveBeenCalledWith(['1', '2']);
    });

    it('should support canceling deletion', async () => {
        const mutate = jest.fn();

        jest.mocked(useDeleteManyAnnotation).mockImplementation(() => ({
            mutate,
            isLoading: false,
        }));

        const wrapper = render(<TestButton selectedRows={['1', '2']} />);

        wrapper
            .getByRole('button', {
                name: 'annotation_delete_many_button_label',
            })
            .click();

        wrapper
            .getByRole('button', {
                name: 'cancel',
            })
            .click();

        expect(mutate).not.toHaveBeenCalled();
    });

    it('should support disable modal actions when loading', async () => {
        const mutate = jest.fn();

        jest.mocked(useDeleteManyAnnotation).mockImplementation(() => ({
            mutate,
            isLoading: true,
        }));

        const wrapper = render(<TestButton selectedRows={['1', '2']} />);

        wrapper
            .getByRole('button', {
                name: 'annotation_delete_many_button_label',
            })
            .click();

        expect(
            wrapper.getByRole('button', {
                name: 'delete',
            }),
        ).toBeDisabled();

        expect(
            wrapper.getByRole('button', {
                name: 'cancel',
            }),
        ).toBeDisabled();

        expect(mutate).not.toHaveBeenCalled();
    });
});
