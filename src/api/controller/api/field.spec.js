import expect, { createSpy } from 'expect';

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
        it('should insert the new field', async () => {
            const ctx = {
                request: {
                    body: 'new field data',
                },
                field: {
                    findOneById: expect.createSpy().andReturn(Promise.resolve('inserted item')),
                    insertOne: expect.createSpy().andReturn(Promise.resolve({
                        ops: [{ _id: 'foo' }],
                    })),
                },
                validateField: createSpy(),
            };

            await postField(ctx);
            expect(ctx.field.insertOne).toHaveBeenCalledWith('new field data');
            expect(ctx.field.findOneById).toHaveBeenCalledWith('foo');
            expect(ctx.validateField).toHaveBeenCalledWith(ctx.request.body);
            expect(ctx.body).toBe('inserted item');
        });
    });

    describe('putField', () => {
        it('should validateField and then update field', async () => {
            const ctx = {
                request: {
                    body: 'updated field data',
                },
                field: {
                    updateOneById: expect.createSpy().andReturn(Promise.resolve('update result')),
                },
                validateField: createSpy(),
            };

            await putField(ctx, 'id');
            expect(ctx.field.updateOneById).toHaveBeenCalledWith('id', 'updated field data');
            expect(ctx.validateField).toHaveBeenCalledWith(ctx.request.body);
            expect(ctx.body).toBe('update result');
        });
    });

    describe('removeField', () => {
        it('should validateField and then update field', async () => {
            const ctx = {
                request: {
                    body: 'updated field data',
                },
                field: {
                    removeById: expect.createSpy().andReturn(Promise.resolve('deletion result')),
                },
            };

            await removeField(ctx, 'id');
            expect(ctx.field.removeById).toHaveBeenCalledWith('id');
            expect(ctx.body).toBe('deletion result');
        });
    });
});
