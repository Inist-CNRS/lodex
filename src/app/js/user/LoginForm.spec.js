import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import Alert from '../lib/components/Alert';
import { LoginFormComponent } from './LoginForm';

describe('<LoginForm />', () => {
    it('should render', () => {
        const wrapper = shallow(
            <LoginFormComponent p={{ t: () => {} }} handleSubmit={() => {}} />,
        );
        expect(wrapper.length).toEqual(1);
    });

    it('should render error', () => {
        const wrapper = shallow(
            <LoginFormComponent
                p={{ t: () => {} }}
                error="Foo"
                handleSubmit={() => {}}
            />,
        );
        const alerts = wrapper.find(Alert);
        expect(alerts.length).toEqual(1);
        expect(alerts.children().html()).toEqual('<p>Foo</p>');
    });

    it('should render a Field for username', () => {
        const wrapper = shallow(
            <LoginFormComponent p={{ t: () => {} }} handleSubmit={() => {}} />,
        );
        const textField = wrapper.find(Field).at(0);
        expect(textField.length).toEqual(1);
        expect(textField.prop('name')).toEqual('username');
    });

    it('should render a Field for password', () => {
        const wrapper = shallow(
            <LoginFormComponent p={{ t: () => {} }} handleSubmit={() => {}} />,
        );
        const textField = wrapper.find(Field).at(1);
        expect(textField.length).toEqual(1);
        expect(textField.prop('name')).toEqual('password');
    });
});
