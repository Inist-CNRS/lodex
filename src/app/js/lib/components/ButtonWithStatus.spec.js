import React from 'react';
import { shallow } from 'enzyme';
import { lightGreenA400, red400 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Warning, Done as Success } from '@material-ui/icons';

import ButtonWithStatus from './ButtonWithStatus';

describe('<ButtonWithStatus />', () => {
    describe('<ButtonWithStatus raised={false} />', () => {
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

            expect(button.prop('icon')).toEqual(
                <Success color={lightGreenA400} />,
            );
        });
    });
    describe('<ButtonWithStatus raised={true} />', () => {
        it('should render a RaisedButton without icon by default', () => {
            const wrapper = shallow(<ButtonWithStatus raised label="Foo" />);
            const button = wrapper.find(RaisedButton);

            expect(button.prop('disabled')).toEqual(false);
            expect(button.prop('icon')).toEqual(null);
            expect(button.prop('labelPosition')).toEqual('before');
            expect(button.prop('label')).toEqual('Foo');
        });

        it('should render a RaisedButton with a CircularProgress icon when loading', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised label="Foo" loading />,
            );
            const button = wrapper.find(RaisedButton);

            expect(button.prop('disabled')).toEqual(true);
            expect(button.prop('icon')).toEqual(<CircularProgress size={20} />);
        });

        it('should render a RaisedButton with a Warning icon when it has error', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised label="Foo" error />,
            );
            const button = wrapper.find(RaisedButton);

            expect(button.prop('icon')).toEqual(<Warning color={red400} />);
        });

        it('should render a RaisedButton with a Success icon when it has success', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised label="Foo" success />,
            );
            const button = wrapper.find(RaisedButton);

            expect(button.prop('icon')).toEqual(
                <Success color={lightGreenA400} />,
            );
        });
    });
});
