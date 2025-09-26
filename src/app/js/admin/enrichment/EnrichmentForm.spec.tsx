import React from 'react';
import { shallow } from 'enzyme';
// @ts-expect-error TS7016
import { Field } from 'redux-form';
import { EnrichmentForm } from './EnrichmentForm';

const EXCERPT_LINES = [{ columnOne: 'TEST' }];

describe('<EnrichmentFormComponent />', () => {
    it('should render', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <EnrichmentForm
                // @ts-expect-error TS2322
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        expect(wrapper).toHaveLength(1);
    });

    it('should render a Field for name enrichment', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <EnrichmentForm
                // @ts-expect-error TS2322
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        const textField = wrapper.find(Field).at(0);
        expect(textField).toHaveLength(1);
        expect(textField.prop('name')).toBe('name');
    });

    it('should render 3 Fields for enrichment rule with simplified mode', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <EnrichmentForm
                // @ts-expect-error TS2322
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        const webServiceUrl = wrapper.find(Field).at(2);
        expect(webServiceUrl).toHaveLength(1);
        expect(webServiceUrl.prop('name')).toBe('webServiceUrl');

        const sourceColumn = wrapper.find(Field).at(3);
        expect(sourceColumn).toHaveLength(1);
        expect(sourceColumn.prop('name')).toBe('sourceColumn');

        const subPath = wrapper.find(Field).at(4);
        expect(subPath).toHaveLength(1);
        expect(subPath.prop('name')).toBe('subPath');
    });

    it('should render 1 Field for enrichment rule with advanced mode', () => {
        const initialValues = {
            advancedMode: true,
            _id: '123',
        };
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <EnrichmentForm
                // @ts-expect-error TS2322
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
                excerptLines={EXCERPT_LINES}
                formValues={initialValues}
            />,
        );
        const rule = wrapper.find(Field).at(2);
        expect(rule).toHaveLength(1);
        expect(rule.prop('name')).toBe('rule');
    });

    it('should render a  enrichment logs dialog', () => {
        const initialValues = {
            advancedMode: false,
            _id: '123',
            status: 'IN_PROGRESS',
        };
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <EnrichmentForm
                // @ts-expect-error TS2322
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
                isEdit={true}
                excerptLines={EXCERPT_LINES}
            />,
        );
        expect(wrapper.find('EnrichmentLogsDialog')).toHaveLength(1);
    });
});
