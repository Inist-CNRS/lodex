const { getFieldValue } = require('./checkPredicate');

describe('checkPredicate', () => {
    describe('getFieldValue', () => {
        it('should return meta.initial when type is edition', () => {
            expect(
                getFieldValue({
                    type: 'edition',
                    meta: {
                        initial: 'meta.initial',
                    },
                    field: {
                        name: 'name',
                        format: {
                            name: 'fieldClone',
                        },
                        transformers: [
                            {
                                operation: 'PRECOMPUTED',
                                args: [
                                    {
                                        name: 'routine',
                                        value: 'precomputed value',
                                    },
                                ],
                            },
                        ],
                    },
                    resource: { name: 'resource name value' },
                }),
            ).toBe('meta.initial');
        });
        it('should return precomputed value when field is precomputed', () => {
            expect(
                getFieldValue({
                    type: 'view',
                    meta: {
                        initial: 'meta.initial',
                    },
                    field: {
                        name: 'name',
                        transformers: [
                            {
                                operation: 'PRECOMPUTED',
                                args: [
                                    {
                                        name: 'routine',
                                        value: 'precomputed value',
                                    },
                                ],
                            },
                        ],
                    },
                    resource: { name: 'resource name value' },
                }),
            ).toBe('precomputed value');
        });
        it('should return and empty string when field format is fieldClone', () => {
            expect(
                getFieldValue({
                    type: 'view',
                    meta: {
                        initial: 'meta.initial',
                    },
                    field: {
                        name: 'name',
                        format: {
                            name: 'fieldClone',
                        },
                        transformers: [
                            {
                                operation: 'PRECOMPUTED',
                                args: [
                                    {
                                        name: 'routine',
                                        value: 'precomputed value',
                                    },
                                ],
                            },
                        ],
                    },
                    resource: { name: 'resource name value' },
                }),
            ).toBe('');
        });
        it('should return resource[field.name] by default', () => {
            expect(
                getFieldValue({
                    type: 'view',
                    meta: {
                        initial: 'meta.initial',
                    },
                    field: {
                        name: 'name',
                        format: {
                            name: 'test',
                        },
                        transformers: [],
                    },
                    resource: { name: 'resource name value' },
                }),
            ).toBe('resource name value');
        });
    });
});
