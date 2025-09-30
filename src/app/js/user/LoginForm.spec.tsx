import React from 'react';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import Alert from '../lib/components/Alert';
import { LoginFormComponent } from './LoginForm';

describe('<LoginForm />', () => {
    it('should render', () => {
        const wrapper = shallow(
            <LoginFormComponent p={{ t: () => {} }} handleSubmit={() => {}} />,
        );
        expect(wrapper).toHaveLength(1);
    });

    it('should render error', () => {
        const wrapper = shallow(
            <LoginFormComponent
                p={{ t: (l) => l }}
                error="Foo"
                handleSubmit={() => {}}
            />,
        );
        const alerts = wrapper.find(Alert);
        expect(alerts).toHaveLength(1);
        expect(alerts.children().html()).toBe('<p>Foo</p>');
    });

    it('should render a Field for username', () => {
        const wrapper = shallow(
            <LoginFormComponent p={{ t: () => {} }} handleSubmit={() => {}} />,
        );
        const textField = wrapper.find(Field).at(0);
        expect(textField).toHaveLength(1);
        expect(textField.prop('name')).toBe('username');
    });

    it('should render a Field for password', () => {
        const wrapper = shallow(
            <LoginFormComponent p={{ t: () => {} }} handleSubmit={() => {}} />,
        );
        const textField = wrapper.find(Field).at(1);
        expect(textField).toHaveLength(1);
        expect(textField.prop('name')).toBe('password');
    });
});
