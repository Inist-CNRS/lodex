import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import { DetailComponent as Detail, shouldDisplayField } from './Detail';
import Property from '../Property';

describe('Detail', () => {
    describe('shouldDisplayField', () => {
        it('should display an empty field for an admin', () => {
            const field = { name: 'empty' };
            const resource = {};
            const isAdmin = true;

            expect(shouldDisplayField(resource, isAdmin)(field)).toBe(true);
        });

        it('should not display an empty field for a user', () => {
            const field = { name: 'empty' };
            const resource = {};
            const isAdmin = false;

            expect(shouldDisplayField(resource, isAdmin)(field)).toBe(false);
        });

        it('should display a filled field for an admin', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const isAdmin = true;

            expect(shouldDisplayField(resource, isAdmin)(field)).toBe(true);
        });

        it('should display a filled field for a user', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const isAdmin = false;

            expect(shouldDisplayField(resource, isAdmin)(field)).toBe(true);
        });

        it('should display a composed field for an admin', () => {
            const field = { name: 'title', composedOf: 'something' };
            const resource = {};
            const isAdmin = true;

            expect(shouldDisplayField(resource, isAdmin)(field)).toBe(true);
        });

        it('should display a composed field for a user', () => {
            const field = { name: 'title', composedOf: 'something' };
            const resource = {};
            const isAdmin = false;

            expect(shouldDisplayField(resource, isAdmin)(field)).toBe(true);
        });
    });

    it('should render one Property per fields', () => {
        const props = {
            fields: [
                { name: 'field1', scheme: 'scheme1' },
                { name: 'field2', scheme: 'scheme2' },
                { name: 'contribution1', scheme: 'scheme3' },
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

        const wrapper = shallow(<Detail {...props} />);
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
