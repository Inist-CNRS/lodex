import { createGlobalSelector, createGlobalSelectors } from './selectors';

describe('selectors', () => {
    describe('createGlobalSelector', () => {
        it('returns a globalized selector', () => {
            // @ts-expect-error TS7006
            const getLocalState = (state) => state.local;
            // @ts-expect-error TS7006
            const localSelector = (state) => state.foo === 'bar';

            const globalSelector = createGlobalSelector(
                getLocalState,
                localSelector,
            );

            // @ts-expect-error TS2555
            expect(globalSelector({ local: { foo: 'bar' } })).toBe(true);
        });

        it('passes props to the local selector', () => {
            // @ts-expect-error TS7006
            const getLocalState = (state) => state.local;
            // @ts-expect-error TS7006
            const localSelector = (state, props) => state.foo === props;

            const globalSelector = createGlobalSelector(
                getLocalState,
                localSelector,
            );

            expect(globalSelector({ local: { foo: 'bar' } }, 'bar')).toBe(true);
        });
    });

    describe('createGlobalSelectors', () => {
        it('returns an object with local selectors', () => {
            // @ts-expect-error TS7006
            const getLocalState = (state) => state.local;
            // @ts-expect-error TS7006
            const localSelector = (state) => state.foo === 'bar';
            // @ts-expect-error TS7006
            const localSelector2 = (state) => state.foo !== 'bar';

            const globalSelectors = createGlobalSelectors(getLocalState, {
                local: localSelector,
                local2: localSelector2,
            });

            // @ts-expect-error TS2339
            expect(globalSelectors.local({ local: { foo: 'bar' } })).toBe(true);
            // @ts-expect-error TS2339
            expect(globalSelectors.local2({ local: { foo: 'bar' } })).toBe(
                false,
            );
        });

        it('passes props to the local selectors', () => {
            // @ts-expect-error TS7006
            const getLocalState = (state) => state.local;
            // @ts-expect-error TS7006
            const localSelector = (state, props) => state.foo === props;
            // @ts-expect-error TS7006
            const localSelector2 = (state, props) => state.foo !== props;

            const globalSelectors = createGlobalSelectors(getLocalState, {
                local: localSelector,
                local2: localSelector2,
            });

            expect(
                // @ts-expect-error TS2339
                globalSelectors.local({ local: { foo: 'bar' } }, 'bar'),
            ).toBe(true);
            expect(
                // @ts-expect-error TS2339
                globalSelectors.local2({ local: { foo: 'bar' } }, 'bar'),
            ).toBe(false);
        });
    });
});
