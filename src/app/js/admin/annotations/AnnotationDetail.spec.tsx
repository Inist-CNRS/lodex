import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
