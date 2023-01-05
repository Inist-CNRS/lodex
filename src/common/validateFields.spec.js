import { SCOPE_DOCUMENT, SCOPE_COLLECTION, SCOPE_GRAPHIC } from './scope';
import {
    validateCompletesField,
    validateComposedOf,
    validateComposedOfFields,
    validateComposedOfField,
    validateScope,
    validateField,
    validateLanguage,
    validatePosition,
    validateScheme,
    validateTransformer,
    validateTransformers,
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
                    name: 'scope',
                    isValid: false,
                    error: 'required',
                },
                {
                    name: 'scheme',
                    isValid: true,
                },
                {
                    name: 'position',
                    isValid: false,
                    error: 'required',
                },
                {
                    name: 'transformers',
                    isValid: false,
                    error: 'required',
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
                {
                    name: 'language',
                    isValid: true,
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
            scope: 'collection',
            position: 1,
            transformers: [{ operation: 'COLUMN', args: [{ value: 'a' }] }],
        };
        const result = validateField(field);

        expect(result).toEqual({
            isValid: true,
            name: 'field name',
            properties: [
                {
                    name: 'scope',
                    isValid: true,
                },
                {
                    name: 'scheme',
                    isValid: true,
                },
                {
                    name: 'position',
                    isValid: true,
                },
                {
                    name: 'transformers',
                    isValid: true,
                },
                {
                    name: 'completes',
                    isValid: true,
                },
                {
                    name: 'composedOf',
                    isValid: true,
                },
                {
                    name: 'language',
                    isValid: true,
                },
                {
                    name: 'transformer.operation',
                    isValid: true,
                },
            ],
            propertiesAreValid: true,
            composedOfFields: [],
            composedOfFieldsAreValid: true,
            transformers: [
                {
                    name: 'transformer.operation',
                    isValid: true,
                },
            ],
            transformersAreValid: true,
        });
    });

    describe('validateScope', () => {
        it('should return valid result if scope is part of valid scope : collection', () => {
            expect(validateScope({ scope: SCOPE_COLLECTION })).toEqual({
                name: 'scope',
                isValid: true,
            });
        });

        it('should return valid result if scope is part of valid scope : graphic', () => {
            expect(validateScope({ scope: SCOPE_GRAPHIC })).toEqual({
                name: 'scope',
                isValid: true,
            });
        });

        it('should return valid result if scope is SCOPE_DOCUMENT and contribution is true', () => {
            expect(validateScope({ scope: SCOPE_DOCUMENT }, true)).toEqual({
                name: 'scope',
                isValid: true,
            });
        });

        it('should return invalid result if scope is not SCOPE_DOCUMENT and contribution is true', () => {
            expect(validateScope({ scope: SCOPE_COLLECTION }, true)).toEqual({
                name: 'scope',
                isValid: false,
                error: 'invalid_contribution_scope',
            });
        });

        it('should return invalid error if scope is not part of valid scope', () => {
            expect(validateScope({ scope: 'UNKNOWN' })).toEqual({
                name: 'scope',
                isValid: false,
                error: 'invalid_scope',
            });
        });

        it('should return required error if scope is absent', () => {
            expect(validateScope({})).toEqual({
                name: 'scope',
                isValid: false,
                error: 'required',
            });
        });
    });

    describe('validatePosition', () => {
        it('should return valid result if position is greater than 0 and field is not uri', () => {
            expect(validatePosition({ position: 1, name: 'foo' })).toEqual({
                name: 'position',
                isValid: true,
            });
        });

        it('should return valid result if position is 0 and scope is collection and field is uri', () => {
            expect(
                validatePosition({
                    position: 0,
                    name: 'uri',
                    scope: SCOPE_COLLECTION,
                }),
            ).toEqual({
                name: 'position',
                isValid: true,
            });
        });

        it('should return valid result if position is 0 and scope is not SCOPE_COLLECTION', () => {
            expect(
                validatePosition(
                    { position: 0, name: 'toto', scope: SCOPE_GRAPHIC },
                    true,
                ),
            ).toEqual({
                name: 'position',
                isValid: true,
            });
        });

        it('should return invalid result if position is less than 0', () => {
            expect(validatePosition({ position: -1, name: 'uri' })).toEqual({
                name: 'position',
                isValid: false,
                error: 'invalid',
            });
        });

        it('should return required error if position is absent', () => {
            expect(validatePosition({})).toEqual({
                name: 'position',
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
                error: 'invalid',
            });
        });

        it('should return valid if scheme is absent', () => {
            expect(validateScheme({})).toEqual({
                name: 'scheme',
                isValid: true,
            });
        });
    });

    describe('validateLanguage', () => {
        it('returns valid result if language is known', () => {
            expect(
                validateLanguage({ language: 'en' }, [{ code: 'en' }]),
            ).toEqual({
                name: 'language',
                isValid: true,
            });
        });

        it('returns valid result if languages are not specified', () => {
            expect(validateLanguage({ language: 'en' }, [])).toEqual({
                name: 'language',
                isValid: true,
            });
        });

        it('returns valid if language is absent', () => {
            expect(validateLanguage({})).toEqual({
                name: 'language',
                isValid: true,
            });
        });

        it('returns invalid error if language is unknown', () => {
            expect(
                validateLanguage({ language: 'foo' }, [{ code: 'en' }]),
            ).toEqual({
                name: 'language',
                isValid: false,
                error: 'invalid',
            });
        });
    });

    describe('validateTransformers', () => {
        it('should return valid result if transformers is present with at least an item', () => {
            expect(
                validateTransformers({ transformers: ['transformer'] }),
            ).toEqual({
                name: 'transformers',
                isValid: true,
            });
        });

        it('should return invalid result if transformers is empty', () => {
            expect(validateTransformers({ transformers: [] })).toEqual({
                name: 'transformers',
                isValid: false,
                error: 'required',
            });
        });

        it('should return invalid result if no transformers', () => {
            expect(validateTransformers({})).toEqual({
                name: 'transformers',
                isValid: false,
                error: 'required',
            });
        });
    });

    describe('validateTransformer', () => {
        it('should return invalid if the transformer is not in known transformers', () => {
            const knownTransformers = {
                UPPERCASE: x => x,
                LOWERCASE: x => x,
            };

            const transformer = {
                operation: 'IVY',
            };

            const result = validateTransformer(
                transformer,
                false,
                knownTransformers,
            );

            expect(result.name).toBe('transformer.operation');
            expect(result.isValid).toBe(false);
            expect(result.meta.operation).toBe('IVY');
            expect(result.error).toBe('invalid');
        });

        it('should return invalid if there is less args in the transformer than in the corresponding transformer', () => {
            const IVY = x => x;

            IVY.getMetas = () => ({
                name: 'IVY',
                type: 'transform',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                    },
                ],
            });

            const knownTransformers = {
                IVY,
            };

            const transformer = {
                operation: 'IVY',
                args: [],
            };

            const result = validateTransformer(
                transformer,
                false,
                knownTransformers,
            );

            expect(result.name).toBe('transformer.args');
            expect(result.isValid).toBe(false);
            expect(result.meta.operation).toBe('IVY');
            expect(result.error).toBe('invalid');
        });

        it('should return invalid if the transformer args has an undefined value', () => {
            const IVY = x => x;

            IVY.getMetas = () => ({
                name: 'IVY',
                type: 'transform',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                    },
                ],
            });

            const knownTransformers = {
                IVY,
            };

            const transformer = {
                operation: 'IVY',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                        value: undefined,
                    },
                ],
            };

            const result = validateTransformer(
                transformer,
                false,
                knownTransformers,
            );

            expect(result.name).toBe('transformer.args');
            expect(result.isValid).toBe(false);
            expect(result.meta.operation).toBe('IVY');
            expect(result.meta.args).toBe(1);
            expect(result.error).toBe('invalid');
        });

        it('should return invalid if the transformer args has a value equals to an empty string', () => {
            const IVY = x => x;

            IVY.getMetas = () => ({
                name: 'IVY',
                type: 'transform',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                    },
                ],
            });

            const knownTransformers = {
                IVY,
            };

            const transformer = {
                operation: 'IVY',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                        value: '',
                    },
                ],
            };

            const result = validateTransformer(
                transformer,
                false,
                knownTransformers,
            );

            expect(result.name).toBe('transformer.args');
            expect(result.isValid).toBe(false);
            expect(result.meta.operation).toBe('IVY');
            expect(result.meta.args).toBe(1);
            expect(result.error).toBe('invalid');
        });

        it('should return valid otherwise', () => {
            const IVY = x => x;

            IVY.getMetas = () => ({
                name: 'IVY',
                type: 'transform',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                    },
                    {
                        name: 'value',
                        type: 'string',
                    },
                ],
            });

            const knownTransformers = {
                IVY,
            };

            const transformer = {
                operation: 'IVY',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                        value: null,
                    },
                    {
                        name: 'value',
                        type: 'string',
                        value: 'covfefe',
                    },
                ],
            };

            const result = validateTransformer(
                transformer,
                false,
                knownTransformers,
            );

            expect(result.name).toBe('transformer.operation');
            expect(result.isValid).toBe(true);
        });
    });

    describe('validateComposedOf', () => {
        it('should return valid result if composedOf is present', () => {
            expect(
                validateComposedOf({ composedOf: 'composedOf data' }),
            ).toEqual({
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

        it('should return valid result if composedOf is absent', () => {
            expect(validateComposedOf({})).toEqual({
                name: 'composedOf',
                isValid: true,
            });
        });

        it('should return invalid result if composedOf is present and contribution is true', () => {
            expect(
                validateComposedOf(
                    {
                        composedOf: 'composedOf data',
                    },
                    true,
                ),
            ).toEqual({
                name: 'composedOf',
                isValid: false,
                error: 'contribution_no_composed_of',
            });
        });
    });

    describe('validateComposedOfFields', () => {
        it('should return valid result if there is at least 2 composedOf.fields', () => {
            expect(
                validateComposedOfFields({
                    composedOf: {
                        isComposedOf: true,
                        fields: ['field1', 'field2'],
                    },
                }),
            ).toEqual({
                name: 'composedOf.fields',
                isValid: true,
            });
        });

        it('should return invalid error if there is less than 2 composedOf.fields', () => {
            expect(
                validateComposedOfFields({
                    composedOf: {
                        isComposedOf: true,
                        fields: ['field1'],
                    },
                }),
            ).toEqual({
                name: 'composedOf.fields',
                isValid: false,
                error: 'required',
            });
        });

        it('should return invalid error if there is no composedOf.fields', () => {
            expect(
                validateComposedOfFields({
                    composedOf: {
                        isComposedOf: true,
                    },
                }),
            ).toEqual({
                name: 'composedOf.fields',
                isValid: false,
                error: 'required',
            });
        });

        it('should return null if there is no composedOf', () => {
            expect(validateComposedOfFields({})).toBeNull();
        });
    });

    describe('validateComposedOfField', () => {
        it('should return valid result if field is in allFields', () => {
            expect(
                validateComposedOfField('field1', [{ name: 'field1' }]),
            ).toEqual({
                name: 'composedOf.fields',
                isValid: true,
                error: undefined,
            });
        });

        it('should return invalid error if field is not in allFields', () => {
            expect(
                validateComposedOfField('field2', [{ name: 'field1' }]),
            ).toEqual({
                name: 'composedOf.fields',
                isValid: false,
                error: 'invalid',
            });
        });
    });

    describe('validateCompletesField', () => {
        it('should return valid result if field.completes is in allFields', () => {
            expect(
                validateCompletesField({ completes: 'field1' }, [
                    { name: 'field1' },
                ]),
            ).toEqual({
                name: 'completes',
                isValid: true,
                error: undefined,
            });
        });

        it('should return invalid error if field.completes is not in allFields', () => {
            expect(
                validateCompletesField({ completes: 'field2' }, [
                    { name: 'field1' },
                ]),
            ).toEqual({
                name: 'completes',
                isValid: false,
                error: 'inexisting_target_field',
            });
        });
    });
});
