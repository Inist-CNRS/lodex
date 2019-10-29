import React from 'react';
import { shallow } from 'enzyme';
import Subheader from 'material-ui/Subheader';
import { Field } from 'redux-form';

import FieldInput from './FieldInput';
import { CompositeFieldInputComponent as CompositeFieldInput } from './CompositeFieldInput';

const t = jest.fn().mockImplementation(() => 'translated');

describe('CompositeFieldInput', () => {
    it('should render inputs for all fields', () => {
        const props = {
            label: 'Field',
            p: { t },
            rootField: 'field',
            isRootFieldEditable: true,
            compositeFields: ['field1', 'field2'],
        };

        const wrapper = shallow(<CompositeFieldInput {...props} />);

        const editField = wrapper.find(Field);
        expect(editField.length).toBe(1);
        const editFieldProps = editField.at(0).props();
        expect(editFieldProps.field).toEqual('field');

        const editFieldInput = wrapper.find(FieldInput);
        expect(editFieldInput.length).toBe(2);
        const editFieldInput1Props = editFieldInput.at(0).props();
        expect(editFieldInput1Props.field).toEqual('field1');
        const editFieldInput2Props = editFieldInput.at(1).props();
        expect(editFieldInput2Props.field).toEqual('field2');
    });

    it('should not render an input for root field is it is not editable', () => {
        const props = {
            label: 'Field',
            p: { t },
            rootField: 'field',
            isRootFieldEditable: false,
            compositeFields: ['field1', 'field2'],
        };

        const wrapper = shallow(<CompositeFieldInput {...props} />);

        const editField = wrapper.find(Field);
        expect(editField.length).toBe(0);

        expect(t).toHaveBeenCalledWith('composed_of_edit_not_possible');

        const editFieldInput = wrapper.find(FieldInput);
        expect(editFieldInput.length).toBe(2);
        const editFieldInput1Props = editFieldInput.at(0).props();
        expect(editFieldInput1Props.field).toEqual('field1');
        const editFieldInput2Props = editFieldInput.at(1).props();
        expect(editFieldInput2Props.field).toEqual('field2');
    });

    it('should render Subheader with label', () => {
        const props = {
            label: 'Field',
            p: { t },
            rootField: 'field',
            isRootFieldEditable: true,
            compositeFields: ['field1', 'field2'],
        };

        const wrapper = shallow(<CompositeFieldInput {...props} />);

        const subheader = wrapper.find(Subheader);
        expect(subheader.length).toBe(1);
        expect(
            subheader
                .at(0)
                .children()
                .text(),
        ).toBe('Field');
    });
});
