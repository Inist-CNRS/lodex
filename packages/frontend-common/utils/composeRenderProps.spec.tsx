import { type ReactNode } from 'react';
import { render } from '@testing-library/react';

import composeRenderProps, { concat, neutral } from './composeRenderProps';

interface DivProps {
    children(props: Record<string, unknown>): ReactNode;
}

interface PProps {
    name: string;
    children(...args: unknown[]): unknown;
}

interface SpanProps {
    name: string;
}

describe('composeRenderProps', () => {
    const Div = ({ children, ...props }: DivProps) => (
        <div>Div({children(props)})</div>
    );
    // @ts-expect-error TS7031
    const P = ({ children, ...props }: PProps) => <p>P({children(props)})</p>;
    const Span = ({ name }: SpanProps) => <span>Span({name})</span>;
    it('should compose renderProps', () => {
        const composedComponent = composeRenderProps([Div, P, Span])({
            name: 'nested',
        });
        const screen = render(composedComponent);
        expect(screen.container.textContent).toBe('Div(P(Span(nested)))');
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
