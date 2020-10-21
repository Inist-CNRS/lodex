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

            expect(wrapper.props()).toEqual({
                variant: 'text',
                disabled: false,
                startIcon: null,
                children: 'Foo',
            });
        });

        it('should render a Button with a CircularProgress icon when loading', () => {
            const wrapper = shallow(
                <ButtonWithStatus loading>Foo</ButtonWithStatus>,
            );

            expect(wrapper.props()).toEqual({
                variant: 'text',
                disabled: true,
                startIcon: (
                    <CircularProgress variant="indeterminate" size={20} />
                ),
                children: 'Foo',
            });
        });

        it('should render a Button with a Warning icon when it has error', () => {
            const wrapper = shallow(
                <ButtonWithStatus error>Foo</ButtonWithStatus>,
            );

            expect(wrapper.props()).toEqual({
                variant: 'text',
                disabled: false,
                startIcon: <Warning color={red[400]} />,
                children: 'Foo',
            });
        });

        it('should render a Button with a Success icon when it has success', () => {
            const wrapper = shallow(
                <ButtonWithStatus success>Foo</ButtonWithStatus>,
            );

            expect(wrapper.props()).toEqual({
                variant: 'text',
                disabled: false,
                startIcon: <Success color={lightGreen.A400} />,
                children: 'Foo',
            });
        });
    });

    describe('<ButtonWithStatus raised={true} />', () => {
        it('should render a Button without icon by default', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised>Foo</ButtonWithStatus>,
            );

            expect(wrapper.props()).toEqual({
                variant: 'contained',
                disabled: false,
                startIcon: null,
                children: 'Foo',
            });
        });

        it('should render a Button with a CircularProgress icon when loading', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised loading>
                    Foo
                </ButtonWithStatus>,
            );

            expect(wrapper.props()).toEqual({
                variant: 'contained',
                disabled: true,
                startIcon: (
                    <CircularProgress variant="indeterminate" size={20} />
                ),
                children: 'Foo',
            });
        });

        it('should render a Button with a Warning icon when it has error', () => {
            const wrapper = shallow(
                <ButtonWithStatus raised error>
                    Foo
                </ButtonWithStatus>,
            );

            expect(wrapper.props()).toEqual({
                variant: 'contained',
                disabled: false,
                startIcon: <Warning color={red[400]} />,
                children: 'Foo',
            });
        });

        it('should render a Button with a Success icon when it has success', () => {
            const wrapper = shallow(<ButtonWithStatus raised success />);

            expect(wrapper.props()).toEqual({
                variant: 'contained',
                disabled: false,
                startIcon: <Success color={lightGreen.A400} />,
            });
        });
    });
});
