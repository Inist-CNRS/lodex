import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import { CreateResourceFormComponent } from './CreateResourceForm';
import FieldInput from '../../fields/editFieldValue/FieldInput';
import UriFieldInput from '../../lib/components/UriFieldInput';
import Alert from '../../lib/components/Alert';

describe('<Resource />', () => {
    it('should display a FieldInput for each fields except uri', () => {
        const props = {
            fields: ['uri', 'field1', 'field2'].map(name => ({ name })),
            error: null,
            handleSubmit: () => null,
            p: { t: v => v },
        };

        const wrapper = shallow(<CreateResourceFormComponent {...props} />);
        const fieldInputs = wrapper.find(FieldInput);
        expect(fieldInputs.length).toBe(2);
        expect(fieldInputs.at(0).props()).toEqual({
            key: 'field1',
            field: { name: 'field1' },
        });
        expect(fieldInputs.at(1).props()).toEqual({
            key: 'field2',
            field: { name: 'field2' },
        });
    });

    it('should display UriFieldInput', () => {
        const props = {
            fields: ['uri', 'field1', 'field2'].map(name => ({ name })),
            error: null,
            handleSubmit: () => null,
            p: { t: v => v },
        };

        const wrapper = shallow(<CreateResourceFormComponent {...props} />);
        expect(wrapper.find(UriFieldInput).length).toBe(1);
    });

    it('should not display Alert if no error', () => {
        const props = {
            fields: ['uri', 'field1', 'field2'].map(name => ({ name })),
            error: null,
            handleSubmit: () => null,
            p: { t: v => v },
        };

        const wrapper = shallow(<CreateResourceFormComponent {...props} />);
        expect(wrapper.find(Alert).length).toBe(0);
    });

    it('should display Alert if error', () => {
        const props = {
            fields: ['uri', 'field1', 'field2'].map(name => ({ name })),
            error: 'error',
            handleSubmit: () => null,
            p: { t: v => v },
        };

        const wrapper = shallow(<CreateResourceFormComponent {...props} />);
        const alert = wrapper.find(Alert);
        expect(alert.length).toBe(1);
        expect(alert.find('p').text()).toBe('error');
    });
});
