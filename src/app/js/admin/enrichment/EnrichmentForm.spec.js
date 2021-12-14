import React from 'react';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import { EnrichmentFormComponent } from './EnrichmentForm';
import { Button } from '@material-ui/core';

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
        const webServiceUrl = wrapper.find(Field).at(1);
        expect(webServiceUrl).toHaveLength(1);
        expect(webServiceUrl.prop('name')).toEqual('rule');
    });

    it('should render delete button if editing', () => {
        const initialValues = {
            advancedMode: false,
            _id: '123',
        };
        const wrapper = shallow(
            <EnrichmentFormComponent
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
                isEdit={true}
            />,
        );
        const deleteButton = wrapper.find(Button).at(0);
        expect(deleteButton).toHaveLength(1);
        expect(deleteButton.key()).toEqual('delete');
    });

    it('should render a run button if enrichment exists and had PENDING or FINISHED status', () => {
        const initialValues = {
            advancedMode: false,
            _id: '123',
            status: 'PENDING',
        };
        const wrapper = shallow(
            <EnrichmentFormComponent
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
                isEdit={true}
            />,
        );
        const runButton = wrapper.find(Button).at(0);
        expect(runButton).toHaveLength(1);
        expect(runButton.key()).toEqual('run');
    });

    it('should render a run button disabled if enrichment exists and had IN_PROGRESS status', () => {
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
        const runButton = wrapper.find(Button).at(0);
        expect(runButton).toHaveLength(1);
        expect(runButton.key()).toEqual('run');
        expect(runButton.prop('disabled')).toBe(true);
    });
});
