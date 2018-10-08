import React from 'react';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import { FieldInputComponent as FieldInput } from './FieldInput';
import CompositeFieldInput from './CompositeFieldInput';
import DefaultEdition from '../../formats/DefaultFormat/DefaultEdition';

describe('EditFieldInput', () => {
    it('should render CompositeEditDetailsField if field.composedOf is set', () => {
        const props = {
            field: {
                name: 'field',
                label: 'Field',
                composedOf: {},
            },
        };
        const wrapper = shallow(<FieldInput {...props} />);
        const compositeEditField = wrapper.find(CompositeFieldInput);
        expect(compositeEditField.length).toBe(1);
        expect(compositeEditField.at(0).props()).toEqual({
            field: props.field,
            label: 'Field',
        });
    });

    it('should render Field if field.composedOf is not set', () => {
        const props = {
            field: {
                name: 'field',
                label: 'Field',
            },
        };
        const wrapper = shallow(<FieldInput {...props} />);
        const compositeEditField = wrapper.find(CompositeFieldInput);
        expect(compositeEditField.length).toBe(0);

        const field = wrapper.find(Field);
        expect(field.length).toBe(1);
        expect(field.at(0).props()).toEqual({
            name: 'field',
            label: 'Field',
            disabled: false,
            fullWidth: true,
            component: DefaultEdition,
        });
    });
});
