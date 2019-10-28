import { updateCharacteristics, createCharacteristic } from './characteristic';
import { COVER_DATASET } from '../../../common/cover';

describe('characteristic routes', () => {
    describe('updateCharacteristics', () => {
        describe('When no name received', () => {
            const characteristics = {
                foo: 'new foo',
                bar: 'new bar',
                iShouldntBeHere: 'iShouldntBeHere',
            };

            const newVersion = { newVersion: true };

            const ctx = {
                request: {
                    body: characteristics,
                },
                publishedCharacteristic: {
                    addNewVersion: jest
                        .fn()
                        .mockImplementation(() => newVersion),
                    findLastVersion: jest.fn().mockImplementation(() => ({
                        foo: 'foo value',
                        bar: 'bar value',
                        doNotUpdateMe: 'doNotUpdateMe value',
                    })),
                },
                field: {
                    findOneByName: jest.fn(),
                    updateOneById: jest.fn(),
                },
            };

            it('should call ctx.publishedCharacteristic.findLastVersion', async () => {
                await updateCharacteristics(ctx);

                expect(
                    ctx.publishedCharacteristic.findLastVersion,
                ).toHaveBeenCalled();
            });

            it('should not call ctx.field.findOneByName', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.field.findOneByName).not.toHaveBeenCalled();
            });

            it('should call ctx.publishedCharacteristic.addNewVersion with a new version', async () => {
                await updateCharacteristics(ctx);

                expect(
                    ctx.publishedCharacteristic.addNewVersion,
                ).toHaveBeenCalledWith({
                    foo: 'new foo',
                    bar: 'new bar',
                    doNotUpdateMe: 'doNotUpdateMe value',
                });
            });

            it('should set ctx.body to the result of ctx.publishedCharacteristic.addNewVersion', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.body).toEqual({ characteristics: newVersion });
            });
        });

        describe('When name received and updatedField has not a value transformers', () => {
            const characteristics = {
                foo: 'new foo',
                bar: 'new bar',
                covfefe: '', // new covfefe is empty
                iShouldntBeHere: 'iShouldntBeHere',
            };

            const newVersion = { newVersion: true };

            const ctx = {
                request: {
                    body: {
                        ...characteristics,
                        name: 'updatedField',
                    },
                },
                publishedCharacteristic: {
                    addNewVersion: jest
                        .fn()
                        .mockImplementation(() => newVersion),
                    findLastVersion: jest.fn().mockImplementation(() => ({
                        foo: 'foo value',
                        bar: 'bar value',
                        covfefe: 'covfefe value',
                        updatedField: 'updated value',
                        doNotUpdateMe: 'doNotUpdateMe value',
                    })),
                },
                field: {
                    findOneByName: jest.fn().mockImplementation(() => ({
                        _id: 'id',
                        name: 'updatedField',
                        transformers: [
                            {
                                operation: 'COLUMN',
                            },
                        ],
                    })),
                    updateOneById: jest
                        .fn()
                        .mockImplementation(() => 'updatedField'),
                },
            };

            it('should call ctx.field.findOneByName with name', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.field.findOneByName).toHaveBeenCalledWith(
                    'updatedField',
                );
            });

            it('should not call ctx.field.updateOneById', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.field.updateOneById).not.toHaveBeenCalled();
            });

            it('should call ctx.publishedCharacteristic.findLastVersion', async () => {
                await updateCharacteristics(ctx);

                expect(
                    ctx.publishedCharacteristic.findLastVersion,
                ).toHaveBeenCalled();
            });

            it('should call ctx.publishedCharacteristic.addNewVersion with a new version', async () => {
                await updateCharacteristics(ctx);

                expect(
                    ctx.publishedCharacteristic.addNewVersion,
                ).toHaveBeenCalledWith({
                    foo: 'new foo',
                    bar: 'new bar',
                    covfefe: null,
                    updatedField: 'updated value',
                    doNotUpdateMe: 'doNotUpdateMe value',
                });
            });

            it('should set ctx.body to the result of ctx.publishedCharacteristic.addNewVersion and ctx.field.updateOneById', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.body).toEqual({
                    characteristics: newVersion,
                });
            });
        });

        describe('When name received and updatedField has a value transformers', () => {
            const characteristics = {
                foo: 'new foo',
                bar: 'new bar',
                iShouldntBeHere: 'iShouldntBeHere',
                updatedField: 'updated value',
            };

            const newVersion = { newVersion: true };

            const ctx = {
                request: {
                    body: {
                        ...characteristics,
                        name: 'updatedField',
                    },
                },
                publishedCharacteristic: {
                    addNewVersion: jest
                        .fn()
                        .mockImplementation(() => newVersion),
                    findLastVersion: jest.fn().mockImplementation(() => ({
                        foo: 'foo value',
                        bar: 'bar value',
                        updatedField: 'value',
                        doNotUpdateMe: 'doNotUpdateMe value',
                    })),
                },
                field: {
                    findOneByName: jest.fn().mockImplementation(() => ({
                        _id: 'id',
                        name: 'updatedField',

                        transformers: [
                            {
                                operation: 'VALUE',
                                args: [{ value: 'value' }],
                            },
                        ],
                    })),
                    updateOneById: jest
                        .fn()
                        .mockImplementation(() => 'updatedField'),
                    findOne: jest.fn(() => null),
                },
            };

            it('should call ctx.field.findOneByName with name', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.field.findOneByName).toHaveBeenCalledWith(
                    'updatedField',
                );
            });

            it('should call ctx.field.updateOneById with updated field with new value as transformer args.value ', async () => {
                await updateCharacteristics(ctx);
                expect(ctx.field.updateOneById).toHaveBeenCalledWith('id', {
                    _id: 'id',
                    name: 'updatedField',
                    transformers: [
                        {
                            operation: 'VALUE',
                            args: [{ value: 'updated value' }],
                        },
                    ],
                });
            });

            it('should call ctx.publishedCharacteristic.findLastVersion', async () => {
                await updateCharacteristics(ctx);

                expect(
                    ctx.publishedCharacteristic.findLastVersion,
                ).toHaveBeenCalled();
            });

            it('should call ctx.publishedCharacteristic.addNewVersion with a new version', async () => {
                await updateCharacteristics(ctx);

                expect(
                    ctx.publishedCharacteristic.addNewVersion,
                ).toHaveBeenCalledWith({
                    foo: 'new foo',
                    bar: 'new bar',
                    updatedField: 'updated value',
                    doNotUpdateMe: 'doNotUpdateMe value',
                });
            });

            it('should set ctx.body to the result of ctx.publishedCharacteristic.addNewVersion and ctx.field.updateOneById', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.body).toEqual({
                    characteristics: newVersion,
                    field: 'updatedField',
                });
            });
        });

        describe('When name received and updatedField is a composed field with value fields', () => {
            const characteristics = {
                foo: 'new foo',
                bar: 'new bar',
                iShouldntBeHere: 'iShouldntBeHere',
                updatedField: 'updated value',
            };

            const newVersion = { newVersion: true };

            const ctx = {
                request: {
                    body: {
                        ...characteristics,
                        name: 'updatedField',
                    },
                },
                publishedCharacteristic: {
                    addNewVersion: jest
                        .fn()
                        .mockImplementation(() => newVersion),
                    findLastVersion: jest.fn().mockImplementation(() => ({
                        foo: 'old foo',
                        bar: 'bar value',
                        updatedField: 'value',
                        doNotUpdateMe: 'doNotUpdateMe value',
                    })),
                },
                field: {
                    findByNames: jest.fn().mockImplementation(names => {
                        const fields = {};

                        if (names.includes('updateField')) {
                            fields.updatedField = {
                                _id: 'id',
                                name: 'updatedField',
                                transformers: [
                                    {
                                        operation: 'VALUE',
                                        args: [{ value: 'value' }],
                                    },
                                ],
                                composedOf: {
                                    isComposedOf: true,
                                    fields: ['foo', 'bar'],
                                },
                            };
                        }

                        if (names.includes('foo')) {
                            fields.foo = {
                                _id: 'id',
                                name: 'foo',
                                transformers: [
                                    {
                                        operation: 'VALUE',
                                        args: [{ value: 'old foo' }],
                                    },
                                ],
                            };
                        }

                        if (names.includes('bar')) {
                            fields.bar = {
                                _id: 'id',
                                name: 'bar',
                                transformers: [
                                    {
                                        operation: 'VALUE',
                                        args: [{ value: 'old bar' }],
                                    },
                                ],
                            };
                        }

                        return fields;
                    }),
                    findOneByName: jest.fn(() => ({
                        _id: 'id',
                        name: 'updatedField',

                        transformers: [
                            {
                                operation: 'VALUE',
                                args: [{ value: 'value' }],
                            },
                        ],

                        composedOf: {
                            isComposedOf: true,
                            fields: ['foo', 'bar'],
                        },
                    })),
                    updateOneById: jest
                        .fn()
                        .mockImplementation(() => 'updatedField'),
                    findOne: jest.fn(() => null),
                },
            };

            it('should call ctx.field.findOneByName with name', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.field.findOneByName).toHaveBeenCalledWith(
                    'updatedField',
                );
            });

            it('should call ctx.field.updateOneById with updated field with new value as transformer args.value ', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.field.updateOneById).toHaveBeenCalledWith('id', {
                    _id: 'id',
                    name: 'updatedField',
                    transformers: [
                        {
                            operation: 'VALUE',
                            args: [{ value: 'updated value' }],
                        },
                    ],
                    composedOf: {
                        isComposedOf: true,
                        fields: ['foo', 'bar'],
                    },
                });
                expect(ctx.field.updateOneById).toHaveBeenCalledWith('id', {
                    _id: 'id',
                    name: 'foo',
                    transformers: [
                        {
                            operation: 'VALUE',
                            args: [{ value: 'new foo' }],
                        },
                    ],
                });
                expect(ctx.field.updateOneById).toHaveBeenCalledWith('id', {
                    _id: 'id',
                    name: 'bar',
                    transformers: [
                        {
                            operation: 'VALUE',
                            args: [{ value: 'new bar' }],
                        },
                    ],
                });
            });

            it('should call ctx.publishedCharacteristic.findLastVersion', async () => {
                await updateCharacteristics(ctx);

                expect(
                    ctx.publishedCharacteristic.findLastVersion,
                ).toHaveBeenCalled();
            });

            it('should call ctx.publishedCharacteristic.addNewVersion with a new version', async () => {
                await updateCharacteristics(ctx);

                expect(
                    ctx.publishedCharacteristic.addNewVersion,
                ).toHaveBeenCalledWith({
                    foo: 'new foo',
                    bar: 'new bar',
                    updatedField: 'updated value',
                    doNotUpdateMe: 'doNotUpdateMe value',
                });
            });

            it('should set ctx.body to the result of ctx.publishedCharacteristic.addNewVersion and ctx.field.updateOneById', async () => {
                await updateCharacteristics(ctx);

                expect(ctx.body).toEqual({
                    characteristics: newVersion,
                    field: 'updatedField',
                });
            });
        });
    });

    describe('createCharacteristic', () => {
        const characteristics = {
            foo: 'new foo',
            bar: 'new bar',
        };

        const ctx = {
            request: {
                body: {
                    value: 'value',
                    data: 'field data',
                },
            },
            publishedCharacteristic: {
                addNewVersion: jest.fn().mockImplementation(() => ({
                    foo: 'new foo',
                    bar: 'new bar',
                    newField: 'value',
                })),
                findLastVersion: jest
                    .fn()
                    .mockImplementation(() => characteristics),
            },
            field: {
                getHighestPosition: jest.fn().mockImplementation(() => 4),
                create: jest.fn().mockImplementation(() => ({
                    name: 'newField',
                })),
            },
        };

        it('should call ctx.field.create', async () => {
            await createCharacteristic(ctx);
            expect(ctx.field.getHighestPosition).toHaveBeenCalled();
            expect(ctx.field.create).toHaveBeenCalledWith({
                data: 'field data',
                cover: COVER_DATASET,
                position: 5,
                transformers: [
                    {
                        operation: 'VALUE',
                        args: [
                            {
                                name: 'value',
                                type: 'string',
                                value: 'value',
                            },
                        ],
                    },
                ],
            });
        });

        it('should call ctx.publishedCharacteristic.findLastVersion', async () => {
            await createCharacteristic(ctx);
            expect(
                ctx.publishedCharacteristic.findLastVersion,
            ).toHaveBeenCalled();
        });

        it('should call ctx.publishedCharacteristic.addNewVersion with with field.name and value', async () => {
            await createCharacteristic(ctx);
            expect(
                ctx.publishedCharacteristic.addNewVersion,
            ).toHaveBeenCalledWith({
                foo: 'new foo',
                bar: 'new bar',
                newField: 'value',
            });
        });

        it('shopuld set field and characteristics in body', async () => {
            await createCharacteristic(ctx);
            expect(ctx.body).toEqual({
                field: {
                    name: 'newField',
                },
                characteristics: {
                    foo: 'new foo',
                    bar: 'new bar',
                    newField: 'value',
                },
            });
        });
    });
});
