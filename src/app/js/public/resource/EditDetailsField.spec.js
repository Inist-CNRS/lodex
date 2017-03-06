import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import { EditDetailsFieldComponent as EditDetailsField } from './EditDetailsField';
import CompositeEditDetailsField from './CompositeEditDetailsField';
import FormTextField from '../../lib/FormTextField';

describe('EditDetailsField', () => {
    it('should render CompositeEditDetailsField if field.composedOf is set', () => {
        const props = {
            field: {
                name: 'field',
                label: 'Field',
                composedOf: {},
            },
        };
        const wrapper = shallow(<EditDetailsField {...props} />);
        const compositeEditField = wrapper.find(CompositeEditDetailsField);
        expect(compositeEditField.length).toBe(1);
        expect(compositeEditField.at(0).props()).toEqual({ field: props.field, label: 'Field' });
    });

    it('should render Field if field.composedOf is not set', () => {
        const props = {
            field: {
                name: 'field',
                label: 'Field',
            },
        };
        const wrapper = shallow(<EditDetailsField {...props} />);
        const compositeEditField = wrapper.find(CompositeEditDetailsField);
        expect(compositeEditField.length).toBe(0);

        const field = wrapper.find(Field);
        expect(field.length).toBe(1);
        expect(field.at(0).props()).toEqual({
            name: 'field',
            label: 'Field',
            disabled: false,
            fullWidth: true,
            component: FormTextField,
        });
    });
});
