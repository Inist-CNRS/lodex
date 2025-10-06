import React from 'react';
// @ts-expect-error TS7016
import { shallow } from 'enzyme';

import { CompositePropertyComponent as CompositeProperty } from './CompositeProperty';
import Property from './';

describe('CompositeProperty', () => {
    it('should render all linked properties', () => {
        const props = {
            field: {
                name: 'fieldname',
                label: 'Field1',
                composedOf: {
                    separator: 'separator',
                },
            },
            compositeFields: ['field1', 'field2'],
            fields: 'fields',
            resource: 'resource',
        };
        // @ts-expect-error TS2741
        const compositeProperty = shallow(<CompositeProperty {...props} />);
        const property = compositeProperty.find(Property);
        expect(property).toHaveLength(2);
        expect(property.at(0).props().field).toBe('field1');
        expect(property.at(1).props().field).toBe('field2');
    });
});
