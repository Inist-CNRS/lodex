import React from 'react';
import { render } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { ResourceCell } from './ResourceCell';
import '@testing-library/jest-dom';

describe('ResourceCell', () => {
    it('should render annotation.resource_not_found message when resource is null', () => {
        const wrapper = render(
            <TestI18N>
                <ResourceCell />
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_resource_not_found'),
        ).toBeInTheDocument();
    });

    it('should render the resource title', () => {
        const wrapper = render(
            <TestI18N>
                <ResourceCell
                    resource={{
                        title: 'The resource title',
                        uri: 'uid:/qsdf',
                    }}
                />
            </TestI18N>,
        );

        expect(
            wrapper.queryByText('annotation_resource_not_found'),
        ).not.toBeInTheDocument();

        expect(wrapper.queryByText('The resource title')).toBeInTheDocument();
    });

    it('should render a link toward the resource using the uri', () => {
        const wrapper = render(
            <TestI18N>
                <ResourceCell
                    resource={{
                        title: 'The resource title',
                        uri: 'uid:/qsdf',
                    }}
                />
            </TestI18N>,
        );

        expect(
            wrapper.queryByTitle('annotation_resource_link'),
        ).toBeInTheDocument();

        expect(
            wrapper.queryByTitle('annotation_resource_link'),
        ).toHaveAttribute('href', '/instance/default/uid:/qsdf');
    });
});
