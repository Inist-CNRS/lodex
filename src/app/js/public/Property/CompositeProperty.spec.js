import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import { CompositePropertyComponent as CompositeProperty } from './CompositeProperty';
import Property from './';

describe('CompositeProperty', () => {
    it('should render all linked properties', () => {
        const props = {
            field: {
                label: 'Field1',
                composedOf: {
                    separator: 'separator',
                },
            },
            compositeFields: ['field1', 'field2'],
            fields: 'fields',
            resource: 'resource',
        };
        const compositeProperty = shallow(<CompositeProperty {...props} />);
        const property = compositeProperty.find(Property);
        expect(property.length).toBe(2);
        expect(property.at(0).props().field).toBe('field1');
        expect(property.at(1).props().field).toBe('field2');
    });
});
