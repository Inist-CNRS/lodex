import React from 'react';
import { shallow } from 'enzyme';

import { DatasetCharacteristicItemComponent as DatasetCharacteristicItem } from './DatasetCharacteristicItem';
import Property from '../public/Property';

describe('DatasetCharacteristicItem', () => {
    it('should render a Property', () => {
        const props = {
            field: { name: 'field1', scheme: 'scheme1' },
            resource: {
                field1: 'value1',
                field2: 'value2',
            },
        };

        const wrapper = shallow(<DatasetCharacteristicItem {...props} />);

        const property = wrapper.find(Property);
        expect(property.length).toBe(1);
        const propertyProps = property.at(0).props();
        expect(propertyProps.field).toEqual({
            name: 'field1',
            scheme: 'scheme1',
        });
        expect(propertyProps.resource).toEqual({
            field1: 'value1',
            field2: 'value2',
        });
    });
});
