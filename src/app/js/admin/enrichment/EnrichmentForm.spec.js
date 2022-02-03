import React from 'react';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import { EnrichmentFormComponent } from './EnrichmentForm';

describe('<EnrichmentFormComponent />', () => {
    it('should render', () => {
        const wrapper = shallow(
            <EnrichmentFormComponent p={{ t: () => {} }} excerptColumns={[]} />,
        );
        expect(wrapper).toHaveLength(1);
    });

    it('should render a Field for name enricment', () => {
        const wrapper = shallow(
            <EnrichmentFormComponent p={{ t: () => {} }} excerptColumns={[]} />,
        );
        const textField = wrapper.find(Field).at(0);
        expect(textField).toHaveLength(1);
        expect(textField.prop('name')).toEqual('name');
    });

    it('should render 3 Fields for enrichment rule with simplified mode', () => {
        const wrapper = shallow(
            <EnrichmentFormComponent p={{ t: () => {} }} excerptColumns={[]} />,
        );
        const webServiceUrl = wrapper.find(Field).at(1);
        expect(webServiceUrl).toHaveLength(1);
        expect(webServiceUrl.prop('name')).toEqual('webServiceUrl');

        const sourceColumn = wrapper.find(Field).at(2);
        expect(sourceColumn).toHaveLength(1);
        expect(sourceColumn.prop('name')).toEqual('sourceColumn');

        const subPath = wrapper.find(Field).at(3);
        expect(subPath).toHaveLength(1);
        expect(subPath.prop('name')).toEqual('subPath');
    });

    it('should render 1 Field for enrichment rule with advanced mode', () => {
        const initialValues = {
            advancedMode: true,
        };
        const wrapper = shallow(
            <EnrichmentFormComponent
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
            />,
        );
        const rule = wrapper.find(Field).at(1);
        expect(rule).toHaveLength(1);
        expect(rule.prop('name')).toEqual('rule');
    });

    it('should render a sidebar component component', () => {
        const initialValues = {
            advancedMode: false,
            _id: '123',
            status: 'IN_PROGRESS',
        };
        const wrapper = shallow(
            <EnrichmentFormComponent
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
                isEdit={true}
            />,
        );
        expect(
            wrapper.find('Translated(EnrichmentSidebarComponent)'),
        ).toHaveLength(1);
    });
});
