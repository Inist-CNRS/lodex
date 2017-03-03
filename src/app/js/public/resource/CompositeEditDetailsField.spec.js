import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import Subheader from 'material-ui/Subheader';

import EditDetailsField from './EditDetailsField';
import { CompositeEditDetailsFieldComponent as CompositeEditDetailsField } from './CompositeEditDetailsField';

describe('CompositeEditDetailsField', () => {
    it('should render EditDetailsField for each compositeFields', () => {
        const props = {
            label: 'Field',
            compositeFields: ['field1', 'field2'],
        };
        const wrapper = shallow(<CompositeEditDetailsField {...props} />);
        const editField = wrapper.find(EditDetailsField);
        expect(editField.length).toBe(2);
        expect(editField.at(0).props()).toEqual({ field: 'field1' });
        expect(editField.at(1).props()).toEqual({ field: 'field2' });
    });

    it('should render Subheader with label', () => {
        const props = {
            label: 'Field',
            compositeFields: ['field1', 'field2'],
        };
        const wrapper = shallow(<CompositeEditDetailsField {...props} />);
        const subheader = wrapper.find(Subheader);
        expect(subheader.length).toBe(1);
        expect(subheader.at(0).children().text()).toBe('Field');
    });
});
