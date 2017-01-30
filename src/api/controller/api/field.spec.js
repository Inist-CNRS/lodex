import expect from 'expect';

import {
    setup,
    getAllField,
    postField,
    putField,
    removeField,
} from './field';
import { validateField } from '../../models/field';

describe('field routes', () => {
    describe('setup', () => {
        it('should add validateField to ctx and call next', async () => {
            const ctx = {};
            const next = expect.createSpy();

            await setup(ctx, next);

            expect(ctx).toEqual({
                validateField,
            });
        });

        it('should also set status and body if next is rejected', async () => {
            const ctx = {};
            const next = expect.createSpy()
                .andReturn(Promise.reject(new Error('Boom')));

            await setup(ctx, next);

            expect(ctx).toEqual({
                validateField,
                body: 'Boom',
                status: 500,
            });
        });
    });

    describe('getAllField', () => {
        it('should call ctx.field.findAll and pass the result to ctx.body', async () => {
            const ctx = {
                field: {
                    findAll: expect.createSpy().andReturn(Promise.resolve('all fields')),
                },
            };

            await getAllField(ctx);
            expect(ctx.field.findAll).toHaveBeenCalled();
            expect(ctx.body).toBe('all fields');
        });
    });

    describe('postField', () => {
        it('should validateField and then insert new field', async () => {
            const ctx = {
                validateField: expect.createSpy().andReturn('validated field'),
                request: {
                    body: 'new field data',
                },
                field: {
                    insertOne: expect.createSpy().andReturn(Promise.resolve('insertion result')),
                },
            };

            await postField(ctx);
            expect(ctx.validateField).toHaveBeenCalledWith('new field data');
            expect(ctx.field.insertOne).toHaveBeenCalledWith('validated field');
            expect(ctx.body).toBe('insertion result');
        });

        it('should be rejected if validateField throw an error', async () => {
            const ctx = {
                validateField: expect.createSpy().andThrow(new Error('invalid field')),
                request: {
                    body: 'new field data',
                },
                field: {
                    insertOne: expect.createSpy(),
                },
            };

            const error = await postField(ctx)
            .catch(e => e);
            expect(error.message).toBe('invalid field');
            expect(ctx.validateField).toHaveBeenCalledWith('new field data');
            expect(ctx.field.insertOne).toNotHaveBeenCalled();
            expect(ctx.body).toBe(undefined);
        });
    });

    describe('putField', () => {
        it('should validateField and then update field', async () => {
            const ctx = {
                validateField: expect.createSpy().andReturn('validated field'),
                request: {
                    body: 'updated field data',
                },
                field: {
                    updateOneByName: expect.createSpy().andReturn(Promise.resolve('update result')),
                },
            };

            await putField(ctx, 'name');
            expect(ctx.validateField).toHaveBeenCalledWith('updated field data');
            expect(ctx.field.updateOneByName).toHaveBeenCalledWith('name', 'validated field');
            expect(ctx.body).toBe('update result');
        });

        it('should be rejected if validateField throw an error', async () => {
            const ctx = {
                validateField: expect.createSpy().andThrow(new Error('invalid field')),
                request: {
                    body: 'updated field data',
                },
                field: {
                    updateOneByName: expect.createSpy(),
                },
            };

            const error = await postField(ctx)
            .catch(e => e);
            expect(error.message).toBe('invalid field');
            expect(ctx.validateField).toHaveBeenCalledWith('updated field data');
            expect(ctx.field.updateOneByName).toNotHaveBeenCalled();
            expect(ctx.body).toBe(undefined);
        });
    });

    describe('removeField', () => {
        it('should validateField and then update field', async () => {
            const ctx = {
                request: {
                    body: 'updated field data',
                },
                field: {
                    removeByName: expect.createSpy().andReturn(Promise.resolve('deletion result')),
                },
            };

            await removeField(ctx, 'name');
            expect(ctx.field.removeByName).toHaveBeenCalledWith('name');
            expect(ctx.body).toBe('deletion result');
        });
    });
});
