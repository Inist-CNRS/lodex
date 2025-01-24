import React from 'react';
import { render } from '@testing-library/react';
import PropTypes from 'prop-types';

import composeRenderProps, { concat, neutral } from './composeRenderProps';

describe('composeRenderProps', () => {
    const Div = ({ children, ...props }) => <div>Div({children(props)})</div>;
    Div.propTypes = {
        children: PropTypes.func.isRequired,
    };
    const P = ({ children, ...props }) => <p>P({children(props)})</p>;
    P.propTypes = {
        children: PropTypes.func.isRequired,
    };
    const Span = ({ name }) => <span>Span({name})</span>;
    Span.propTypes = {
        name: PropTypes.string.isRequired,
    };
    it('should compose renderProps', () => {
        const composedComponent = composeRenderProps([Div, P, Span])({
            name: 'nested',
        });
        const wrapper = render(composedComponent);
        expect(wrapper.container.textContent).toBe('Div(P(Span(nested)))');
    });

    describe('concat', () => {
        it('should be associative', () => {
            expect(
                render(P({ children: Span, name: 'children' })).container
                    .textContent,
            ).toBe('P(Span(children))');

            expect(
                render(concat(Span, concat(P, Div))({ name: 'children' }))
                    .container.textContent,
            ).toBe('Div(P(Span(children)))');

            expect(
                render(concat(concat(Span, P), Div)({ name: 'children' }))
                    .container.textContent,
            ).toBe('Div(P(Span(children)))');
        });

        it('should have a neutral element', () => {
            expect(
                render(concat(neutral, Span)({ name: 'children' })).container
                    .textContent,
            ).toBe('Span(children)');
            expect(
                render(concat(Span, neutral)({ name: 'children' })).container
                    .textContent,
            ).toBe('Span(children)');
        });
    });
});
