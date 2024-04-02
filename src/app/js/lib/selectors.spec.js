import { createGlobalSelector, createGlobalSelectors } from './selectors';

describe('selectors', () => {
    describe('createGlobalSelector', () => {
        it('returns a globalized selector', () => {
            const getLocalState = (state) => state.local;
            const localSelector = (state) => state.foo === 'bar';

            const globalSelector = createGlobalSelector(
                getLocalState,
                localSelector,
            );

            expect(globalSelector({ local: { foo: 'bar' } })).toBe(true);
        });

        it('passes props to the local selector', () => {
            const getLocalState = (state) => state.local;
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
            const getLocalState = (state) => state.local;
            const localSelector = (state) => state.foo === 'bar';
            const localSelector2 = (state) => state.foo !== 'bar';

            const globalSelectors = createGlobalSelectors(getLocalState, {
                local: localSelector,
                local2: localSelector2,
            });

            expect(globalSelectors.local({ local: { foo: 'bar' } })).toBe(true);
            expect(globalSelectors.local2({ local: { foo: 'bar' } })).toBe(
                false,
            );
        });

        it('passes props to the local selectors', () => {
            const getLocalState = (state) => state.local;
            const localSelector = (state, props) => state.foo === props;
            const localSelector2 = (state, props) => state.foo !== props;

            const globalSelectors = createGlobalSelectors(getLocalState, {
                local: localSelector,
                local2: localSelector2,
            });

            expect(
                globalSelectors.local({ local: { foo: 'bar' } }, 'bar'),
            ).toBe(true);
            expect(
                globalSelectors.local2({ local: { foo: 'bar' } }, 'bar'),
            ).toBe(false);
        });
    });
});
