import React from 'react';
import { shallow } from 'enzyme';

import { DatasetCharacteristicItemComponent as DatasetCharacteristicItem } from './DatasetCharacteristicItem';
import Property from '../public/Property';

describe('DatasetCharacteristicItem', () => {
    describe('with a simple field empty', () => {
        it('should render the Property for an admin', () => {
            const props = {
                isAdmin: true,
                field: { name: 'field1', scheme: 'scheme1' },
                resource: {
                    field1: '',
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
                field1: '',
                field2: 'value2',
            });
        });

        it('should not render the Property for a user', () => {
            const props = {
                isAdmin: false,
                field: { name: 'field1', scheme: 'scheme1' },
                resource: {
                    field1: '',
                    field2: 'value2',
                },
            };

            const wrapper = shallow(<DatasetCharacteristicItem {...props} />);

            const property = wrapper.find(Property);
            expect(property.length).toBe(0);
        });
    });

    describe('with a simple field filled', () => {
        it('should render the Property for an admin', () => {
            const props = {
                isAdmin: true,
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

        it('should render the Property for a user', () => {
            const props = {
                isAdmin: false,
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

    describe('with a composed field filled ', () => {
        it('should render the Property for an admin', () => {
            const props = {
                isAdmin: true,
                field: {
                    name: 'field1',
                    scheme: 'scheme1',
                    composedOf: { fields: [] },
                },
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
                composedOf: { fields: [] },
            });
            expect(propertyProps.resource).toEqual({
                field1: 'value1',
                field2: 'value2',
            });
        });

        it('should render the Property for a user', () => {
            const props = {
                isAdmin: false,
                field: {
                    name: 'field1',
                    scheme: 'scheme1',
                    composedOf: { fields: [] },
                },
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
                composedOf: { fields: [] },
            });
            expect(propertyProps.resource).toEqual({
                field1: 'value1',
                field2: 'value2',
            });
        });
    });

    describe('with a composed field empty but child fields filled ', () => {
        it('should render the Property for an admin', () => {
            const props = {
                isAdmin: true,
                field: {
                    name: 'field1',
                    scheme: 'scheme1',
                    composedOf: { fields: ['fieldChild1', 'fieldChild2'] },
                },
                resource: {
                    field1: '',
                    field2: 'value2',
                    fieldChild1: 'value3',
                    fieldChild2: 'value4',
                },
            };

            const wrapper = shallow(<DatasetCharacteristicItem {...props} />);

            const property = wrapper.find(Property);
            expect(property.length).toBe(1);
            const propertyProps = property.at(0).props();
            expect(propertyProps.field).toEqual({
                name: 'field1',
                scheme: 'scheme1',
                composedOf: { fields: ['fieldChild1', 'fieldChild2'] },
            });
            expect(propertyProps.resource).toEqual({
                field1: '',
                field2: 'value2',
                fieldChild1: 'value3',
                fieldChild2: 'value4',
            });
        });

        it('should render the Property for a user', () => {
            const props = {
                isAdmin: false,
                field: {
                    name: 'field1',
                    scheme: 'scheme1',
                    composedOf: { fields: ['fieldChild1', 'fieldChild2'] },
                },
                resource: {
                    field1: '',
                    field2: 'value2',
                    fieldChild1: 'value3',
                    fieldChild2: 'value4',
                },
            };

            const wrapper = shallow(<DatasetCharacteristicItem {...props} />);

            const property = wrapper.find(Property);
            expect(property.length).toBe(1);
            const propertyProps = property.at(0).props();
            expect(propertyProps.field).toEqual({
                name: 'field1',
                scheme: 'scheme1',
                composedOf: {
                    fields: ['fieldChild1', 'fieldChild2'],
                },
            });
            expect(propertyProps.resource).toEqual({
                field1: '',
                field2: 'value2',
                fieldChild1: 'value3',
                fieldChild2: 'value4',
            });
        });
    });

    describe('with a composed field empty and child fields empty ', () => {
        it('should render the Property for an admin', () => {
            const props = {
                isAdmin: true,
                field: {
                    name: 'field1',
                    scheme: 'scheme1',
                    composedOf: { fields: [] },
                },
                resource: {
                    field1: '',
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
                composedOf: { fields: [] },
            });
            expect(propertyProps.resource).toEqual({
                field1: '',
                field2: 'value2',
            });
        });

        it('should not render the Property for a user', () => {
            const props = {
                isAdmin: false,
                field: {
                    name: 'field1',
                    scheme: 'scheme1',
                    composedOf: { fields: [] },
                },
                resource: {
                    field1: '',
                    field2: 'value2',
                },
            };

            const wrapper = shallow(<DatasetCharacteristicItem {...props} />);

            const property = wrapper.find(Property);
            expect(property.length).toBe(0);
        });
    });
});
