import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { AnnotationDetail } from './AnnotationDetail';
import { useGetAnnotation } from './hooks/useGetAnnotation';

jest.mock('./hooks/useGetAnnotation', () => ({ useGetAnnotation: jest.fn() }));
jest.mock('./hooks/useUpdateAnnotation', () => ({
    useUpdateAnnotation: jest.fn().mockReturnValue({
        handleUpdateAnnotation: jest.fn(),
        isSubmitting: false,
    }),
}));

describe('AnnotationDetail', () => {
    it('should render the annotation with its field and resource', () => {
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: 'uid:/1234',
                resource: {
                    title: 'The resource title',
                },
                comment: 'Just testing the annotation system',
                status: 'ongoing',
                internalComment: 'Just testing the annotation admin',
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
            },
            isLoading: false,
            error: null,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationDetail />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.getByRole('heading', {
                name: 'annotation_header uid:/1234',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('heading', {
                name: 'The resource title',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('link', { name: 'annotation_resource_link' }),
        ).toHaveAttribute('href', '/instance/default/uid:/1234');

        // Field region
        const fieldRegion = wrapper.getByRole('region', {
            name: 'annotation_field_section',
        });
        expect(fieldRegion).toBeInTheDocument();
        expect(
            wrapper.getByText('[GaZr]', {
                container: fieldRegion,
            }),
        ).toBeInTheDocument();
        expect(
            wrapper.getByText('Annotated field', {
                container: fieldRegion,
            }),
        ).toBeInTheDocument();
        expect(
            wrapper.getByText('annotated_field', {
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
                container: authorRegion,
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('link', {
                name: 'ributor@gmail.com',
                container: authorRegion,
            }),
        ).toHaveAttribute('href', 'mailto:ributor@gmail.com');

        const complementaryInfosRegion = wrapper.getByRole('region', {
            name: 'annotation_complementary_infos_section',
        });
        expect(
            wrapper.queryByLabelText('annotation_created_at', {
                container: complementaryInfosRegion,
            }),
        ).toHaveTextContent('1/1/2025');
        expect(
            wrapper.queryByLabelText('annotation_updated_at', {
                container: complementaryInfosRegion,
            }),
        ).toHaveTextContent('10/1/2025');

        const inputsRegion = wrapper.getByRole('group', {
            name: 'annotation_form_title',
        });
        expect(inputsRegion).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation_status', {
                container: inputsRegion,
            }),
        ).toHaveTextContent('annotation_status_ongoing');
        expect(
            wrapper.getByRole('textbox', {
                name: 'annotation_internal_comment',
                container: inputsRegion,
            }),
        ).toHaveValue('Just testing the annotation admin');
        expect(
            wrapper.getByRole('textbox', {
                name: 'annotation_administrator',
                container: inputsRegion,
            }),
        ).toHaveValue('The administrator');
    });

    it('should render the annotation with no resource', () => {
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: null,
                resource: null,
                comment: 'Just testing the annotation system',
                field: {
                    name: 'GaZr',
                    label: 'Annotated field',
                    internalName: 'annotated_field',
                    internalScopes: ['home'],
                },
                createdAt: new Date('01-01-2025').toISOString(),
            },
            isLoading: false,
            error: null,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationDetail />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.getByRole('heading', {
                name: 'annotation_header annotation_home_page',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('link', { name: 'annotation_resource_link' }),
        ).toHaveAttribute('href', '/instance/default');
    });

    it('should render an annotation with a resourceUri but a resource that could not be found', () => {
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: 'uid:/404',
                resource: null,
                comment: 'Just testing the annotation system',
                field: {
                    name: 'GaZr',
                    label: 'Annotated field',
                    internalName: 'annotated_field',
                    internalScopes: ['home'],
                },
                createdAt: new Date('01-01-2025').toISOString(),
            },
            isLoading: false,
            error: null,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationDetail />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.getByRole('heading', {
                name: 'annotation_header uid:/404',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('heading', {
                name: 'annotation_resource_not_found',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.queryByTitle('annotation_resource_link'),
        ).not.toBeInTheDocument();
    });

    it('should render an annotation with a field that could not be found', () => {
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: 'uid:/1234',
                resource: {
                    title: 'The resource title',
                },
                comment: 'Just testing the annotation system',
                field: null,
                createdAt: new Date('01-01-2025').toISOString(),
            },
            isLoading: false,
            error: null,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationDetail />
                </MemoryRouter>
            </TestI18N>,
        );
        expect(
            wrapper.getByRole('heading', {
                name: 'annotation_header uid:/1234',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('heading', {
                name: 'The resource title',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('region', {
                name: 'annotation_field_section',
            }),
        ).toHaveTextContent('annotation_field_not_found');
    });

    it('should render a loading indicator while the resource is loading', () => {
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: null,
            isLoading: true,
            error: null,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationDetail />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.queryByRole('heading', {
                name: 'annotation_header uid:/1234',
            }),
        ).not.toBeInTheDocument();

        expect(
            wrapper.queryByRole('heading', {
                name: 'The resource title',
            }),
        ).not.toBeInTheDocument();

        expect(wrapper.queryByText('loading')).toBeInTheDocument();
    });
});
