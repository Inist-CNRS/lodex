// @ts-expect-error TS6133
import React from 'react';
import { render } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { ResourceUriCell } from './ResourceUriCell';

describe('ResourceUriCell', () => {
    it.each([[null], ['/']])(
        'should not display "/" for home page',
        (resourceUri) => {
            const wrapper = render(
                <TestI18N>
                    <ResourceUriCell
                        row={{
                            resourceUri,
                            resource: null,
                        }}
                    />
                </TestI18N>,
            );

            expect(wrapper.queryByText('/')).toBeInTheDocument();
        },
    );

    it('should display resourceUri when set if field is a graph', () => {
        const wrapper = render(
            <TestI18N>
                <ResourceUriCell
                    row={{
                        resourceUri: '/graph/HDpz',
                        resource: null,
                        field: {
                            name: 'OtHr',
                            scope: 'graphic',
                        },
                    }}
                />
            </TestI18N>,
        );

        expect(wrapper.queryByText('/graph/HDpz')).toBeInTheDocument();
    });

    it('should construct graph uri from field when resourceUri is not set', () => {
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

        expect(wrapper.queryByText('/graph/HDpz')).toBeInTheDocument();
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
