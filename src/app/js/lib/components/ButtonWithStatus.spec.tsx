// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';
import { lightGreen, red } from '@mui/material/colors';
import { CircularProgress, Button, LinearProgress } from '@mui/material';
import Warning from '@mui/icons-material/Warning';
import Success from '@mui/icons-material/Done';

import ButtonWithStatus from './ButtonWithStatus';

describe('<ButtonWithStatus />', () => {
    describe('<ButtonWithStatus raised={false} />', () => {
        it('should render a Button without icon by default', () => {
            // @ts-expect-error TS2740
            const wrapper = shallow(<ButtonWithStatus>Foo</ButtonWithStatus>);

            const button = wrapper.find(Button).dive().props();
            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('text');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(false);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toBeNull();
            expect(button.children).toContain('Foo');
        });

        it('should render a Button with a CircularProgress icon when loading', () => {
            const wrapper = shallow(
                // @ts-expect-error TS2740
                <ButtonWithStatus loading>Foo</ButtonWithStatus>,
            );

            const button = wrapper.find(Button).dive().props();
            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('text');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(true);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toEqual(
                <CircularProgress variant="indeterminate" size={20} />,
            );
            expect(button.children).toContain('Foo');
        });

        it('should render a Button with a Warning icon when it has error', () => {
            const wrapper = shallow(
                // @ts-expect-error TS2740
                <ButtonWithStatus error>Foo</ButtonWithStatus>,
            );

            const button = wrapper.find(Button).dive().props();

            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('text');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(false);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toEqual(
                // @ts-expect-error TS2769
                <Warning color={red[400]} />,
            );
            expect(button.children).toContain('Foo');
        });

        it('should render a Button with a Success icon when it has success', () => {
            const wrapper = shallow(
                // @ts-expect-error TS2740
                <ButtonWithStatus success>Foo</ButtonWithStatus>,
            );

            const button = wrapper.find(Button).dive().props();
            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('text');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(false);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toEqual(
                // @ts-expect-error TS2769
                <Success color={lightGreen.A400} />,
            );
            expect(button.children).toContain('Foo');
        });
    });

    describe('<ButtonWithStatus raised={true} />', () => {
        it('should render a Button without icon by default', () => {
            const wrapper = shallow(
                // @ts-expect-error TS2740
                <ButtonWithStatus raised>Foo</ButtonWithStatus>,
            );
            const button = wrapper.find(Button).dive().props();
            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('contained');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(false);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toBeNull();
            expect(button.children).toContain('Foo');
        });

        it('should render a Button with a CircularProgress icon when loading', () => {
            const wrapper = shallow(
                // @ts-expect-error TS2740
                <ButtonWithStatus raised loading>
                    Foo
                </ButtonWithStatus>,
            );

            const button = wrapper.find(Button).dive().props();
            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('contained');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(true);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toEqual(
                <CircularProgress variant="indeterminate" size={20} />,
            );
            expect(button.children).toContain('Foo');
        });

        it('should render a Button with a Warning icon when it has error', () => {
            const wrapper = shallow(
                // @ts-expect-error TS2740
                <ButtonWithStatus raised error>
                    Foo
                </ButtonWithStatus>,
            );

            const button = wrapper.find(Button).dive().props();
            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('contained');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(false);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toEqual(
                // @ts-expect-error TS2769
                <Warning color={red[400]} />,
            );
            expect(button.children).toContain('Foo');
        });

        it('should render a Button with a Success icon when it has success', () => {
            // @ts-expect-error TS2740
            const wrapper = shallow(<ButtonWithStatus raised success />);

            const button = wrapper.find(Button).dive().props();
            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('contained');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(false);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toEqual(
                // @ts-expect-error TS2769
                <Success color={lightGreen.A400} />,
            );
        });

        it('should render a Button with a LinearProgress when loading with progress', () => {
            const wrapper = shallow(
                // @ts-expect-error TS2739
                <ButtonWithStatus raised loading progress={10} target={20}>
                    Foo
                </ButtonWithStatus>,
            );
            const button = wrapper.find(Button).dive().props();
            // @ts-expect-error TS2339
            expect(button.ownerState.variant).toBe('contained');
            // @ts-expect-error TS2339
            expect(button.ownerState.disabled).toBe(true);
            // @ts-expect-error TS2339
            expect(button.ownerState.startIcon).toEqual(
                <CircularProgress variant="indeterminate" size={20} />,
            );
            expect(button.children).toContain('Foo');
            const progressBar = wrapper.find(LinearProgress).dive().props();
            // @ts-expect-error TS2339
            expect(progressBar.ownerState.value).toBe(50);
            // @ts-expect-error TS2339
            expect(progressBar.ownerState.variant).toBe('determinate');
        });
    });
});
