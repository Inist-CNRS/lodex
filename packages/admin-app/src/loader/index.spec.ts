import reducer, {
    haveLoadersSettled,
    loadLoaders,
    loadLoadersError,
    loadLoadersSuccess,
} from './index';

// @ts-expect-error TS2345
const init = () => reducer(undefined, { type: '@@INIT' });

describe('loaders reducer', () => {
    it('has not settled before any load', () => {
        expect(haveLoadersSettled(init())).toBe(false);
    });

    it('has not settled while loading', () => {
        expect(haveLoadersSettled(reducer(init(), loadLoaders()))).toBe(false);
    });

    it('has settled on a successful load of an empty list', () => {
        const state = reducer(init(), loadLoadersSuccess([]));
        expect(haveLoadersSettled(state)).toBe(true);
    });

    it('has settled on a successful load of loaders', () => {
        const state = reducer(init(), loadLoadersSuccess([{ name: 'csv' }]));
        expect(haveLoadersSettled(state)).toBe(true);
    });

    it('has settled on an error', () => {
        const state = reducer(init(), loadLoadersError('boom'));
        expect(haveLoadersSettled(state)).toBe(true);
    });
});
