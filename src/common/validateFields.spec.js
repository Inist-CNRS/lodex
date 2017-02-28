import expect from 'expect';

import {
    COVER_DOCUMENT,
    COVER_COLLECTION,
} from './cover';
import {
    validateField,
    validateLabel,
    validateCover,
    validateScheme,
    validateTransformers,
    validateCompletesField,
    validateComposedOf,
    validateComposedOfFields,
    validateComposedOfSeparator,
    validateComposedOfField,
} from './validateFields';

describe('validateField', () => {
    it('should return invalid result if receiving an empty field', () => {
        const field = {};
        const result = validateField(field);

        expect(result).toEqual({
            isValid: false,
            name: undefined,
            properties: [
                {
                    name: 'label',
                    isValid: false,
                    error: 'required',
                },
                {
                    name: 'cover',
                    isValid: false,
                    error: 'required',
                },
                {
                    name: 'scheme',
                    isValid: true,
                },
                {
                    name: 'transformers',
                    isValid: false,
                    error: 'required_or_composed_of_required',
                },
                {
                    name: 'completes',
                    isValid: true,
                    error: undefined,
                },
                {
                    name: 'composedOf',
                    isValid: false,
                    error: 'required_or_transformers_required',
                },
            ],
            propertiesAreValid: false,
            composedOfFields: [],
            composedOfFieldsAreValid: true,
            transformers: [],
            transformersAreValid: true,
        });
    });

    it('should return valid result if receiving valid field with transformers', () => {
        const field = {
            name: 'field name',
            label: 'field label',
            cover: 'collection',
            transformers: [
                { operation: 'COLUMN', args: [] },
            ],
        };
        const result = validateField(field);

        expect(result).toEqual({
            isValid: true,
            name: 'field name',
            properties: [
                {
                    name: 'label',
                    isValid: true,
                },
                {
                    name: 'cover',
                    isValid: true,
                },
                {
                    name: 'scheme',
                    isValid: true,
                },
                {
                    name: 'transformers',
                    isValid: true,
                },
                {
                    name: 'completes',
                    isValid: true,
                    error: undefined,
                },
                {
                    name: 'composedOf',
                    isValid: true,
                },
            ],
            propertiesAreValid: true,
            composedOfFields: [],
            composedOfFieldsAreValid: true,
            transformers: [{
                name: 'COLUMN',
                isValid: true,
                error: undefined,
            }],
            transformersAreValid: true,
        });
    });

    describe('validateLabel', () => {
        it('should return valid result if label is at least 2 char long', () => {
            expect(validateLabel({ label: 'my label' })).toEqual({
                name: 'label',
                isValid: true,
            });
        });

        it('should return invalid error if label is at less than 2 char long', () => {
            expect(validateLabel({ label: 'm' })).toEqual({
                name: 'label',
                isValid: false,
                error: 'invalid_label',
            });
        });

        it('should return required error if label is absent', () => {
            expect(validateLabel({})).toEqual({
                name: 'label',
                isValid: false,
                error: 'required',
            });
        });
    });

    describe('validateCover', () => {
        it('should return valid result if cover is part of valid cover', () => {
            expect(validateCover({ cover: COVER_COLLECTION })).toEqual({
                name: 'cover',
                isValid: true,
            });
        });

        it('should return valid result if cover is COVER_DOCUMENT and contribution is true', () => {
            expect(validateCover({ cover: COVER_DOCUMENT }, true)).toEqual({
                name: 'cover',
                isValid: true,
            });
        });

        it('should return invalid result if cover is not COVER_DOCUMENT and contribution is true', () => {
            expect(validateCover({ cover: COVER_COLLECTION }, true)).toEqual({
                name: 'cover',
                isValid: false,
                error: 'invalid_contribution_cover',
            });
        });

        it('should return invalid error if cover is at less than 2 char long', () => {
            expect(validateCover({ cover: 'UNKNOWN' })).toEqual({
                name: 'cover',
                isValid: false,
                error: 'invalid_cover',
            });
        });

        it('should return required error if cover is absent', () => {
            expect(validateCover({})).toEqual({
                name: 'cover',
                isValid: false,
                error: 'required',
            });
        });
    });

    describe('validateScheme', () => {
        it('should return valid result if scheme start with http://', () => {
            expect(validateScheme({ scheme: 'http://scheme.uri' })).toEqual({
                name: 'scheme',
                isValid: true,
            });
        });

        it('should return valid result if scheme start with https://', () => {
            expect(validateScheme({ scheme: 'https://scheme.uri' })).toEqual({
                name: 'scheme',
                isValid: true,
            });
        });

        it('should return invalid error if scheme do not start with http not https', () => {
            expect(validateScheme({ scheme: 'google.fr' })).toEqual({
                name: 'scheme',
                isValid: false,
                error: 'invalid_scheme',
            });
        });

        it('should return valid if scheme is absent', () => {
            expect(validateScheme({})).toEqual({
                name: 'scheme',
                isValid: true,
            });
        });
    });

    describe('validateTransformers', () => {
        it('should return valid result if transformers is present with at least an item', () => {
            expect(validateTransformers({ transformers: ['transformer'] })).toEqual({
                name: 'transformers',
                isValid: true,
            });
        });

        it('should return valid result if no transformers and there is composedOf', () => {
            expect(validateTransformers({
                transformers: [],
                composedOf: 'composedOf data',
            })).toEqual({
                name: 'transformers',
                isValid: true,
            });
        });

        it('should return invalid result if transformers is empty', () => {
            expect(validateTransformers({ transformers: [] })).toEqual({
                name: 'transformers',
                isValid: false,
                error: 'required_or_composed_of_required',
            });
        });

        it('should return invalid result if no transformers', () => {
            expect(validateTransformers({})).toEqual({
                name: 'transformers',
                isValid: false,
                error: 'required_or_composed_of_required',
            });
        });

        it('should return invalid result if transformers and composedOf are both present', () => {
            expect(validateTransformers({
                transformers: ['transformer data'],
                composedOf: {},
            })).toEqual({
                name: 'transformers',
                isValid: false,
                error: 'composed_of_conflict',
            });
        });
    });

    describe('validateComposedOf', () => {
        it('should return valid result if composedOf is present', () => {
            expect(validateComposedOf({ composedOf: 'composedOf data' })).toEqual({
                name: 'composedOf',
                isValid: true,
            });
        });

        it('should return valid result if no composedOf and transformers', () => {
            expect(validateComposedOf({ transformers: ['transformer'] })).toEqual({
                name: 'composedOf',
                isValid: true,
            });
        });

        it('should return valid result if no composedOf and isContribution is true', () => {
            expect(validateComposedOf({}, true)).toEqual({
                name: 'composedOf',
                isValid: true,
            });
        });

        it('should return invalid result if composedOf is absent', () => {
            expect(validateComposedOf({})).toEqual({
                name: 'composedOf',
                isValid: false,
                error: 'required_or_transformers_required',
            });
        });

        it('should return invalid result if composedOf is present along with transformers', () => {
            expect(validateComposedOf({
                transformers: ['transformer'],
                composedOf: 'composedOf data',
            })).toEqual({
                name: 'composedOf',
                isValid: false,
                error: 'transformers_conflict',
            });
        });

        it('should return invalid result if composedOf is present and contribution is true', () => {
            expect(validateComposedOf({
                composedOf: 'composedOf data',
            }, true)).toEqual({
                name: 'composedOf',
                isValid: false,
                error: 'contribution_no_composed_of',
            });
        });
    });

    describe('validateComposedOfSeparator', () => {
        it('should return valid result if composedOf.separator is valid', () => {
            expect(validateComposedOfSeparator({
                composedOf: {
                    separator: ' ',
                },
            })).toEqual({
                name: 'composedOf.separator',
                isValid: true,
            });
        });

        it('should return invalid result if composedOf.separator is invalid', () => {
            expect(validateComposedOfSeparator({
                composedOf: {
                    separator: [],
                },
            })).toEqual({
                name: 'composedOf.separator',
                isValid: false,
                error: 'invalid_composedOf.separator',
            });
        });

        it('should return required error if composedOf.separator is absent', () => {
            expect(validateComposedOfSeparator({
                composedOf: {},
            })).toEqual({
                name: 'composedOf.separator',
                isValid: false,
                error: 'required',
            });
        });

        it('should return null if no composedOf', () => {
            expect(validateComposedOfSeparator({})).toEqual(null);
        });
    });

    describe('validateComposedOfFields', () => {
        it('should return valid result if there is at least 2 composedOf.fields', () => {
            expect(validateComposedOfFields({
                composedOf: {
                    fields: ['field1', 'field2'],
                },
            })).toEqual({
                name: 'composedOf.fields',
                isValid: true,
            });
        });

        it('should return invalid error if there is less than 2 composedOf.fields', () => {
            expect(validateComposedOfFields({
                composedOf: {
                    fields: ['field1'],
                },
            })).toEqual({
                name: 'composedOf.fields',
                isValid: false,
                error: 'required',
            });
        });

        it('should return invalid error if there is no composedOf.fields', () => {
            expect(validateComposedOfFields({
                composedOf: {},
            })).toEqual({
                name: 'composedOf.fields',
                isValid: false,
                error: 'required',
            });
        });

        it('should return null if there is no composedOf', () => {
            expect(validateComposedOfFields({})).toEqual(null);
        });
    });

    describe('validateComposedOfField', () => {
        it('should return valid result if field is in allFields', () => {
            expect(validateComposedOfField('field1', [{ name: 'field1' }])).toEqual({
                name: 'composedOf.fields[field1]',
                isValid: true,
                error: undefined,
            });
        });

        it('should return invalid error if field is not in allFields', () => {
            expect(validateComposedOfField('field2', [{ name: 'field1' }])).toEqual({
                name: 'composedOf.fields[field2]',
                isValid: false,
                error: 'inexisting_target_field',
            });
        });
    });

    describe('validateCompletesField', () => {
        it('should return valid result if field.completes is in allFields', () => {
            expect(validateCompletesField({ completes: 'field1' }, [{ name: 'field1' }])).toEqual({
                name: 'completes',
                isValid: true,
                error: undefined,
            });
        });

        it('should return invalid error if field.completes is not in allFields', () => {
            expect(validateCompletesField({ completes: 'field2' }, [{ name: 'field1' }])).toEqual({
                name: 'completes',
                isValid: false,
                error: 'inexisting_target_field',
            });
        });
    });
});
