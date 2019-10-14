import reducer, {
    defaultState,
    setCharacteristicValue,
    updateCharacteristics,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
    selectors,
} from './';

import { loadPublicationSuccess } from '../fields';

describe('characteristic', () => {
    describe('reducer', () => {
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
            const action = updateCharacteristicsSuccess({
                characteristics: 'new',
            });
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

    describe('selectors', () => {
        describe('getRootCharacteristics', () => {
            it('should return only characteristics that should be displayed in home', () => {
                const state = {
                    characteristics: [
                        {
                            lothal: 'ezra',
                            mandalore: 'sabine',
                            malachor: 'ahsoka',
                        },
                    ],
                };
                const fields = [
                    {
                        name: 'lothal',
                        completes: false,
                        display_in_home: true,
                    },
                    {
                        name: 'mandalore',
                        completes: false,
                        display_in_home: false,
                    },
                    {
                        name: 'malachor',
                        completes: false,
                        display_in_home: true,
                    },
                ];

                const characteristics = selectors.getRootCharacteristics(
                    state,
                    fields,
                );

                expect(characteristics.length).toEqual(2);

                const c1 = characteristics[0];
                expect(c1.name).toEqual('lothal');
                expect(c1.completes).toEqual(false);
                expect(c1.display_in_home).toEqual(true);
                expect(c1.value).toEqual('ezra');

                const c2 = characteristics[1];
                expect(c2.name).toEqual('malachor');
                expect(c2.completes).toEqual(false);
                expect(c2.display_in_home).toEqual(true);
                expect(c2.value).toEqual('ahsoka');
            });
        });
    });
});
