import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import { DetailComponent } from './Detail';
import Property from '../Property';

describe('DetailPropertiesComponent', () => {
    it('should render one Property per fields', () => {
        const props = {
            collectionFields: [
                { name: 'field1', scheme: 'scheme1' },
                { name: 'field2', scheme: 'scheme2' },
            ],
            documentFields: [
                { name: 'contribution1', scheme: 'scheme3' },
                { name: 'contribution2', scheme: 'scheme4' },
            ],
            resource: {
                field1: 'value1',
                field2: 'value2',
                contribution1: 'value3',
            },
            p: {
                t: v => v,
            },
        };

        const wrapper = shallow(<DetailComponent {...props} />);
        const properties = wrapper.find(Property);
        expect(properties.length).toBe(3);
        properties.forEach((element, index) => {
            if (index === 2) {
                expect(element.prop('field')).toEqual({
                    name: 'contribution1',
                    scheme: 'scheme3',
                });

                expect(element.prop('resource')).toEqual({
                    field1: 'value1',
                    field2: 'value2',
                    contribution1: 'value3',
                });
                return;
            }

            expect(element.prop('field')).toEqual({
                name: `field${index + 1}`,
                scheme: `scheme${index + 1}`,
            });

            expect(element.prop('resource')).toEqual({
                field1: 'value1',
                field2: 'value2',
                contribution1: 'value3',
            });
        });
    });
});
