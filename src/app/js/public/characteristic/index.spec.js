import expect from 'expect';

import reducer, {
    defaultState,
    setCharacteristicValue,
    updateCharacteristics,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
} from './';

import { loadPublicationSuccess } from '../../fields';

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

        const state = reducer({ data: 'value' }, action);

        expect(state).toEqual({
            data: 'value',
            characteristics: ['foo'],
            newCharacteristics: 'foo',
        });
    });

    it('should handle the SET_CHARACTERISTIC_VALUE action', () => {
        const action = setCharacteristicValue({
            name: 'name',
            value: 'value',
        });
        const state = {
            data: 'value',
            newCharacteristics: {
                charac: 'data',
            },
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            newCharacteristics: {
                charac: 'data',
                name: 'value',
            },
        });
    });

    it('should handle the UPDATE_CHARACTERISTICS action', () => {
        const action = updateCharacteristics();
        const state = {
            data: 'value',
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            error: null,
            isSaving: true,
        });
    });

    it('should handle updateCharacteristicsError', () => {
        const action = updateCharacteristicsError('error');
        const state = {
            data: 'value',
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            error: 'error',
            isSaving: false,
        });
    });

    it('should handle updateCharacteristicsSuccess', () => {
        const action = updateCharacteristicsSuccess({ characteristics: 'new' });
        const state = {
            data: 'value',
            characteristics: ['charac'],
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            characteristics: ['new', 'charac'],
            newCharacteristics: 'new',
            error: null,
            isSaving: false,
        });
    });
});
