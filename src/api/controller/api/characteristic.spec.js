import expect, { createSpy } from 'expect';
import { updateCharacteristics, createCharacteristic } from './characteristic';
import { COVER_DATASET } from '../../../common/cover';

describe('characteristic routes', () => {
    describe('updateCharacteristics', () => {
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
                addNewVersion: createSpy().andReturn(newVersion),
                findLastVersion: createSpy().andReturn({
                    foo: 'foo value',
                    bar: 'bar value',
                    doNotUpdateMe: 'doNotUpdateMe value',
                }),
            },
        };

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
                doNotUpdateMe: 'doNotUpdateMe value',
            });
        });

        it('should set ctx.body to the result of ctx.publishedCharacteristic.addNewVersion', async () => {
            await updateCharacteristics(ctx);

            expect(ctx.body).toEqual(newVersion);
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
                addNewVersion: createSpy().andReturn({
                    foo: 'new foo',
                    bar: 'new bar',
                    newField: 'value',
                }),
                findLastVersion: createSpy().andReturn(characteristics),
            },
            field: {
                create: createSpy().andReturn({
                    name: 'newField',
                }),
            },
        };

        it('should call ctx.field.create', async () => {
            await createCharacteristic(ctx);
            expect(ctx.field.create).toHaveBeenCalledWith({
                data: 'field data',
                cover: COVER_DATASET,
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
