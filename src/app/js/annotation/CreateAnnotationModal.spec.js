import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTimeout } from 'node:timers/promises';
import PropTypes from 'prop-types';
import React from 'react';

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

function TestModal({ field, ...props }) {
    return (
        <TestI18N>
            <QueryClientProvider client={queryClient}>
                <CreateAnnotationModal
                    initialValue={null}
                    resourceUri="/"
                    field={{
                        _id: '87a3b1c0-0b1b-4b1b-8b1b-1b1b1b1b1b1b',
                        label: 'Field Label',
                        ...field,
                    }}
                    isFieldValueAnnotable={false}
                    openHistory={jest.fn()}
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
    openHistory: PropTypes.func,
    field: PropTypes.object,
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

        it('should submit form values', async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            await waitFor(
                () => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.comment *',
                        }),
                        {
                            target: { value: 'test' },
                        },
                    );
                },
                { timeout: 10000 },
            );

            await waitFor(
                () => {
                    fireEvent.click(
                        screen.getByRole('button', { name: 'next' }),
                    );
                },
                { timeout: 10000 },
            );

            await waitFor(
                () => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.authorName *',
                        }),
                        {
                            target: { value: 'author' },
                        },
                    );
                },
                { timeout: 10000 },
            );

            await waitFor(
                () => {
                    fireEvent.change(
                        screen.getByRole('textbox', {
                            name: 'annotation.authorEmail',
                        }),
                        {
                            target: { value: 'email@example.org' },
                        },
                    );
                },
                { timeout: 10000 },
            );

            // Wait for the submit button to be enabled
            await waitFor(async () => await setTimeout(500), {
                timeout: 10000,
            });

            await waitFor(
                () => {
                    fireEvent.click(
                        screen.getByRole('button', { name: 'validate' }),
                    );
                },
                { timeout: 10000 },
            );

            await waitFor(
                () => {
                    expect(onSubmit).toHaveBeenCalledTimes(1);
                },
                { timeout: 10000 },
            );

            expect(onSubmit).toHaveBeenCalledWith({
                comment: 'test',
                authorName: 'author',
                authorEmail: 'email@example.org',
                target: 'title',
                kind: 'comment',
                resourceUri: '/',
                reCaptchaToken: null,
            });
        }, 30000);
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

            expect(wrapper.getByText('annotation_history')).toBeInTheDocument();

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

        it('should start on COMMENT_STEP when no annotation kind other than comment is enabled', () => {
            const wrapper = render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                    initialValue="initialValue"
                    isFieldValueAnnotable={true}
                    field={{
                        enableAnnotationKindAddition: false,
                        enableAnnotationKindCorrection: false,
                        enableAnnotationKindRemoval: false,
                    }}
                />,
            );

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_target',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_comment',
                }),
            ).toBeInTheDocument();

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
                        name: 'annotation_remove_content_choice',
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
                    screen.getByLabelText(
                        'annotation_choose_value_to_remove *',
                    ),
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

    describe('close / cancel', () => {
        it.each([['close', 'cancel']])(
            'should call onClose when clicking on %s button when form is not dirty',
            async (label) => {
                render(
                    <TestModal
                        onClose={onClose}
                        onSubmit={onSubmit}
                        isSubmitting={false}
                        isFieldValueAnnotable={true}
                    />,
                );

                await waitFor(() => {
                    fireEvent.click(screen.getByLabelText(label));
                });

                expect(onClose).toHaveBeenCalledTimes(1);
            },
        );

        it.each([['close', 'cancel']])(
            'should call onClose after confirm when clicking on %s button when form is dirty',
            async (label) => {
                render(
                    <TestModal
                        onClose={onClose}
                        onSubmit={onSubmit}
                        isSubmitting={false}
                        isFieldValueAnnotable={true}
                    />,
                );

                await waitFor(() => {
                    fireEvent.click(
                        screen.getByText('annotation_annotate_field_choice'),
                    );
                });

                await waitFor(() => {
                    fireEvent.click(screen.getByText('back'));
                });

                await waitFor(() => {
                    fireEvent.click(screen.getByLabelText(label));
                });

                await waitFor(() => {
                    fireEvent.click(
                        screen.getByRole('button', {
                            name: 'confirm_and_close',
                        }),
                    );
                });

                expect(onClose).toHaveBeenCalledTimes(1);
            },
        );
    });

    describe('target tab', () => {
        it('should not display add value button if disabled', () => {
            const wrapper = render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                    isFieldValueAnnotable={true}
                    field={{ enableAnnotationKindAddition: false }}
                />,
            );

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_target',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_add_content',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_correct_content',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_remove_content_choice',
                }),
            ).toBeInTheDocument();
        });

        it('should not display correct value button if disabled', () => {
            const wrapper = render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                    isFieldValueAnnotable={true}
                    field={{ enableAnnotationKindCorrection: false }}
                />,
            );

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_target',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_add_content',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_correct_content',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_remove_content_choice',
                }),
            ).toBeInTheDocument();
        });

        it('should not display remove value button if disabled', () => {
            const wrapper = render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                    isFieldValueAnnotable={true}
                    field={{ enableAnnotationKindRemoval: false }}
                />,
            );

            expect(
                wrapper.queryByRole('tab', {
                    name: 'annotation_step_target',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_add_content',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_correct_content',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_remove_content_choice',
                }),
            ).not.toBeInTheDocument();
        });
    });

    describe('comment tab', () => {
        beforeEach(async () => {
            render(
                <TestModal
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={false}
                />,
            );

            await waitFor(
                () => {
                    expect(
                        screen.queryByRole('tab', {
                            name: 'annotation_step_comment',
                        }),
                    ).toBeInTheDocument();
                },
                { timeout: 10000 },
            );

            expect(
                screen.queryByRole('tab', {
                    name: 'annotation_step_author',
                    hidden: true,
                }),
            ).not.toBeInTheDocument();
        }, 15000);

        describe('comments', () => {
            it('should render comments field (but no proposedValue field)', () => {
                expect(
                    screen.getByRole('heading', {
                        name: 'annotation_title_annotate_field+{"field":"Field Label"}',
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
                await waitFor(
                    () => {
                        fireEvent.change(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                            {
                                target: { value: 'test' },
                            },
                        );
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                        ).toBeValid();
                    },
                    { timeout: 10000 },
                );

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                ).toHaveValue('test');

                expect(screen.queryAllByRole('error_required')).toHaveLength(0);
            }, 15000);

            it('should display an error when field is not valid', async () => {
                await waitFor(
                    () => {
                        fireEvent.change(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                            {
                                target: { value: 'test' },
                            },
                        );
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                        ).toBeValid();
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        fireEvent.change(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                            {
                                target: { value: '' },
                            },
                        );
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                        ).not.toBeValid();
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(screen.getByText('error_required')).toHaveRole(
                            'alert',
                        );
                    },
                    { timeout: 10000 },
                );
            }, 30000);
        });

        describe('correction comment', () => {
            beforeEach(async () => {
                render(
                    <TestModal
                        onClose={onClose}
                        onSubmit={onSubmit}
                        isSubmitting={false}
                        initialValue="initialValue"
                        isFieldValueAnnotable={true}
                    />,
                );

                await waitFor(
                    () => {
                        const correctButton = screen.queryByText(
                            'annotation_correct_content',
                        );
                        expect(correctButton).toBeInTheDocument();
                        fireEvent.click(correctButton);
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.queryByRole('tab', {
                                name: 'annotation_step_comment',
                            }),
                        ).toBeInTheDocument();
                    },
                    { timeout: 10000 },
                );
            }, 15000);

            it('should render required proposedValue and comment field', async () => {
                await waitFor(
                    () => {
                        expect(
                            screen.getByText(
                                'annotation_title_annotate_field+{"field":"Field Label"}',
                            ),
                        ).toBeInTheDocument();
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('textbox', {
                                name: 'annotation.proposedValue *',
                            }),
                        ).toBeInTheDocument();
                    },
                    { timeout: 10000 },
                );

                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                ).toHaveValue('initialValue');

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                        ).toBeInTheDocument();
                    },
                    { timeout: 10000 },
                );

                expect(
                    screen.getByRole('button', { name: 'next' }),
                ).toBeDisabled();

                await waitFor(
                    () => {
                        fireEvent.change(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                            {
                                target: { value: 'comment' },
                            },
                        );
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('button', { name: 'next' }),
                        ).not.toBeDisabled();
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        fireEvent.change(
                            screen.getByRole('textbox', {
                                name: 'annotation.proposedValue *',
                            }),
                            {
                                target: { value: '' },
                            },
                        );
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('button', { name: 'next' }),
                        ).toBeDisabled();
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        fireEvent.change(
                            screen.getByRole('textbox', {
                                name: 'annotation.proposedValue *',
                            }),
                            {
                                target: { value: 'proposedValue' },
                            },
                        );
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('button', { name: 'next' }),
                        ).not.toBeDisabled();
                    },
                    { timeout: 10000 },
                );
            }, 30000);
        });

        describe('addition comment', () => {
            beforeEach(async () => {
                render(
                    <TestModal
                        onClose={onClose}
                        onSubmit={onSubmit}
                        isSubmitting={false}
                        initialValue="initialValue"
                        isFieldValueAnnotable={true}
                    />,
                );

                await waitFor(
                    () => {
                        const addButton = screen.queryByText(
                            'annotation_add_content',
                        );
                        expect(addButton).toBeInTheDocument();
                        fireEvent.click(addButton);
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.queryByRole('tab', {
                                name: 'annotation_step_comment',
                            }),
                        ).toBeInTheDocument();
                    },
                    { timeout: 10000 },
                );
            }, 15000);

            it('should render required proposedValue and comment field', async () => {
                await waitFor(
                    () => {
                        expect(
                            screen.getByText(
                                'annotation_title_annotate_field+{"field":"Field Label"}',
                            ),
                        ).toBeInTheDocument();
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('textbox', {
                                name: 'annotation.proposedValue *',
                            }),
                        ).toBeInTheDocument();
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                        ).toBeInTheDocument();
                    },
                    { timeout: 10000 },
                );

                expect(
                    screen.getByRole('button', { name: 'next' }),
                ).toBeDisabled();

                await waitFor(
                    () => {
                        fireEvent.change(
                            screen.getByRole('textbox', {
                                name: 'annotation.comment *',
                            }),
                            {
                                target: { value: 'comment' },
                            },
                        );
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('button', { name: 'next' }),
                        ).toBeDisabled();
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        fireEvent.change(
                            screen.getByRole('textbox', {
                                name: 'annotation.proposedValue *',
                            }),
                            {
                                target: { value: 'proposedValue' },
                            },
                        );
                    },
                    { timeout: 10000 },
                );

                await waitFor(
                    () => {
                        expect(
                            screen.getByRole('button', { name: 'next' }),
                        ).not.toBeDisabled();
                    },
                    { timeout: 10000 },
                );
            }, 30000);
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

            await waitFor(
                () => {
                    const commentField = screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    });
                    fireEvent.change(commentField, {
                        target: { value: 'test' },
                    });
                    expect(commentField).toHaveValue('test');
                },
                { timeout: 10000 },
            );

            await waitFor(
                () => {
                    const nextButton = screen.getByRole('button', {
                        name: 'next',
                    });
                    expect(nextButton).not.toBeDisabled();
                    fireEvent.click(nextButton);
                },
                { timeout: 10000 },
            );

            // Wait for navigation to author tab
            await waitFor(
                () => {
                    expect(
                        screen.queryByRole('tab', {
                            name: 'annotation_step_author',
                        }),
                    ).toBeInTheDocument();
                },
                { timeout: 10000 },
            );

            expect(
                screen.queryByRole('tab', {
                    name: 'annotation_step_comment',
                    hidden: true,
                }),
            ).not.toBeInTheDocument();
        }, 20000);

        describe('authorName', () => {
            it('should render authorName field', () => {
                expect(
                    screen.getByRole('heading', {
                        name: 'annotation_title_annotate_field+{"field":"Field Label"}',
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
                        name: 'annotation_title_annotate_field+{"field":"Field Label"}',
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
        const wrapper = render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue="initialValue"
                isFieldValueAnnotable={false}
            />,
        );

        await waitFor(
            () => {
                fireEvent.change(
                    wrapper.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(wrapper.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    wrapper.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    wrapper.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            kind: 'comment',
            target: 'title',
            resourceUri: '/',
            reCaptchaToken: null,
        });
    }, 30000);

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

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_annotate_field_choice',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: null,
            target: 'title',
            kind: 'comment',
            resourceUri: '/',
            reCaptchaToken: null,
        });
    }, 30000);

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

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_remove_content_choice',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: 'initialValue',
            target: 'value',
            kind: 'removal',
            resourceUri: '/',
            reCaptchaToken: null,
        });
    }, 30000);

    it('should allow to create a removal annotation on the value when initial value is a number', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={42}
                isFieldValueAnnotable={true}
            />,
        );

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_remove_content_choice',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: '42',
            target: 'value',
            kind: 'removal',
            resourceUri: '/',
            reCaptchaToken: null,
        });
    }, 30000);

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

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_remove_content_choice',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.mouseDown(
                    screen.getByLabelText(
                        'annotation_choose_value_to_remove *',
                    ),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('option', { name: 'secondValue' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: 'secondValue',
            target: 'value',
            kind: 'removal',
            resourceUri: '/',
            reCaptchaToken: null,
        });
    }, 30000);

    it('should allow to create a removal annotation on a selected value when initial value is an array of number', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={[1, 2, 3]}
                isFieldValueAnnotable={true}
            />,
        );

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_remove_content_choice',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.mouseDown(
                    screen.getByLabelText(
                        'annotation_choose_value_to_remove *',
                    ),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('option', { name: '2' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: '2',
            target: 'value',
            kind: 'removal',
            resourceUri: '/',
            reCaptchaToken: null,
        });
    }, 30000);

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

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_correct_content',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: 'initialValue',
            proposedValue: 'proposedValue',
            resourceUri: '/',
            reCaptchaToken: null,
            target: 'value',
            kind: 'correction',
        });
    }, 30000);

    it('should allow to create a correct annotation on the value when initial value is a number', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={42}
                isFieldValueAnnotable={true}
            />,
        );

        await waitFor(
            () => {
                const correctButton = screen.getByRole('menuitem', {
                    name: 'annotation_correct_content',
                });
                fireEvent.click(correctButton);
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                const commentField = screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                });
                fireEvent.change(commentField, {
                    target: { value: 'test' },
                });
                expect(commentField).toHaveValue('test');
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                const proposedValueField = screen.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                });
                fireEvent.change(proposedValueField, {
                    target: { value: 'proposedValue' },
                });
                expect(proposedValueField).toHaveValue('proposedValue');
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                const nextButton = screen.getByRole('button', { name: 'next' });
                expect(nextButton).not.toBeDisabled();
                fireEvent.click(nextButton);
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                const authorField = screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                });
                fireEvent.change(authorField, {
                    target: { value: 'author' },
                });
                expect(authorField).toHaveValue('author');
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                const validateButton = screen.getByRole('button', {
                    name: 'validate',
                });
                expect(validateButton).not.toBeDisabled();
                fireEvent.click(validateButton);
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: '42',
            proposedValue: 'proposedValue',
            resourceUri: '/',
            reCaptchaToken: null,
            target: 'value',
            kind: 'correction',
        });
    }, 30000);

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

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_correct_content',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.mouseDown(
                    screen.getByLabelText(
                        'annotation_choose_value_to_correct *',
                    ),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('option', { name: 'secondValue' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: 'secondValue',
            proposedValue: 'proposedValue',
            resourceUri: '/',
            reCaptchaToken: null,
            target: 'value',
            kind: 'correction',
        });
    }, 30000);

    it('should allow to create a correct annotation on a selected value when initial value is an array of number', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={[1, 2, 3]}
                isFieldValueAnnotable={true}
            />,
        );

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_correct_content',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.mouseDown(
                    screen.getByLabelText(
                        'annotation_choose_value_to_correct *',
                    ),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('option', { name: '2' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: '2',
            proposedValue: 'proposedValue',
            resourceUri: '/',
            reCaptchaToken: null,
            target: 'value',
            kind: 'correction',
        });
    }, 30000);

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

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_add_content',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: null,
            proposedValue: 'proposedValue',
            resourceUri: '/',
            reCaptchaToken: null,
            target: 'value',
            kind: 'addition',
        });
    }, 30000);
    it('should allow to create an add annotation when initial value is a number', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={42}
                isFieldValueAnnotable={true}
            />,
        );

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_add_content',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: null,
            proposedValue: 'proposedValue',
            resourceUri: '/',
            reCaptchaToken: null,
            target: 'value',
            kind: 'addition',
        });
    }, 30000);
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

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_add_content',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: null,
            proposedValue: 'proposedValue',
            resourceUri: '/',
            reCaptchaToken: null,
            target: 'value',
            kind: 'addition',
        });
    }, 30000);
    it('should allow to create a add annotation when initial value is an array of number', async () => {
        render(
            <TestModal
                onClose={onClose}
                onSubmit={onSubmit}
                isSubmitting={false}
                initialValue={[1, 2, 3]}
                isFieldValueAnnotable={true}
            />,
        );

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('menuitem', {
                        name: 'annotation_add_content',
                    }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.proposedValue *',
                    }),
                    {
                        target: { value: 'proposedValue' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.comment *',
                    }),
                    {
                        target: { value: 'test' },
                    },
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.click(screen.getByRole('button', { name: 'next' }));
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                fireEvent.change(
                    screen.getByRole('textbox', {
                        name: 'annotation.authorName *',
                    }),
                    {
                        target: { value: 'author' },
                    },
                );
            },
            { timeout: 10000 },
        );

        // Wait for the submit button to be enabled
        await waitFor(async () => await setTimeout(500), { timeout: 10000 });

        await waitFor(
            () => {
                fireEvent.click(
                    screen.getByRole('button', { name: 'validate' }),
                );
            },
            { timeout: 10000 },
        );

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 10000 },
        );

        expect(onSubmit).toHaveBeenCalledWith({
            authorName: 'author',
            comment: 'test',
            initialValue: null,
            proposedValue: 'proposedValue',
            resourceUri: '/',
            reCaptchaToken: null,
            target: 'value',
            kind: 'addition',
        });
    }, 30000);
});
