import React from 'react';
import { render } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { ResourceTitleCell } from './ResourceTitleCell';

describe('ResourceTitleCell', () => {
    it('should render be empty when resourceUri is null', () => {
        const wrapper = render(
            <TestI18N>
                {/*
                 // @ts-expect-error TS2322 */}
                <ResourceTitleCell
                    row={{
                        resourceUri: '/',
                        resource: null,
                    }}
                />
            </TestI18N>,
        );

        expect(wrapper.container).toBeEmptyDOMElement();
    });

    it('should render be empty when field scope is graphic', () => {
        const wrapper = render(
            <TestI18N>
                {/*
                 // @ts-expect-error TS2322 */}
                <ResourceTitleCell
                    row={{
                        resourceUri: 'uid:/qsdf',
                        resource: null,
                        field: {
                            label: 'Field label',
                            scope: 'graphic',
                        },
                    }}
                />
            </TestI18N>,
        );

        expect(wrapper.container).toBeEmptyDOMElement();
    });

    it('should render annotation_resource_not_found message when resource is null', () => {
        const wrapper = render(
            <TestI18N>
                {/*
                 // @ts-expect-error TS2322 */}
                <ResourceTitleCell
                    row={{
                        resourceUri: 'uid:/qsdf',
                        resource: null,
                    }}
                />
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_resource_not_found'),
        ).toBeInTheDocument();
    });

    it('should render the resource title', () => {
        const wrapper = render(
            <TestI18N>
                {/*
                 // @ts-expect-error TS2322 */}
                <ResourceTitleCell
                    row={{
                        resourceUri: 'uid:/qsdf',
                        resource: {
                            title: 'The resource title',
                            // @ts-expect-error TS2353
                            uri: 'uid:/qsdf',
                        },
                    }}
                />
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_resource_not_found'),
        ).not.toBeInTheDocument();

        expect(wrapper.queryByText('The resource title')).toBeInTheDocument();
    });
});
