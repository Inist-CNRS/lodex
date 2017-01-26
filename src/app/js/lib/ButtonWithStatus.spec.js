import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { lightGreenA400, red400 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Warning from 'material-ui/svg-icons/alert/warning';
import Success from 'material-ui/svg-icons/action/done';

import ButtonWithStatus from './ButtonWithStatus';

describe('<ButtonWithStatus />', () => {
    it('should render a FlatButton without icon by default', () => {
        const wrapper = shallow(<ButtonWithStatus label="Foo" />);
        const button = wrapper.find(FlatButton);

        expect(button.prop('disabled')).toEqual(false);
        expect(button.prop('icon')).toEqual(null);
        expect(button.prop('labelPosition')).toEqual('before');
        expect(button.prop('label')).toEqual('Foo');
    });

    it('should render a FlatButton with a CircularProgress icon when loading', () => {
        const wrapper = shallow(<ButtonWithStatus label="Foo" loading />);
        const button = wrapper.find(FlatButton);

        expect(button.prop('disabled')).toEqual(true);
        expect(button.prop('icon')).toEqual(<CircularProgress size={20} />);
    });

    it('should render a FlatButton with a Warning icon when it has error', () => {
        const wrapper = shallow(<ButtonWithStatus label="Foo" error />);
        const button = wrapper.find(FlatButton);

        expect(button.prop('icon')).toEqual(<Warning color={red400} />);
    });

    it('should render a FlatButton with a Success icon when it has success', () => {
        const wrapper = shallow(<ButtonWithStatus label="Foo" success />);
        const button = wrapper.find(FlatButton);

        expect(button.prop('icon')).toEqual(<Success color={lightGreenA400} />);
    });
});
