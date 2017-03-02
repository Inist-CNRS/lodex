import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import { CompositePropertyComponent as CompositeProperty } from './CompositeProperty';
import Property from './Property';
import Format from './Format';

describe('CompositeProperty', () => {
    it('should render all compositeField separated by separator', () => {
        const props = {
            field: {
                composedOf: {
                    separator: 'separator',
                },
            },
            compositeFields: [
                'field1', 'field2',
            ],
            fields: 'fields',
            resource: 'resource',
        };
        const compositeProperty = shallow(<CompositeProperty {...props} />);
        const format = compositeProperty.find(Format);
        expect(format.length).toBe(2);
        expect(format.at(0).props().field).toBe('field1');
        expect(format.at(1).props().field).toBe('field2');
    });

    it('should render allow to dispaly sub properties', () => {
        const props = {
            field: {
                composedOf: {
                    separator: 'separator',
                },
            },
            compositeFields: ['field1', 'field2'],
            fields: 'fields',
            resource: 'resource',
        };
        const compositeProperty = shallow(<CompositeProperty {...props} />);
        expect(compositeProperty.find(Property).length).toBe(0);
        compositeProperty
            .find('.toggle-fields')
            .simulate('click');
        const property = compositeProperty.find(Property);
        expect(property.length).toBe(2);
        expect(property.at(0).props().field).toBe('field1');
        expect(property.at(1).props().field).toBe('field2');
    });
});
