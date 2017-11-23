import expect from 'expect';

import reducer, {
    defaultState,
    setCharacteristicValue,
    updateCharacteristics,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
    addCharacteristic,
    addCharacteristicCancel,
    addCharacteristicOpen,
    addCharacteristicError,
    addCharacteristicSuccess,
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
        const action = updateCharacteristicsSuccess('new');
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

    it('should handle addCharacteristic', () => {
        const action = addCharacteristic();
        const state = {
            data: 'value',
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            error: null,
            isSaving: true,
        });
    });

    it('should handle addCharacteristicOpen', () => {
        const action = addCharacteristicOpen();
        const state = {
            data: 'value',
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            error: null,
            isAdding: true,
        });
    });

    it('should handle addCharacteristicCancel', () => {
        const action = addCharacteristicCancel();
        const state = {
            data: 'value',
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            error: null,
            isAdding: false,
        });
    });

    it('should handle addCharacteristicSuccess', () => {
        const action = addCharacteristicSuccess({
            characteristics: 'updated characteristics',
        });
        const state = {
            data: 'value',
            characteristics: ['charac1', 'charac2'],
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            error: null,
            isAdding: false,
            isSaving: false,
            newCharacteristics: 'updated characteristics',
            characteristics: ['updated characteristics', 'charac1', 'charac2'],
        });
    });

    it('should handle addCharacteristicError', () => {
        const action = addCharacteristicError('error');
        const state = {
            data: 'value',
        };

        expect(reducer(state, action)).toEqual({
            data: 'value',
            error: 'error',
            isSaving: false,
        });
    });
});
