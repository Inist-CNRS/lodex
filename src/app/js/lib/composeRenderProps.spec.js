import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import composeRenderProps, { concat, neutral } from './composeRenderProps';

describe('composeRenderProps', () => {
    const Div = ({ children, ...props }) => <div>{children(props)}</div>;
    Div.propTypes = {
        children: PropTypes.func.isRequired,
    };
    const P = ({ children, ...props }) => <p>{children(props)}</p>;
    P.propTypes = {
        children: PropTypes.func.isRequired,
    };
    const Span = ({ name }) => <span>{name}</span>;
    Span.propTypes = {
        name: PropTypes.string.isRequired,
    };
    it('should compose renderProps', () => {
        const composedComponent = composeRenderProps([Div, P, Span])({
            name: 'nested',
        });
        const wrapper = mount(composedComponent);
        expect(wrapper.html()).toBe('<div><p><span>nested</span></p></div>');
    });

    describe('concat', () => {
        it('should be associative', () => {
            expect(mount(P({ children: Span, name: 'children' })).html()).toBe(
                '<p><span>children</span></p>',
            );

            expect(
                mount(
                    concat(Span, concat(P, Div))({ name: 'children' }),
                ).html(),
            ).toBe('<div><p><span>children</span></p></div>');

            expect(
                mount(
                    concat(concat(Span, P), Div)({ name: 'children' }),
                ).html(),
            ).toBe('<div><p><span>children</span></p></div>');
        });

        it('should have a neutral element', () => {
            expect(
                mount(concat(neutral, Span)({ name: 'children' })).html(),
            ).toBe('<span>children</span>');
            expect(
                mount(concat(Span, neutral)({ name: 'children' })).html(),
            ).toBe('<span>children</span>');
        });
    });
});
