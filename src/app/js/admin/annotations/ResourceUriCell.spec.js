import React from 'react';
import { render } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { ResourceUriCell } from './ResourceUriCell';

describe('ResourceUriCell', () => {
    it('should display resource_home_page if resourceUri is null', () => {
        const wrapper = render(
            <TestI18N>
                <ResourceUriCell
                    row={{
                        resourceUri: null,
                        resource: null,
                    }}
                />
            </TestI18N>,
        );

        expect(wrapper.queryByText('annotation_home_page')).toBeInTheDocument();
    });

    it('should display annotation_graph_page if  field scope is graphic', () => {
        const wrapper = render(
            <TestI18N>
                <ResourceUriCell
                    row={{
                        resourceUri: null,
                        resource: null,
                        field: {
                            name: 'HDpz',
                            scope: 'graphic',
                        },
                    }}
                />
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_graph_page'),
        ).toBeInTheDocument();
    });

    it('should display the resourceUri with a button to the resource if the resource still exist', () => {
        const wrapper = render(
            <TestI18N>
                <ResourceUriCell
                    row={{
                        resourceUri: 'uid:/0579J7JN',
                        resource: {
                            title: 'The resource title',
                        },
                    }}
                />
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_home_page'),
        ).not.toBeInTheDocument();
        expect(wrapper.queryByText('uid:/0579J7JN')).toBeInTheDocument();
        expect(
            wrapper.queryByTitle('annotation_resource_link'),
        ).toHaveAttribute('href', '/instance/default/uid:/0579J7JN');
    });

    it('should only display the resourceUri if the resource does not exist anymore', () => {
        const wrapper = render(
            <TestI18N>
                <ResourceUriCell
                    row={{
                        resourceUri: 'uid:/0579J7JN',
                        resource: null,
                    }}
                />
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_home_page'),
        ).not.toBeInTheDocument();
        expect(wrapper.queryByText('uid:/0579J7JN')).toBeInTheDocument();
        expect(
            wrapper.queryByTitle('annotation_resource_link'),
        ).not.toBeInTheDocument();
    });
});
