import reducer, {
    initialState,
    loadPrecomputedError,
    loadPrecomputedSuccess,
} from './index';

describe('precomputed reducer', () => {
    it('clears a previous load error once a load succeeds', () => {
        const failed = reducer(
            initialState,
            loadPrecomputedError(new Error('boom')),
        );
        expect(failed.error).toBeInstanceOf(Error);

        const reloaded = reducer(
            failed,
            // @ts-expect-error TS2345: the action payload is the list itself
            loadPrecomputedSuccess([
                { _id: 'id', name: 'name', status: '', hasData: false },
            ]),
        );
        expect(reloaded.error).toBeNull();
        expect(reloaded.precomputed).toHaveLength(1);
    });
});
