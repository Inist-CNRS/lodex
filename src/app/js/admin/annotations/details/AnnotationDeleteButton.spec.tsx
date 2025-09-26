import React from 'react';
// @ts-expect-error TS7016
import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, waitFor } from '@testing-library/react';
import PropTypes from 'prop-types';
import { TestI18N } from '../../../i18n/I18NContext';
import { useDeleteAnnotation } from '../hooks/useDeleteAnnotation';
import { AnnotationDeleteButton } from './AnnotationDeleteButton';

const ANNOTATION_ID = '4f74cd4e-ecc5-4314-beb8-b98f2ce2cf61';

const queryClient = new QueryClient();

jest.mock('./../hooks/useDeleteAnnotation', () => ({
    useDeleteAnnotation: jest.fn().mockReturnValue({
        mutateAsync: jest.fn(),
        isLoading: false,
    }),
}));

function TestButton({ isSubmitting = false }) {
    return (
        <QueryClientProvider client={queryClient}>
            <TestI18N>
                <MemoryRouter>
                    <AnnotationDeleteButton
                        id={ANNOTATION_ID}
                        isSubmitting={isSubmitting}
                    />
                </MemoryRouter>
            </TestI18N>
        </QueryClientProvider>
    );
}

TestButton.propTypes = {
    isSubmitting: PropTypes.bool,
};

describe('AnnotationDeleteButton', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete annotation', async () => {
        const mutateAsync = jest.fn();
        // @ts-expect-error TS2345
        jest.mocked(useDeleteAnnotation).mockReturnValue({
            mutateAsync,
            isLoading: false,
        });

        const wrapper = render(<TestButton />);

        const deleteButton = wrapper.getByRole('button', {
            name: 'annotation_delete_button_label',
        });
        expect(deleteButton).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(deleteButton);
        });

        expect(
            wrapper.queryByText('annotation_delete_modal_title'),
        ).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(
                wrapper.getByRole('button', {
                    name: 'delete',
                }),
            );
        });

        expect(mutateAsync).toHaveBeenCalledTimes(1);
    });

    it('should disable button when submitting', async () => {
        const wrapper = render(<TestButton isSubmitting />);

        expect(
            wrapper.getByRole('button', {
                name: 'annotation_delete_button_label',
            }),
        ).toBeDisabled();
    });

    it('should disable button when in flight', async () => {
        // @ts-expect-error TS2345
        jest.mocked(useDeleteAnnotation).mockReturnValue({
            mutateAsync: jest.fn(),
            isLoading: true,
        });

        const wrapper = render(<TestButton />);

        expect(
            wrapper.getByRole('button', {
                name: 'annotation_delete_button_label',
            }),
        ).toBeDisabled();
    });

    it('should not delete annotation when cancelling', async () => {
        // @ts-expect-error TS2345
        jest.mocked(useDeleteAnnotation).mockReturnValue({
            mutateAsync: jest.fn(),
            isLoading: false,
        });

        const wrapper = render(<TestButton />);

        const deleteButton = wrapper.getByRole('button', {
            name: 'annotation_delete_button_label',
        });
        expect(deleteButton).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(deleteButton);
        });

        expect(
            wrapper.queryByText('annotation_delete_modal_title'),
        ).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(
                wrapper.getByRole('button', {
                    name: 'cancel',
                }),
            );
        });

        expect(
            wrapper.queryByText('annotation_delete_confirm_title'),
        ).not.toBeInTheDocument();
    });
});
