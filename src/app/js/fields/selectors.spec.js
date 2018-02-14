import expect from 'expect';

import selectors, {
    isACompositeFields,
    getLineColGetterFromAllFields,
} from './selectors';
import {
    COVER_DATASET,
    COVER_COLLECTION,
    COVER_DOCUMENT,
} from '../../../common/cover';

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
            expect(selectors.getFields(state)).toEqual([
                'field1',
                'field2',
                'field3',
            ]);
        });
    });

    describe('getOntologyFields', () => {
        const state = {
            list: ['name1', 'name2', 'name3', 'name4'],
            byName: {
                name1: { name: 'name1', cover: COVER_DATASET },
                name2: { name: 'name2', cover: COVER_DATASET },
                name3: { name: 'name3', cover: COVER_COLLECTION },
                name4: { name: 'name4', cover: COVER_DOCUMENT },
            },
        };

        it('should return array of all dataset fields if second args is dataset', () => {
            expect(selectors.getOntologyFields(state, COVER_DATASET)).toEqual([
                { name: 'name1', cover: COVER_DATASET },
                { name: 'name2', cover: COVER_DATASET },
            ]);
        });

        it('should return array of all document and collection fields if second args is not dataset', () => {
            expect(selectors.getOntologyFields(state, 'other')).toEqual([
                { name: 'name3', cover: COVER_COLLECTION },
                { name: 'name4', cover: COVER_DOCUMENT },
            ]);
        });
    });

    describe('getNbFields', () => {
        it('should return list length', () => {
            expect(selectors.getNbFields({ list: [1, 2, 3] })).toBe(3);
        });
    });

    describe('getEditedField', () => {
        it('should return editedField', () => {
            expect(
                selectors.getEditedField({
                    editedFieldName: 'name2',
                    byName: {
                        name1: 'field1',
                        name2: 'field2',
                        name3: 'field3',
                    },
                }),
            ).toBe('field2');
        });
    });

    describe('getLineColGetterFromAllFields', () => {
        it('should return a function returning line value for given field', () => {
            const field = {
                name: 'field',
            };
            const getLineCol = getLineColGetterFromAllFields({ field }, field);
            expect(getLineCol({ field: 'value', other: 'data' })).toEqual(
                'value',
            );
        });
        it('should stringify result if it is an array', () => {
            const field = {
                name: 'field',
            };
            const getLineCol = getLineColGetterFromAllFields({ field }, field);
            expect(
                getLineCol({ field: ['value1', 'value2'], other: 'data' }),
            ).toEqual('["value1","value2"]');
        });
    });

    describe('getFieldsForPreview', () => {
        it('should return all fields if no formData', () => {
            const state = {
                list: ['field1', 'field2', 'field3'],
                editedFieldName: 'field2',
                byName: {
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3',
                },
            };

            expect(selectors.getFieldsForPreview(state)).toEqual([
                'value1',
                'value2',
                'value3',
            ]);
        });

        it('should return all fields if no editedFieldName', () => {
            const state = {
                list: ['field1', 'field2', 'field3'],
                byName: {
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3',
                },
            };

            expect(selectors.getFieldsForPreview(state, 'form data')).toEqual([
                'value1',
                'value2',
                'value3',
            ]);
        });

        it('should return all fields replacing editedFieldName by formData', () => {
            const state = {
                list: ['field1', 'field2', 'field3'],
                byName: {
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3',
                },
            };

            expect(
                selectors.getFieldsForPreview(
                    { ...state, editedFieldName: 'field1' },
                    'form data',
                ),
            ).toEqual(['form data', 'value2', 'value3']);

            expect(
                selectors.getFieldsForPreview(
                    { ...state, editedFieldName: 'field2' },
                    'form data',
                ),
            ).toEqual(['value1', 'form data', 'value3']);

            expect(
                selectors.getFieldsForPreview(
                    { ...state, editedFieldName: 'field3' },
                    'form data',
                ),
            ).toEqual(['value1', 'value2', 'form data']);
        });
    });
    describe('getCollectionFields', () => {
        it('should return the model', () => {
            expect(
                selectors.getCollectionFields({
                    list: ['first', 'second'],
                    byName: {
                        first: {
                            name: 'first',
                            foo: 'bar',
                            cover: 'collection',
                        },
                        second: {
                            name: 'second',
                            foo: 'bar2',
                            cover: 'dataset',
                        },
                    },
                }),
            ).toEqual([{ name: 'first', foo: 'bar', cover: 'collection' }]);
        });
    });

    describe('getDatasetFields', () => {
        it('should return the model', () => {
            expect(
                selectors.getDatasetFields({
                    list: ['first', 'second'],
                    byName: {
                        first: {
                            name: 'first',
                            foo: 'bar',
                            cover: 'collection',
                        },
                        second: {
                            name: 'second',
                            foo: 'bar2',
                            cover: 'dataset',
                        },
                    },
                }),
            ).toEqual([{ name: 'second', foo: 'bar2', cover: 'dataset' }]);
        });
    });

    describe('hasPublishedDataset', () => {
        it('should return true if published', () => {
            expect(selectors.hasPublishedDataset({ published: true })).toEqual(
                true,
            );
        });
        it('should return false if published', () => {
            expect(selectors.hasPublishedDataset({ published: false })).toEqual(
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
                    cover: 'collection',
                    _id: 'who cares',
                    contributors: 'some random guy',
                },
            },
            selectedField: 'name',
        };

        expect(selectors.getFieldToAdd(state)).toEqual({
            field: 'data',
            cover: 'collection',
        });
    });

    it('should return { cover: document } if selectedField is new', () => {
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
            cover: 'document',
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

        expect(selectors.getFieldToAdd(state)).toBe(null);
    });
});
