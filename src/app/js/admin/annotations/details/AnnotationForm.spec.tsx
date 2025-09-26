import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
// @ts-expect-error TS7016
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, waitFor } from '../../../../../test-utils';
import { TestI18N } from '../../../i18n/I18NContext';
import { useUpdateAnnotation } from '../hooks/useUpdateAnnotation';
import { AnnotationForm } from './AnnotationForm';

jest.mock('./../hooks/useUpdateAnnotation', () => ({
    useUpdateAnnotation: jest.fn().mockReturnValue({
        handleUpdateAnnotation: jest.fn(),
        isSubmitting: false,
    }),
}));

const queryClient = new QueryClient();

describe('AnnotationForm', () => {
    it('should render annotation items', () => {
        const wrapper = render(
            <QueryClientProvider client={queryClient}>
                <TestI18N>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <MemoryRouter>
                        <AnnotationForm
                            annotation={{
                                resourceUri: 'uid:/1234',
                                resource: {
                                    title: 'The resource title',
                                },
                                kind: 'comment',
                                comment: 'Just testing the annotation system',
                                status: 'ongoing',
                                internalComment:
                                    'Just testing the annotation admin',
                                administrator: 'The administrator',
                                field: {
                                    name: 'GaZr',
                                    label: 'Annotated field',
                                    internalName: 'annotated_field',
                                    internalScopes: ['home'],
                                },
                                authorName: 'Count Ributor',
                                authorEmail: 'ributor@gmail.com',
                                createdAt: new Date('01-01-2025').toISOString(),
                                updatedAt: new Date('10-01-2025').toISOString(),
                            }}
                        />
                    </MemoryRouter>
                </TestI18N>
            </QueryClientProvider>,
        );

        expect(
            wrapper.getByRole('heading', {
                name: 'annotation_header_comment uid:/1234',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('heading', {
                name: 'The resource title',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('link', { name: 'annotation_see_resource' }),
        ).toHaveAttribute('href', '/instance/default/uid:/1234#field-GaZr');

        expect(
            wrapper.getByRole('link', { name: 'annotation_update_resource' }),
        ).toHaveAttribute(
            'href',
            '/instance/default/admin#/data/existing?uri=uid%3A%2F1234',
        );

        // Field region
        const fieldRegion = wrapper.getByRole('region', {
            name: 'annotation_field_section',
        });
        expect(fieldRegion).toBeInTheDocument();
        expect(
            wrapper.getByText('[GaZr]', {
                // @ts-expect-error TS2353
                container: fieldRegion,
            }),
        ).toBeInTheDocument();
        expect(
            wrapper.getByText('Annotated field', {
                // @ts-expect-error TS2353
                container: fieldRegion,
            }),
        ).toBeInTheDocument();
        expect(
            wrapper.getByText('annotated_field', {
                // @ts-expect-error TS2353
                container: fieldRegion,
            }),
        ).toBeInTheDocument();

        // Comment region
        const commentRegion = wrapper.getByRole('region', {
            name: 'annotation_comment_section',
        });
        expect(commentRegion).toBeInTheDocument();
        expect(
            wrapper.getByText('Just testing the annotation system', {
                // @ts-expect-error TS2353
                container: commentRegion,
            }),
        ).toBeInTheDocument();

        // Comment region
        const authorRegion = wrapper.getByRole('region', {
            name: 'annotation_comment_section',
        });
        expect(authorRegion).toBeInTheDocument();
        expect(
            wrapper.getByText('Count Ributor', {
                // @ts-expect-error TS2353
                container: authorRegion,
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('link', {
                name: 'ributor@gmail.com',
                // @ts-expect-error TS2353
                container: authorRegion,
            }),
        ).toHaveAttribute('href', 'mailto:ributor@gmail.com');

        const complementaryInfosRegion = wrapper.getByRole('region', {
            name: 'annotation_complementary_infos_section',
        });
        expect(
            wrapper.queryByLabelText('annotation_created_at', {
                // @ts-expect-error TS2353
                container: complementaryInfosRegion,
            }),
        ).toHaveTextContent('1/1/2025');
        expect(
            wrapper.queryByLabelText('annotation_updated_at', {
                // @ts-expect-error TS2353
                container: complementaryInfosRegion,
            }),
        ).toHaveTextContent('10/1/2025');
    });

    it('should render annotation edit form', () => {
        const wrapper = render(
            <QueryClientProvider client={queryClient}>
                <TestI18N>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <MemoryRouter>
                        <AnnotationForm
                            annotation={{
                                resourceUri: 'uid:/1234',
                                resource: {
                                    title: 'The resource title',
                                },
                                kind: 'comment',
                                comment: 'Just testing the annotation system',
                                status: 'ongoing',
                                internalComment:
                                    'Just testing the annotation admin',
                                administrator: 'The administrator',
                                field: {
                                    name: 'GaZr',
                                    label: 'Annotated field',
                                    internalName: 'annotated_field',
                                    internalScopes: ['home'],
                                },
                                authorName: 'Count Ributor',
                                authorEmail: 'ributor@gmail.com',
                                createdAt: new Date('01-01-2025').toISOString(),
                                updatedAt: new Date('10-01-2025').toISOString(),
                            }}
                        />
                    </MemoryRouter>
                </TestI18N>
            </QueryClientProvider>,
        );

        const inputsRegion = wrapper.getByRole('group', {
            name: 'annotation_form_title',
        });
        expect(inputsRegion).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation_status', {
                // @ts-expect-error TS2353
                container: inputsRegion,
            }),
        ).toHaveTextContent('annotation_status_ongoing');
        expect(
            wrapper.getByRole('textbox', {
                name: 'annotation_internal_comment',
                // @ts-expect-error TS2353
                container: inputsRegion,
            }),
        ).toHaveValue('Just testing the annotation admin');
        expect(
            wrapper.getByRole('textbox', {
                name: 'annotation_administrator',
                // @ts-expect-error TS2353
                container: inputsRegion,
            }),
        ).toHaveValue('The administrator');
    });

    it('should submit form', async () => {
        const handleUpdateAnnotation = jest.fn();
        jest.mocked(useUpdateAnnotation).mockImplementation(() => ({
            handleUpdateAnnotation,
            isSubmitting: false,
        }));

        const wrapper = render(
            <QueryClientProvider client={queryClient}>
                <TestI18N>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <MemoryRouter>
                        <AnnotationForm
                            annotation={{
                                _id: '1e4ada92-abb4-4b52-b3e7-77e070d9f596',
                                resourceUri: 'uid:/1234',
                                resource: {
                                    title: 'The resource title',
                                },
                                kind: 'comment',
                                comment: 'Just testing the annotation system',
                                status: 'to_review',
                                internalComment: null,
                                administrator: null,
                                field: {
                                    name: 'GaZr',
                                    label: 'Annotated field',
                                    internalName: 'annotated_field',
                                    internalScopes: ['home'],
                                },
                                authorName: 'Count Ributor',
                                authorEmail: 'ributor@gmail.com',
                                createdAt: new Date('01-01-2025').toISOString(),
                                updatedAt: new Date('10-01-2025').toISOString(),
                            }}
                        />
                    </MemoryRouter>
                </TestI18N>
            </QueryClientProvider>,
        );

        const inputsRegion = wrapper.getByRole('group', {
            name: 'annotation_form_title',
        });
        expect(inputsRegion).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.mouseDown(
                wrapper.getByRole('button', {
                    name: 'annotation_status',
                    // @ts-expect-error TS2353
                    container: inputsRegion,
                }),
            );
        });

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('annotation_status_ongoing'));
        });
        expect(
            wrapper.queryByLabelText('annotation_status', {
                // @ts-expect-error TS2353
                container: inputsRegion,
            }),
        ).toHaveTextContent('annotation_status_ongoing');

        await waitFor(() => {
            fireEvent.change(
                wrapper.getByRole('textbox', {
                    name: 'annotation_internal_comment',
                    // @ts-expect-error TS2353
                    container: inputsRegion,
                }),
                {
                    target: {
                        value: 'Just testing the annotation admin',
                    },
                },
            );
        });

        expect(
            wrapper.getByRole('textbox', {
                name: 'annotation_internal_comment',
                // @ts-expect-error TS2353
                container: inputsRegion,
            }),
        ).toHaveValue('Just testing the annotation admin');

        await waitFor(() => {
            fireEvent.change(
                wrapper.getByRole('textbox', {
                    name: 'annotation_administrator',
                    // @ts-expect-error TS2353
                    container: inputsRegion,
                }),
                {
                    target: {
                        value: 'Jonathan',
                    },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(wrapper.getByRole('button', { name: 'save' }));
        });

        expect(handleUpdateAnnotation).toHaveBeenCalledTimes(1);
        expect(handleUpdateAnnotation).toHaveBeenCalledWith(
            '1e4ada92-abb4-4b52-b3e7-77e070d9f596',
            {
                status: 'ongoing',
                internalComment: 'Just testing the annotation admin',
                adminComment: '',
                administrator: 'Jonathan',
            },
        );
    });
});
