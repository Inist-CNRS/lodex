import React from 'react';
import { shallow } from 'enzyme';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import ButtonWithStatus, { WarningIcon, SuccessIcon } from './ButtonWithStatus';

describe('<ButtonWithStatus />', () => {
    describe('<ButtonWithStatus raised={false} />', () => {
        it('should render a Button without icon by default', () => {
            const wrapper = shallow(<ButtonWithStatus label="Foo" />);
            const button = wrapper.find(Button);

            expect(button.prop('disabled')).toEqual(false);
            expect(button.prop('children')).toEqual('Foo');
        });

        it('should render a Button with a CircularProgress icon when loading', () => {
            const wrapper = shallow(<ButtonWithStatus label="Foo" loading />);
            const button = wrapper.find(Button);

            expect(button.prop('disabled')).toEqual(true);
            expect(button.prop('icon')).toEqual(<CircularProgress size={20} />);
        });

        it('should render a Button with a Warning icon when it has error', () => {
            const wrapper = shallow(<ButtonWithStatus label="Foo" error />);
            const button = wrapper.find(Button);

            expect(button.prop('icon')).toEqual(<WarningIcon />);
        });

        it('should render a Button with a Success icon when it has success', () => {
            const wrapper = shallow(<ButtonWithStatus label="Foo" success />);
            const button = wrapper.find(Button);

            expect(button.prop('icon')).toEqual(<SuccessIcon />);
        });
    });
    describe('<ButtonWithStatus raised={true} />', () => {
        it('should render a Button without icon by default', () => {
            const wrapper = shallow(<ButtonWithStatus raised label="Foo" />);
            const button = wrapper.find(Button);

            expect(button.prop('disabled')).toEqual(false);
            expect(button.prop('icon')).toEqual(null);
            expect(button.prop('children')).toEqual('Foo');
        });

        it('should render a Button with a CircularProgress icon when loading', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised label="Foo" loading />,
            );
            const button = wrapper.find(Button);

            expect(button.prop('disabled')).toEqual(true);
            expect(button.prop('icon')).toEqual(<CircularProgress size={20} />);
        });

        it('should render a Button with a Warning icon when it has error', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised label="Foo" error />,
            );
            const button = wrapper.find(Button);

            expect(button.prop('icon')).toEqual(<WarningIcon />);
        });

        it('should render a Button with a Success icon when it has success', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised label="Foo" success />,
            );
            const button = wrapper.find(Button);

            expect(button.prop('icon')).toEqual(<SuccessIcon />);
        });
    });
});
