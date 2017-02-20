import expect from 'expect';

import reducer, {
    defaultState,
} from './';

import {
    loadPublicationSuccess,
} from '../publication';

describe('characteristic reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_PUBLICATION_SUCCESS action', () => {
        const action = loadPublicationSuccess({
            characteristics: ['foo'],
            fields: ['bar'],
            published: true,
        });
        const state = reducer(defaultState, action);

        expect(state).toEqual({
            ...defaultState,
            characteristics: ['foo'],
            newCharacteristics: 'foo',
        });
    });
});
