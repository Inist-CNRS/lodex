import '@testing-library/jest-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TestI18N } from '../i18n/I18NContext';
import { CreateAnnotationModal } from './CreateAnnotationModal';

function TestModal(props) {
    return (
        <TestI18N>
            <CreateAnnotationModal {...props} isOpen={true} />
        </TestI18N>
    );
}

TestModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

describe('CreateAnnotationModal', () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();

    beforeEach(() => {
        onClose.mockClear();
        onSubmit.mockClear();
    });

    describe('actions', () => {
        it('should enable actions when not submitting', () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            expect(
                screen.getByRole('button', { name: 'cancel' }),
            ).not.toBeDisabled();
            expect(
                screen.getByRole('button', { name: 'validate' }),
            ).not.toBeDisabled();
        });

        it('should disable actions when submitting', () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={true}
                />,
            );

            expect(
                screen.getByRole('button', { name: 'cancel' }),
            ).toBeDisabled();

            expect(
                screen.getByRole('button', { name: 'validate' }),
            ).toBeDisabled();
        });

        it('should call onClose when closing modal', async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            await waitFor(() => {
                fireEvent.click(screen.getByRole('button', { name: 'cancel' }));
            });

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('should submit form values', async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', { name: 'annotation_comment' }),
                    {
                        target: { value: 'test' },
                    },
                );
            });

            await waitFor(() => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            });

            expect(onSubmit).toHaveBeenCalledTimes(1);
            expect(onSubmit).toHaveBeenCalledWith({
                comment: 'test',
            });
        });
    });

    describe('comments', () => {
        it('should render comments field', () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            expect(
                screen.getByRole('heading', { name: 'annotation_add_comment' }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('textbox', { name: 'annotation_comment' }),
            ).toBeInTheDocument();
        });

        it('should not display an error when field is valid', async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', { name: 'annotation_comment' }),
                    {
                        target: { value: 'test' },
                    },
                );
            });

            expect(
                screen.getByRole('textbox', { name: 'annotation_comment' }),
            ).toBeValid();

            expect(
                screen.getByRole('textbox', { name: 'annotation_comment' }),
            ).toHaveValue('test');

            expect(screen.queryAllByRole('error_required')).toHaveLength(0);
        });

        it('should display an error when field is not valid', async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', { name: 'annotation_comment' }),
                    {
                        target: { value: 'test' },
                    },
                );
            });

            expect(
                screen.getByRole('textbox', { name: 'annotation_comment' }),
            ).toBeValid();

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', { name: 'annotation_comment' }),
                    {
                        target: { value: '' },
                    },
                );
            });

            expect(
                screen.getByRole('textbox', { name: 'annotation_comment' }),
            ).not.toBeValid();

            expect(screen.getByText('error_required')).toHaveRole('alert');
        });
    });
});
