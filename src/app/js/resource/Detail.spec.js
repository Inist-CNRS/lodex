import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import { DetailComponent } from './Detail';
import Property from '../lib/Property';

describe('DetailComponent', () => {
    it('should render one Property per fields', () => {
        const props = {
            fields: [
                { name: 'field1', scheme: 'scheme1' },
                { name: 'field2', scheme: 'scheme2' },
            ],
            resource: {
                field1: 'value1',
                field2: 'value2',
            },
        };

        const wrapper = shallow(<DetailComponent {...props} />);
        const properties = wrapper.find(Property);
        expect(properties.length).toBe(2);
        properties.map((element, index) =>
            expect(element.props()).toEqual({
                name: `field${index + 1}`,
                value: `value${index + 1}`,
                scheme: `scheme${index + 1}`,
            }),
        );
    });
});
