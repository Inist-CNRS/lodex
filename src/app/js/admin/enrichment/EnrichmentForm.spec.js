import React from 'react';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';
import { EnrichmentForm } from './EnrichmentForm';

const EXCERPT_LINES = [{ columnOne: 'TEST' }];

describe('<EnrichmentFormComponent />', () => {
    it('should render', () => {
        const wrapper = shallow(
            <EnrichmentForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        expect(wrapper).toHaveLength(1);
    });

    it('should render a Field for name enricment', () => {
        const wrapper = shallow(
            <EnrichmentForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        const textField = wrapper.find(Field).at(0);
        expect(textField).toHaveLength(1);
        expect(textField.prop('name')).toEqual('name');
    });

    it('should render 3 Fields for enrichment rule with simplified mode', () => {
        const wrapper = shallow(
            <EnrichmentForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        const webServiceUrl = wrapper.find(Field).at(2);
        expect(webServiceUrl).toHaveLength(1);
        expect(webServiceUrl.prop('name')).toEqual('webServiceUrl');

        const sourceColumn = wrapper.find(Field).at(3);
        expect(sourceColumn).toHaveLength(1);
        expect(sourceColumn.prop('name')).toEqual('sourceColumn');

        const subPath = wrapper.find(Field).at(4);
        expect(subPath).toHaveLength(1);
        expect(subPath.prop('name')).toEqual('subPath');
    });

    it('should render 1 Field for enrichment rule with advanced mode', () => {
        const initialValues = {
            advancedMode: true,
            _id: '123',
        };
        const wrapper = shallow(
            <EnrichmentForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
                excerptLines={EXCERPT_LINES}
                formValues={initialValues}
            />,
        );
        const rule = wrapper.find(Field).at(2);
        expect(rule).toHaveLength(1);
        expect(rule.prop('name')).toEqual('rule');
    });

    it('should render a  enrichment logs dialog', () => {
        const initialValues = {
            advancedMode: false,
            _id: '123',
            status: 'IN_PROGRESS',
        };
        const wrapper = shallow(
            <EnrichmentForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
                isEdit={true}
                excerptLines={EXCERPT_LINES}
            />,
        );
        expect(wrapper.find('Translated(EnrichmentLogsDialog)')).toHaveLength(
            1,
        );
    });
});
