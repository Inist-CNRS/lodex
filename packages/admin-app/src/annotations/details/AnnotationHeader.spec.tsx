import { render } from '../../../../../src/test-utils';
import { TestI18N } from '../../../../../src/app/js/i18n/I18NContext';
import { AnnotationHeader } from './AnnotationHeader';

describe('AnnotationHeader', () => {
    it('should render header for home page if resourceUri is "/"', () => {
        const screen = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: '/',
                        resource: null,
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
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_comment annotation_home_page',
            }),
        ).toBeInTheDocument();
    });

    it('should render header for home page if resourceUri is null', () => {
        const screen = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: '/',
                        resource: null,
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
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_comment annotation_home_page',
            }),
        ).toBeInTheDocument();
    });

    it('should render header for graphic page if resourceUri is a graph URI', () => {
        const screen = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: '/graph/GaZr',
                        resource: null,
                        kind: 'comment',
                        comment: 'Just testing the annotation system',
                        field: {
                            name: 'OthR',
                            label: 'Annotated field',
                            internalName: 'annotated_field',
                            internalScopes: ['home'],
                            scope: 'graphic',
                        },
                        createdAt: new Date('01-01-2025').toISOString(),
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_comment annotation_graph_page',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Annotated field',
            }),
        ).toBeInTheDocument();
    });

    it('should render header for graphic page if resourceUri is null', () => {
        const screen = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: '/graph/GaZr',
                        resource: null,
                        kind: 'comment',
                        comment: 'Just testing the annotation system',
                        field: {
                            name: 'GaZr',
                            label: 'Annotated field',
                            internalName: 'annotated_field',
                            internalScopes: ['home'],
                            scope: 'graphic',
                        },
                        createdAt: new Date('01-01-2025').toISOString(),
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_comment annotation_graph_page',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Annotated field',
            }),
        ).toBeInTheDocument();
    });

    it('should render header for resource page', () => {
        const screen = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
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
                    }}
                />
            </TestI18N>,
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
    });

    it('should render title prefixed with comment when kind is comment', () => {
        const screen = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
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
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_comment uid:/1234',
            }),
        ).toBeInTheDocument();
    });

    it('should render title prefixed with removal when kind is removal', () => {
        const screen = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: 'uid:/1234',
                        resource: {
                            title: 'The resource title',
                        },
                        kind: 'removal',
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
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_removal uid:/1234',
            }),
        ).toBeInTheDocument();
    });

    it('should render header for deleted resource', () => {
        const screen = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: 'uid:/1234',
                        resource: null,
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
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.getByRole('heading', {
                name: 'annotation_header_comment uid:/1234',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'annotation_resource_not_found',
            }),
        ).toBeInTheDocument();
    });
});
