import React from 'react';
import { shallow } from 'enzyme';
import { lightGreen, red } from '@material-ui/core/colors';
import { CircularProgress, Button } from '@material-ui/core';
import Warning from '@material-ui/icons/Warning';
import Success from '@material-ui/icons/Done';

import ButtonWithStatus from './ButtonWithStatus';

describe('<ButtonWithStatus />', () => {
    describe('<ButtonWithStatus raised={false} />', () => {
        it('should render a Button without icon by default', () => {
            const wrapper = shallow(<ButtonWithStatus>Foo</ButtonWithStatus>);
            const button = wrapper.find(Button);

            expect(button.prop('disabled')).toEqual(false);
            expect(button.prop('icon')).toBeNull();

            expect(button.prop('label')).toEqual('Foo');
        });

        it('should render a Button with a CircularProgress icon when loading', () => {
            const wrapper = shallow(
                <ButtonWithStatus loading>Foo</ButtonWithStatus>,
            );
            const button = wrapper.find(Button);

            expect(button.prop('disabled')).toEqual(true);
            expect(button.prop('icon')).toEqual(
                <CircularProgress variant="indeterminate" size={20} />,
            );
        });

        it('should render a Button with a Warning icon when it has error', () => {
            const wrapper = shallow(
                <ButtonWithStatus error>Foo</ButtonWithStatus>,
            );
            const button = wrapper.find(Button);

            expect(button.prop('icon')).toEqual(<Warning color={red[400]} />);
        });

        it('should render a Button with a Success icon when it has success', () => {
            const wrapper = shallow(
                <ButtonWithStatus success>Foo</ButtonWithStatus>,
            );
            const button = wrapper.find(Button);

            expect(button.prop('icon')).toEqual(
                <Success color={lightGreen.A400} />,
            );
        });
    });
    describe('<ButtonWithStatus raised={true} />', () => {
        it('should render a Button without icon by default', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised>Foo</ButtonWithStatus>,
            );
            const button = wrapper.find(Button);

            expect(button.prop('disabled')).toEqual(false);
            expect(button.prop('icon')).toBeNull();
            expect(button.prop('label')).toEqual('Foo');
        });

        it('should render a Button with a CircularProgress icon when loading', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised loading>
                    Foo
                </ButtonWithStatus>,
            );
            const button = wrapper.find(Button);

            expect(button.prop('disabled')).toEqual(true);
            expect(button.prop('icon')).toEqual(
                <CircularProgress variant="indeterminate" size={20} />,
            );
        });

        it('should render a Button with a Warning icon when it has error', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised error>
                    Foo
                </ButtonWithStatus>,
            );
            const button = wrapper.find(Button);

            expect(button.prop('icon')).toEqual(<Warning color={red[400]} />);
        });

        it('should render a Button with a Success icon when it has success', () => {
            const wrapper = shallow(<ButtonWithStatus raised success />);
            const button = wrapper.find(Button);

            expect(button.prop('icon')).toEqual(
                <Success color={lightGreen.A400} />,
            );
        });
    });
});
