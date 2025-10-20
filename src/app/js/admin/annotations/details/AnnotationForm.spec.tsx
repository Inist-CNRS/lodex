import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../../../test-utils';
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
        const screen = render(
            <QueryClientProvider client={queryClient}>
                <TestI18N>
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
            screen.getByRole('heading', {
                name: 'annotation_header_comment uid:/1234',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'The resource title',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', { name: 'annotation_see_resource' }),
        ).toHaveAttribute('href', '/instance/default/uid:/1234#field-GaZr');

        expect(
            screen.getByRole('link', { name: 'annotation_update_resource' }),
        ).toHaveAttribute(
            'href',
            '/instance/default/admin#/data/existing?uri=uid%3A%2F1234',
        );

        // Field region
        const fieldRegion = screen.getByRole('region', {
            name: 'annotation_field_section',
        });
        expect(fieldRegion).toBeInTheDocument();
        expect(
            screen.getByText('[GaZr]', {
                container: fieldRegion,
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Annotated field', {
                container: fieldRegion,
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByText('annotated_field', {
                container: fieldRegion,
            }),
        ).toBeInTheDocument();

        // Comment region
        const commentRegion = screen.getByRole('region', {
            name: 'annotation_comment_section',
        });
        expect(commentRegion).toBeInTheDocument();
        expect(
            screen.getByText('Just testing the annotation system', {
                container: commentRegion,
            }),
        ).toBeInTheDocument();

        // Comment region
        const authorRegion = screen.getByRole('region', {
            name: 'annotation_comment_section',
        });
        expect(authorRegion).toBeInTheDocument();
        expect(
            screen.getByText('Count Ributor', {
                container: authorRegion,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: 'ributor@gmail.com',
                container: authorRegion,
            }),
        ).toHaveAttribute('href', 'mailto:ributor@gmail.com');

        const complementaryInfosRegion = screen.getByRole('region', {
            name: 'annotation_complementary_infos_section',
        });
        expect(
            screen.queryByLabelText('annotation_created_at', {
                container: complementaryInfosRegion,
            }),
        ).toHaveTextContent('1/1/2025');
        expect(
            screen.queryByLabelText('annotation_updated_at', {
                container: complementaryInfosRegion,
            }),
        ).toHaveTextContent('10/1/2025');
    });

    it('should render annotation edit form', () => {
        const screen = render(
            <QueryClientProvider client={queryClient}>
                <TestI18N>
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

        const inputsRegion = screen.getByRole('group', {
            name: 'annotation_form_title',
        });
        expect(inputsRegion).toBeInTheDocument();
        expect(
            screen.queryByLabelText('annotation_status', {
                container: inputsRegion,
            }),
        ).toHaveTextContent('annotation_status_ongoing');
        expect(
            screen.getByRole('textbox', {
                name: 'annotation_internal_comment',
                container: inputsRegion,
            }),
        ).toHaveValue('Just testing the annotation admin');
        expect(
            screen.getByRole('textbox', {
                name: 'annotation_administrator',
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

        const screen = render(
            <QueryClientProvider client={queryClient}>
                <TestI18N>
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

        const inputsRegion = screen.getByRole('group', {
            name: 'annotation_form_title',
        });
        expect(inputsRegion).toBeInTheDocument();

        await screen.waitFor(() => {
            screen.fireEvent.mouseDown(
                screen.getByRole('button', {
                    name: 'annotation_status',
                    container: inputsRegion,
                }),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByText('annotation_status_ongoing'),
            );
        });
        expect(
            screen.queryByLabelText('annotation_status', {
                container: inputsRegion,
            }),
        ).toHaveTextContent('annotation_status_ongoing');

        await screen.waitFor(() => {
            screen.fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation_internal_comment',
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
            screen.getByRole('textbox', {
                name: 'annotation_internal_comment',
                container: inputsRegion,
            }),
        ).toHaveValue('Just testing the annotation admin');

        await screen.waitFor(() => {
            screen.fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation_administrator',
                    container: inputsRegion,
                }),
                {
                    target: {
                        value: 'Jonathan',
                    },
                },
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('button', { name: 'save' }),
            );
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
