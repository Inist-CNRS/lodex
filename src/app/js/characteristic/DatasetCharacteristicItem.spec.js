import React from 'react';
import { shallow } from 'enzyme';

import { DatasetCharacteristicItemComponent as DatasetCharacteristicItem } from './DatasetCharacteristicItem';
import Property from '../public/Property';

import { useInView } from 'react-intersection-observer';
jest.mock('react-intersection-observer');

describe('DatasetCharacteristicItem', () => {
    it('should not render a Property when it is not visible', () => {
        useInView.mockImplementation(() => [null, false]);

        const props = {
            field: { name: 'field1', scheme: 'scheme1' },
            resource: {
                field1: 'value1',
                field2: 'value2',
            },
        };

        const wrapper = shallow(<DatasetCharacteristicItem {...props} />);

        const property = wrapper.find(Property);
        expect(property).toHaveLength(0);
    });

    it('should render a Property when it is visible', () => {
        useInView.mockImplementation(() => [null, true]);

        const props = {
            field: { name: 'field1', scheme: 'scheme1' },
            resource: {
                field1: 'value1',
                field2: 'value2',
            },
        };

        const wrapper = shallow(<DatasetCharacteristicItem {...props} />);

        const property = wrapper.find(Property);
        expect(property).toHaveLength(1);
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
