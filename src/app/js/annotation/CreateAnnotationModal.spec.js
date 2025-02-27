import PropTypes from 'prop-types';
import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTimeout } from 'node:timers/promises';
import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import { TestI18N } from '../i18n/I18NContext';
import { CreateAnnotationModal } from './CreateAnnotationModal';

jest.mock('./useGetFieldAnnotation', () => ({
    useGetFieldAnnotation: jest.fn().mockReturnValue({
        data: [],
        error: null,
        isLoading: false,
    }),
}));

const queryClient = new QueryClient();

function TestModal(props) {
    return (
        <TestI18N>
            <QueryClientProvider client={queryClient}>
                <CreateAnnotationModal
                    initialValue={null}
                    field={{ _id: '87a3b1c0-0b1b-4b1b-8b1b-1b1b1b1b1b1b' }}
                    isFieldValueAnnotable={false}
                    {...props}
                    anchorEl={document.createElement('div')}
                />
            </QueryClientProvider>
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
        localStorage.clear();
    });

    describe('actions', () => {
        it('should enable cancel action when not submitting', async () => {
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

            expect(screen.getByRole('button', { name: 'next' })).toBeDisabled();
        });

        it('should enable next button if comment is valid', async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            });

            expect(
                screen.getByRole('button', { name: 'cancel' }),
            ).not.toBeDisabled();

            expect(
                screen.getByRole('button', { name: 'next' }),
            ).not.toBeDisabled();
        });

        it('should disable actions when submitting', async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={true}
                />,
            );

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            });

            expect(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
            ).toHaveValue('test');

            expect(screen.getByRole('button', { name: 'next' })).toBeDisabled();
            expect(
                screen.getByRole('button', { name: 'cancel' }),
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
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            });

            await waitFor(() => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            });

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            });

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorEmail',
                    }),
                    {
                        target: { value: 'email@example.org' },
                    },
                );
            });

            // Wait for the submit button to be enabled
            await waitFor(() => setTimeout(500));

            await waitFor(() => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            });

            expect(onSubmit).toHaveBeenCalledTimes(1);
            expect(onSubmit).toHaveBeenCalledWith({
                comment: 'test',
                authorName: 'author',
                authorEmail: 'email@example.org',
                target: 'title',
                kind: 'comment',
                reCaptchaToken: null,
            });
        });
    });

    describe('step orders', () => {
        it('should start on COMMENT_STEP when isFieldValueAnnotable is false', () => {
            const wrapper = render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                    isFieldValueAnnotable={false}
                />,
            );

            expect(
                wrapper.getByRole('tab', {
                    name: 'annotation_step_comment',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_target',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_author',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_value',
                }),
            ).not.toBeInTheDocument();
        });
        it('should start on TARGET_STEP when isFieldValueAnnotable is true', () => {
            const wrapper = render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                    initialValue="initialValue"
                    isFieldValueAnnotable={true}
                />,
            );

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_target',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_comment',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_author',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_value',
                }),
            ).not.toBeInTheDocument();
        });
    });

    describe('value tab', () => {
        beforeEach(async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                    initialValue={['firstValue', 'secondValue']}
                    isFieldValueAnnotable={true}
                />,
            );

            await waitFor(() => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_comment_target_value',
                    }),
                );
            });

            await waitFor(() => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_remove_content',
                    }),
                );
            });

            expect(
                screen.queryByRole('tab', {
                    name: 'annotation_step_value',
                }),
            ).toBeInTheDocument();
        });

        it('should disable the next button when no value is selected', async () => {
            expect(screen.getByRole('button', { name: 'next' })).toBeDisabled();
        });

        it('should enable the next button when a value is selected', async () => {
            await waitFor(() => {
                fireEvent.mouseDown(
                    screen.getByLabelText('annotation_choose_value *'),
                );
            });

            await waitFor(() => {
                fireEvent.click(
                    screen.getByRole('option', { name: 'secondValue' }),
                );
            });
            expect(
                screen.getByRole('button', { name: 'next' }),
            ).not.toBeDisabled();
        });
    });

    describe('comment tab', () => {
        beforeEach(() => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            expect(
                screen.queryByRole('tab', {
                    name: 'annotation_step_comment',
                }),
            ).toBeInTheDocument();

            expect(
                screen.queryByRole('tab', {
                    name: 'annotation_step_author',
                    hidden: true,
                }),
            ).not.toBeInTheDocument();
        });

        describe('comments', () => {
            it('should render comments field (but no proposedValue field)', () => {
                expect(
                    screen.getByRole('heading', {
                        name: 'annotation_add_comment',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.queryByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                ).not.toBeInTheDocument();
            });

            it('should not display an error when field is valid', async () => {
                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.comment *',
                        }),
                        {
                            target: { value: 'test' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                ).toBeValid();

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                ).toHaveValue('test');

                expect(screen.queryAllByRole('error_required')).toHaveLength(0);
            });

            it('should display an error when field is not valid', async () => {
                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.comment *',
                        }),
                        {
                            target: { value: 'test' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                ).toBeValid();

                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.comment *',
                        }),
                        {
                            target: { value: '' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                ).not.toBeValid();

                expect(screen.getByText('error_required')).toHaveRole('alert');
            });
        });

        describe('correction comment', () => {
            beforeEach(() => {
                render(
                    <TestModal
                        onClose={onClose}
                        onSubmit={onSubmit}
                        isSubmitting={false}
                        initialValue="initialValue"
                        isFieldValueAnnotable={true}
                    />,
                );

                fireEvent.click(
                    screen.queryByText('annotation_comment_target_value'),
                );
                fireEvent.click(
                    screen.queryByText('annotation_correct_content'),
                );
                expect(
                    screen.queryByRole('tab', {
                        name: 'annotation_step_comment',
                    }),
                ).toBeInTheDocument();
            });

            it('should render required proposedValue and comment field', () => {
                expect(
                    screen.getByRole('heading', {
                        name: 'annotation_add_comment',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('button', { name: 'next' }),
                ).toBeDisabled();
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'comment' },
                    },
                );
                expect(
                    screen.getByRole('button', { name: 'next' }),
                ).toBeDisabled();
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
                expect(
                    screen.getByRole('button', { name: 'next' }),
                ).not.toBeDisabled();
            });
        });

        describe('addition comment', () => {
            beforeEach(() => {
                render(
                    <TestModal
                        onClose={onClose}
                        onSubmit={onSubmit}
                        isSubmitting={false}
                        initialValue="initialValue"
                        isFieldValueAnnotable={true}
                    />,
                );

                fireEvent.click(
                    screen.queryByText('annotation_comment_target_value'),
                );
                fireEvent.click(screen.queryByText('annotation_add_content'));
                expect(
                    screen.queryByRole('tab', {
                        name: 'annotation_step_comment',
                    }),
                ).toBeInTheDocument();
            });

            it('should render required proposedValue and comment field', () => {
                expect(
                    screen.getByRole('heading', {
                        name: 'annotation_add_comment',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('button', { name: 'next' }),
                ).toBeDisabled();
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'comment' },
                    },
                );
                expect(
                    screen.getByRole('button', { name: 'next' }),
                ).toBeDisabled();
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
                expect(
                    screen.getByRole('button', { name: 'next' }),
                ).not.toBeDisabled();
            });
        });
    });

    describe('author tab', () => {
        beforeEach(async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            await waitFor(() => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            });

            await waitFor(() => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            });

            // Wait for the submit button to be enabled
            await waitFor(() => setTimeout(500));

            expect(
                screen.queryByRole('tab', {
                    name: 'annotation_step_comment',
                    hidden: true,
                }),
            ).not.toBeInTheDocument();

            expect(
                screen.queryByRole('tab', {
                    name: 'annotation_step_author',
                }),
            ).toBeInTheDocument();
        });

        describe('authorName', () => {
            it('should render authorName field', () => {
                expect(
                    screen.getByRole('heading', {
                        name: 'annotation_add_comment',
                    }),
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                ).toBeInTheDocument();
            });

            it('should not display an error when field is valid', async () => {
                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.authorName *',
                        }),
                        {
                            target: { value: 'author' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                ).toBeValid();

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                ).toHaveValue('author');

                expect(screen.queryAllByRole('error_required')).toHaveLength(0);
            });

            it('should display an error when field is not valid', async () => {
                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.authorName *',
                        }),
                        {
                            target: { value: 'author' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                ).toBeValid();

                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.authorName *',
                        }),
                        {
                            target: { value: '' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                ).not.toBeValid();

                expect(screen.getByText('error_required')).toHaveRole('alert');
            });
        });

        describe('authorEmail', () => {
            it('should render authorEmail field', () => {
                expect(
                    screen.getByRole('heading', {
                        name: 'annotation_add_comment',
                    }),
                ).toBeInTheDocument();

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorEmail',
                    }),
                ).toBeInTheDocument();

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorEmail',
                    }),
                ).toBeInTheDocument();
            });

            it('should not display an error when field is empty', async () => {
                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.authorEmail',
                        }),
                        {
                            target: { value: 'author@example.org' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorEmail',
                    }),
                ).toBeValid();

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorEmail',
                    }),
                ).toHaveValue('author@example.org');

                expect(screen.queryAllByRole('error_required')).toHaveLength(0);

                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.authorEmail',
                        }),
                        {
                            target: { value: '' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorEmail',
                    }),
                ).toBeValid();

                expect(screen.queryAllByRole('error_required')).toHaveLength(0);
            });

            it('should display when field is not a valid email', async () => {
                await waitFor(() => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.authorEmail',
                        }),
                        {
                            target: { value: 'author' },
                        },
                    );
                });

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorEmail',
                    }),
                ).not.toBeValid();

                expect(screen.getByText('error_invalid_email')).toHaveRole(
                    'alert',
                );
            });
        });
    });

    it('should allow to create a comment annotation on the field when field value is not editable', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue="initialValue"
                isFieldValueAnnotable={false}
            />,
        );

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => setTimeout(500));

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            kind: 'comment',
            target: 'title',
            reCaptchaToken: null,
        });
    });

    it('should allow to create a comment annotation on the field when there is an initial value', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue="initialValue"
                isFieldValueAnnotable={true}
            />,
        );

        fireEvent.click(
            screen.getByRole('menuitem', {
                name: 'annotation_comment_target_title',
            }),
        );

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => setTimeout(500));

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: null,
            target: 'title',
            kind: 'comment',
            reCaptchaToken: null,
        });
    });

    it('should allow to create a removal annotation on the value when there is a single initial value', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue="initialValue"
                isFieldValueAnnotable={true}
            />,
        );

        fireEvent.click(
            screen.getByRole('menuitem', {
                name: 'annotation_comment_target_value',
            }),
        );

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_remove_content',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => setTimeout(500));

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: 'initialValue',
            target: 'value',
            kind: 'removal',
            reCaptchaToken: null,
        });
    });

    it('should allow to create a removal annotation on a selected value when there is multiple initial value', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={['firstValue', 'secondValue']}
                isFieldValueAnnotable={true}
            />,
        );

        fireEvent.click(
            screen.getByRole('menuitem', {
                name: 'annotation_comment_target_value',
            }),
        );

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_remove_content',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.mouseDown(
                screen.getByLabelText('annotation_choose_value *'),
            );
        });

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('option', { name: 'secondValue' }),
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => setTimeout(500));

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: 'secondValue',
            target: 'value',
            kind: 'removal',
            reCaptchaToken: null,
        });
    });

    it('should allow to create a correct annotation on the value when there is a single initial value', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue="initialValue"
                isFieldValueAnnotable={true}
            />,
        );

        fireEvent.click(
            screen.getByRole('menuitem', {
                name: 'annotation_comment_target_value',
            }),
        );

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_correct_content',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                }),
                {
                    target: { value: 'proposedValue' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => setTimeout(500));

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: 'initialValue',
            proposedValue: 'proposedValue',
            reCaptchaToken: null,
            target: 'value',
            kind: 'correction',
        });
    });

    it('should allow to create a correct annotation on a selected value when there is multiple initial value', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={['firstValue', 'secondValue']}
                isFieldValueAnnotable={true}
            />,
        );

        fireEvent.click(
            screen.getByRole('menuitem', {
                name: 'annotation_comment_target_value',
            }),
        );

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_correct_content',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.mouseDown(
                screen.getByLabelText('annotation_choose_value *'),
            );
        });

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('option', { name: 'secondValue' }),
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                }),
                {
                    target: { value: 'proposedValue' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => setTimeout(500));

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: 'secondValue',
            proposedValue: 'proposedValue',
            reCaptchaToken: null,
            target: 'value',
            kind: 'correction',
        });
    });

    it('should allow to create an add annotation when there is a single initial value', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue="initialValue"
                isFieldValueAnnotable={true}
            />,
        );

        fireEvent.click(
            screen.getByRole('menuitem', {
                name: 'annotation_comment_target_value',
            }),
        );

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_add_content',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                }),
                {
                    target: { value: 'proposedValue' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => setTimeout(500));

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: null,
            proposedValue: 'proposedValue',
            reCaptchaToken: null,
            target: 'value',
            kind: 'addition',
        });
    });
    it('should allow to create a add annotation when there is multiple initial value', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={['firstValue', 'secondValue']}
                isFieldValueAnnotable={true}
            />,
        );

        fireEvent.click(
            screen.getByRole('menuitem', {
                name: 'annotation_comment_target_value',
            }),
        );

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_add_content',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                }),
                {
                    target: { value: 'proposedValue' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => setTimeout(500));

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: null,
            proposedValue: 'proposedValue',
            reCaptchaToken: null,
            target: 'value',
            kind: 'addition',
        });
    });
});
