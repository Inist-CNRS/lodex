import '@testing-library/jest-dom';
import React from 'react';
import { render } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { MemoryRouter } from 'react-router-dom';
import { useGetAnnotation } from './useGetAnnotation';
import { AnnotationItem } from './AnnotationItem';

jest.mock('./useGetAnnotation', () => ({ useGetAnnotation: jest.fn() }));

describe('AnnotationItem', () => {
    it('should render the annotation with its field and resource', () => {
        jest.mocked(useGetAnnotation).mockImplementation(() => ({
            data: {
                resourceUri: 'uid:/1234',
                resource: {
                    title: 'The resource title',
                },
                comment: 'Just testing the annotation system',
                field: {
                    name: 'GaZr',
                    label: 'Annotated field',
                    internalName: 'annotated_field',
                    internalScopes: ['resource'],
                },
                authorName: 'Count Ributor',
                authorEmail: 'ributor@gmail.com',
                createdAt: new Date('01-01-2025').toISOString(),
            },
            isLoading: false,
            error: null,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationItem />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_header The resource title'),
        ).toBeInTheDocument();

        expect(wrapper.queryByText('uid:/1234')).toBeInTheDocument();

        expect(
            wrapper.queryByTitle('annotation_resource_link'),
        ).toHaveAttribute('href', '/instance/default/uid:/1234');

        expect(
            wrapper.queryByLabelText('annotation_field_label'),
        ).toHaveTextContent('Annotated field');

        expect(
            wrapper.queryByLabelText('annotation_field_name'),
        ).toHaveTextContent('[GaZr]');

        expect(
            wrapper.queryByLabelText('annotation_field_internal_name'),
        ).toHaveTextContent('annotated_field');

        expect(
            wrapper.queryByLabelText('annotation_comment_section'),
        ).toHaveTextContent('Just testing the annotation system');

        expect(
            wrapper.queryByLabelText('annotation_field_author_name'),
        ).toHaveTextContent('Count Ributor');

        expect(
            wrapper.queryByLabelText('annotation_field_author_email'),
        ).toHaveTextContent('ributor@gmail.com');

        expect(
            wrapper.queryByLabelText('annotation_created_at'),
        ).toHaveTextContent('1/1/2025');
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
                    internalScopes: ['resource'],
                },
                createdAt: new Date('01-01-2025').toISOString(),
            },
            isLoading: false,
            error: null,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationItem />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_header annotation_home_page'),
        ).toBeInTheDocument();

        expect(wrapper.queryByText('/')).toBeInTheDocument();

        expect(
            wrapper.queryByTitle('annotation_resource_link'),
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
                    internalScopes: ['resource'],
                },
                createdAt: new Date('01-01-2025').toISOString(),
            },
            isLoading: false,
            error: null,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationItem />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.queryByText(
                'annotation_header annotation_resource_not_found',
            ),
        ).toBeInTheDocument();

        expect(wrapper.queryByText('uid:/404')).toBeInTheDocument();

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
                    <AnnotationItem />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_header The resource title'),
        ).toBeInTheDocument();

        expect(
            wrapper.queryByText('annotation_field_not_found'),
        ).toBeInTheDocument();
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
                    <AnnotationItem />
                </MemoryRouter>
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_header The resource title'),
        ).not.toBeInTheDocument();

        expect(wrapper.queryByText('loading')).toBeInTheDocument();
    });
});
