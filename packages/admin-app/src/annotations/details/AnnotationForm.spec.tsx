import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { TestI18N } from '@lodex/frontend-common/i18n/I18NContext';
import { useUpdateAnnotation } from '../hooks/useUpdateAnnotation';
import { AnnotationForm } from './AnnotationForm';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { render, userEvent } from '../../test-utils';

jest.mock('../hooks/useUpdateAnnotation', () => ({
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
            '/instance/default/admin#/data/existing/dataset?uri=uid%3A%2F1234',
        );

        // Field region
        const fieldRegion = screen.getByRole('region', {
            name: 'annotation_field_section',
        });
        expect(fieldRegion).toBeInTheDocument();
        expect(within(fieldRegion).getByText('[GaZr]')).toBeInTheDocument();
        expect(
            within(fieldRegion).getByText('Annotated field'),
        ).toBeInTheDocument();
        expect(
            within(fieldRegion).getByText('annotated_field'),
        ).toBeInTheDocument();

        // Comment region
        const commentRegion = screen.getByRole('region', {
            name: 'annotation_comment_section',
        });
        expect(commentRegion).toBeInTheDocument();
        expect(
            within(commentRegion).getByText(
                'Just testing the annotation system',
            ),
        ).toBeInTheDocument();

        // Comment region
        const authorRegion = screen.getByRole('region', {
            name: 'annotation_contributor_section',
        });

        expect(authorRegion).toBeInTheDocument();

        expect(
            within(authorRegion).getByText('Count Ributor'),
        ).toBeInTheDocument();

        expect(
            within(authorRegion).getByRole('link', {
                name: 'ributor@gmail.com',
            }),
        ).toHaveAttribute('href', 'mailto:ributor@gmail.com');

        const complementaryInfosRegion = screen.getByRole('region', {
            name: 'annotation_complementary_infos_section',
        });
        expect(
            within(complementaryInfosRegion).queryByLabelText(
                'annotation_created_at',
            ),
        ).toHaveTextContent('1/1/2025');
        expect(
            within(complementaryInfosRegion).queryByLabelText(
                'annotation_updated_at',
            ),
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
            within(inputsRegion).queryByLabelText('annotation_status'),
        ).toHaveTextContent('annotation_status_ongoing');
        expect(
            within(inputsRegion).getByRole('textbox', {
                name: 'annotation_internal_comment',
            }),
        ).toHaveValue('Just testing the annotation admin');
        expect(
            within(inputsRegion).getByRole('textbox', {
                name: 'annotation_administrator',
            }),
        ).toHaveValue('The administrator');
    });

    it('should submit form', async () => {
        const user = userEvent.setup();
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

        await waitFor(() => {
            user.click(
                within(inputsRegion).getByLabelText('annotation_status'),
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByText('annotation_status_ongoing'));
        });
        expect(
            within(inputsRegion).queryByLabelText('annotation_status'),
        ).toHaveTextContent('annotation_status_ongoing');

        await waitFor(() => {
            fireEvent.change(
                within(inputsRegion).getByRole('textbox', {
                    name: 'annotation_internal_comment',
                }),
                {
                    target: {
                        value: 'Just testing the annotation admin',
                    },
                },
            );
        });

        expect(
            within(inputsRegion).getByRole('textbox', {
                name: 'annotation_internal_comment',
            }),
        ).toHaveValue('Just testing the annotation admin');

        await waitFor(() => {
            fireEvent.change(
                within(inputsRegion).getByRole('textbox', {
                    name: 'annotation_administrator',
                }),
                {
                    target: {
                        value: 'Jonathan',
                    },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'save' }));
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
