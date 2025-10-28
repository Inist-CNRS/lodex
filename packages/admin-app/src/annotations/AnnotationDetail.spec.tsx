import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../../src/test-utils';
import { TestI18N } from '../../../../src/app/js/i18n/I18NContext';
import { AnnotationDetail } from './AnnotationDetail';
import { useGetAnnotation } from './hooks/useGetAnnotation';
import { within } from '@testing-library/dom';

jest.mock('./hooks/useGetAnnotation', () => ({ useGetAnnotation: jest.fn() }));
jest.mock('./hooks/useUpdateAnnotation', () => ({
    useUpdateAnnotation: jest.fn().mockReturnValue({
        handleUpdateAnnotation: jest.fn(),
        isSubmitting: false,
    }),
}));

const queryClient = new QueryClient();

function TestAnnotationDetail() {
    return (
        <QueryClientProvider client={queryClient}>
            <TestI18N>
                <MemoryRouter>
                    <AnnotationDetail />
                </MemoryRouter>
            </TestI18N>
        </QueryClientProvider>
    );
}

describe('AnnotationDetail', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the annotation with its field and resource', () => {
        // @ts-expect-error TS2345
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: 'uid:/1234',
                resource: {
                    title: 'The resource title',
                },
                kind: 'comment',
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
        const screen = render(<TestAnnotationDetail />);

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

        // Author region
        const authorRegion = screen.getByRole('region', {
            name: 'annotation_contributor_section',
        });
        expect(authorRegion).toBeInTheDocument();
        expect(
            within(authorRegion).queryByText('Count Ributor'),
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

    it('should render the annotation targeting home', () => {
        // @ts-expect-error TS2345
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: '/',
                resource: null,
                kind: 'comment',
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

        const screen = render(<TestAnnotationDetail />);

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_comment annotation_home_page',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', { name: 'annotation_see_home' }),
        ).toHaveAttribute('href', '/instance/default#field-GaZr');
    });

    it('should render an annotation with a resourceUri but a resource that could not be found', () => {
        // @ts-expect-error TS2345
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: 'uid:/404',
                resource: null,
                kind: 'comment',
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

        const screen = render(<TestAnnotationDetail />);

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_comment uid:/404',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'annotation_resource_not_found',
            }),
        ).toBeInTheDocument();

        expect(
            screen.queryByTitle('annotation_resource_link'),
        ).not.toBeInTheDocument();
    });

    it('should render an annotation with a field that could not be found', () => {
        // @ts-expect-error TS2345
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: 'uid:/1234',
                resource: {
                    title: 'The resource title',
                },
                kind: 'comment',
                comment: 'Just testing the annotation system',
                field: null,
                createdAt: new Date('01-01-2025').toISOString(),
            },
            isLoading: false,
            error: null,
        }));

        const screen = render(<TestAnnotationDetail />);

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
            screen.getByRole('region', {
                name: 'annotation_field_section',
            }),
        ).toHaveTextContent('annotation_field_not_found');
    });

    it('should render a loading indicator while the resource is loading', () => {
        // @ts-expect-error TS2345
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: null,
            isLoading: true,
            error: null,
        }));

        const screen = render(<TestAnnotationDetail />);

        expect(
            screen.queryByRole('heading', {
                name: 'annotation_header_comment uid:/1234',
            }),
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole('heading', {
                name: 'The resource title',
            }),
        ).not.toBeInTheDocument();

        expect(screen.queryByText('loading')).toBeInTheDocument();
    });
});
