import selectors, {
    areAllFieldsValid,
    getCollectionFields,
    getFields,
    getLineColGetterFromAllFields,
    isACompositeFields,
} from './selectors';

import {
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
} from '../../../common/scope';

describe('field selectors', () => {
    describe('getFields', () => {
        it('should return array of all fields', () => {
            const state = {
                list: ['name1', 'name2', 'name3'],
                byName: {
                    name1: 'field1',
                    name2: 'field2',
                    name3: 'field3',
                    name4: 'field4',
                },
            };
            // @ts-expect-error TS2345
            expect(getFields(state)).toEqual(['field1', 'field2', 'field3']);
        });
    });

    describe('getOntologyFields', () => {
        const state = {
            list: ['name1', 'name2', 'name3', 'name4'],
            byName: {
                name1: { name: 'name1', scope: SCOPE_DATASET },
                name2: { name: 'name2', scope: SCOPE_DATASET },
                name3: { name: 'name3', scope: SCOPE_COLLECTION },
                name4: { name: 'name4', scope: SCOPE_DOCUMENT },
            },
        };

        it('should return array of all dataset fields if second args is dataset', () => {
            // @ts-expect-error TS2345
            expect(selectors.getOntologyFields(state, SCOPE_DATASET)).toEqual([
                { name: 'name1', scope: SCOPE_DATASET },
                { name: 'name2', scope: SCOPE_DATASET },
            ]);
        });

        it('should return array of all document and collection fields if second args is document or collection', () => {
            // @ts-expect-error TS2345
            expect(selectors.getOntologyFields(state, 'document')).toEqual([
                { name: 'name3', scope: SCOPE_COLLECTION },
                { name: 'name4', scope: SCOPE_DOCUMENT },
            ]);
        });
    });

    describe('getNbFields', () => {
        it('should return list length', () => {
            expect(selectors.getNbFields({ list: [1, 2, 3] })).toBe(3);
        });
    });

    describe('getLineColGetterFromAllFields', () => {
        it('should return a function returning line value for given field', () => {
            const field = {
                name: 'field',
            };
            const getLineCol = getLineColGetterFromAllFields({ field }, field);
            expect(getLineCol({ field: 'value', other: 'data' })).toBe('value');
        });
        it('should stringify result if it is an array', () => {
            const field = {
                name: 'field',
            };
            const getLineCol = getLineColGetterFromAllFields({ field }, field);
            expect(
                getLineCol({ field: ['value1', 'value2'], other: 'data' }),
            ).toBe('["value1","value2"]');
        });
    });

    describe('getCollectionFields', () => {
        it('should return the model', () => {
            expect(
                getCollectionFields({
                    // @ts-expect-error TS2322
                    list: ['first', 'second'],
                    byName: {
                        first: {
                            name: 'first',
                            foo: 'bar',
                            scope: 'collection',
                        },
                        second: {
                            name: 'second',
                            foo: 'bar2',
                            scope: 'dataset',
                        },
                    },
                }),
            ).toEqual([{ name: 'first', foo: 'bar', scope: 'collection' }]);
        });
    });

    describe('getDatasetFields', () => {
        it('should return the model', () => {
            expect(
                selectors.getDatasetFields({
                    // @ts-expect-error TS2322
                    list: ['first', 'second'],
                    byName: {
                        first: {
                            name: 'first',
                            foo: 'bar',
                            scope: 'collection',
                        },
                        second: {
                            name: 'second',
                            foo: 'bar2',
                            scope: 'dataset',
                        },
                    },
                }),
            ).toEqual([{ name: 'second', foo: 'bar2', scope: 'dataset' }]);
        });
    });

    describe('hasPublishedDataset', () => {
        it('should return true if published', () => {
            expect(selectors.hasPublishedDataset({ published: true })).toBe(
                true,
            );
        });
        it('should return false if published', () => {
            expect(selectors.hasPublishedDataset({ published: false })).toBe(
                false,
            );
        });
    });

    describe('getContributionFields', () => {
        it('should return fields with contribution true', () => {
            const state = {
                list: ['field1', 'field2', 'field3', 'field4'],
                byName: {
                    field1: { name: 'field1' },
                    field2: { name: 'field2', contribution: true },
                    field3: { name: 'field3' },
                    field4: { name: 'field4', contribution: true },
                },
            };

            // @ts-expect-error TS2345
            expect(selectors.getContributionFields(state)).toEqual([
                { name: 'field2', contribution: true },
                { name: 'field4', contribution: true },
            ]);
        });
    });

    describe('isAcompositeFields', () => {
        it('should return true if field name is part of composedOf of one of the composedOf Field', () => {
            expect(
                isACompositeFields('composite', [
                    {
                        composedOf: {
                            fields: ['field1', 'field1'],
                        },
                    },
                    {
                        composedOf: {
                            fields: ['field3', 'composite'],
                        },
                    },
                    {
                        composedOf: {
                            fields: ['field4', 'field5'],
                        },
                    },
                ]),
            ).toBe(true);
        });

        it('should return true if field name is part of composedOf of one of the composedOf Field', () => {
            expect(
                isACompositeFields('composite', [
                    {
                        composedOf: {
                            fields: ['field1', 'field1'],
                        },
                    },
                    {
                        composedOf: {
                            fields: ['field3', 'field6'],
                        },
                    },
                    {
                        composedOf: {
                            fields: ['field4', 'field5'],
                        },
                    },
                ]),
            ).toBe(false);
        });

        it('should return false if no composedOf Field', () => {
            expect(isACompositeFields('composite', [])).toBe(false);
        });
    });

    describe('isFieldEdited', () => {
        it('should return true if given fieldname is equal to editedValueFieldName', () => {
            expect(
                selectors.isFieldEdited(
                    { editedValueFieldName: 'name' },
                    'name',
                ),
            ).toBe(true);
        });

        it('should return false if given fieldname is different from editedValueFieldName', () => {
            expect(
                selectors.isFieldEdited(
                    { editedValueFieldName: 'name' },
                    'no name',
                ),
            ).toBe(false);
        });
    });

    describe('isFieldConfigured', () => {
        it('should return true if given fieldname is equal to configuredFieldName', () => {
            expect(
                selectors.isFieldConfigured(
                    { configuredFieldName: 'name' },
                    'name',
                ),
            ).toBe(true);
        });

        it('should return false if given fieldname is different from configuredFieldName', () => {
            expect(
                selectors.isFieldConfigured(
                    { configuredFieldName: 'name' },
                    'no name',
                ),
            ).toBe(false);
        });
    });

    describe('areAllFieldsValid', () => {
        it('should return true if there are fields and all are valid', () => {
            const state = {
                allValid: true,
                list: [1, 2, 3],
            };

            expect(areAllFieldsValid(state)).toBe(true);
        });

        it('should return false if there are fields but not all are valid', () => {
            const state = {
                allValid: false,
                fields: [1, 2, 3],
            };

            expect(areAllFieldsValid(state)).toBe(false);
        });

        it('should return false if there is no fields', () => {
            const state = {
                allValid: true,
                fields: [],
            };

            expect(areAllFieldsValid(state)).toBe(false);
        });
    });
});

describe('getFieldToAdd', () => {
    it('should return byName[selectedField]', () => {
        const state = {
            byName: {
                name: {
                    field: 'data',
                },
            },
            selectedField: 'name',
        };

        expect(selectors.getFieldToAdd(state)).toEqual({ field: 'data' });
    });

    it('should omit contributors and _id from byName[selectedField]', () => {
        const state = {
            byName: {
                name: {
                    field: 'data',
                    scope: 'collection',
                    _id: 'who cares',
                    contributors: 'some random guy',
                },
            },
            selectedField: 'name',
        };

        expect(selectors.getFieldToAdd(state)).toEqual({
            field: 'data',
            scope: 'collection',
        });
    });

    it('should return { scope: document } if selectedField is new', () => {
        const state = {
            byName: {
                name: {
                    field: 'data',
                },
                new: 'ignore me',
            },
            selectedField: 'new',
        };

        expect(selectors.getFieldToAdd(state)).toEqual({
            scope: 'document',
        });
    });

    it('should return null if selectedField is not in byName', () => {
        const state = {
            byName: {
                name: {
                    field: 'data',
                },
            },
            selectedField: '404',
        };

        expect(selectors.getFieldToAdd(state)).toBeNull();
    });
});
