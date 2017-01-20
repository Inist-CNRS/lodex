import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import Alert from '../lib/Alert';
import { LoginForm } from './LoginForm';

describe('<LoginForm />', () => {
    it('should render', () => {
        const wrapper = shallow(<LoginForm handleSubmit={() => {}}/>);
        expect(wrapper.length).toEqual(1);
    });

    it('should render error', () => {
        const wrapper = shallow(<LoginForm error="Foo" handleSubmit={() => {}}/>);
        const alerts = wrapper.find(Alert);
        expect(alerts.length).toEqual(1);
        expect(alerts.children().html()).toEqual('<p>Foo</p>');
    });

    it('should render a Field for username', () => {
        const wrapper = shallow(<LoginForm handleSubmit={() => {}}/>);
        const textField = wrapper.find(Field).at(0);
        expect(textField.length).toEqual(1);
        expect(textField.prop('name')).toEqual('username');
    });

    it('should render a Field for password', () => {
        const wrapper = shallow(<LoginForm handleSubmit={() => {}}/>);
        const textField = wrapper.find(Field).at(1);
        expect(textField.length).toEqual(1);
        expect(textField.prop('name')).toEqual('password');
    });
});
