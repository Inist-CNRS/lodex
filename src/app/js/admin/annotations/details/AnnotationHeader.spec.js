import React from 'react';
import { render } from '../../../../../test-utils';
import { TestI18N } from '../../../i18n/I18NContext';
import { AnnotationHeader } from './AnnotationHeader';

describe('AnnotationHeader', () => {
    it('should render header for home page', () => {
        const wrapper = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: null,
                        resource: null,
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
            wrapper.getByRole('heading', {
                name: 'annotation_header annotation_home_page',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('link', { name: 'annotation_resource_link' }),
        ).toHaveAttribute('href', '/instance/default');
    });

    it('should render header for graphic page', () => {
        const wrapper = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: null,
                        resource: null,
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
            wrapper.getByRole('heading', {
                name: 'annotation_header annotation_graph_page',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('heading', {
                name: 'Annotated field',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('link', { name: 'annotation_resource_link' }),
        ).toHaveAttribute('href', '/instance/default/graph/GaZr');
    });

    it('should render header for resource page', () => {
        const wrapper = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
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
                    }}
                />
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
    });

    it('should render header for deleted resource', () => {
        const wrapper = render(
            <TestI18N>
                <AnnotationHeader
                    annotation={{
                        resourceUri: 'uid:/1234',
                        resource: null,
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
            wrapper.getByRole('heading', {
                name: 'annotation_header uid:/1234',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('heading', {
                name: 'annotation_resource_not_found',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.queryByRole('link', { name: 'annotation_resource_link' }),
        ).not.toBeInDocument;
    });
});
