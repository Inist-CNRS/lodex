import React from 'react';
import { shallow } from 'enzyme';
import { ListSubheader } from '@material-ui/core';

import FieldInput from './FieldInput';
import { CompositeFieldInputComponent as CompositeFieldInput } from './CompositeFieldInput';

describe('CompositeEditDetailsField', () => {
    it('should render EditDetailsField for each compositeFields', () => {
        const props = {
            label: 'Field',
            compositeFields: ['field1', 'field2'],
        };
        const wrapper = shallow(<CompositeFieldInput {...props} />);
        const editField = wrapper.find(FieldInput);
        expect(editField.length).toBe(2);
        expect(editField.at(0).props()).toEqual({ field: 'field1' });
        expect(editField.at(1).props()).toEqual({ field: 'field2' });
    });

    it('should render ListSubheader with label', () => {
        const props = {
            label: 'Field',
            compositeFields: ['field1', 'field2'],
        };
        const wrapper = shallow(<CompositeFieldInput {...props} />);
        const subheader = wrapper.find(ListSubheader);
        expect(subheader.length).toBe(1);
        expect(
            subheader
                .at(0)
                .children()
                .text(),
        ).toBe('Field');
    });
});
