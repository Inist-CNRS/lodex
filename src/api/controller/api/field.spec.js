import expect, { createSpy } from 'expect';

import {
    setup,
    getAllField,
    exportFields,
    exportFieldsReady,
    importFields,
    postField,
    putField,
    removeField,
    reorderField,
} from './field';
import publishFacets from './publishFacets';
import { validateField } from '../../models/field';

describe('field routes', () => {
    describe('setup', () => {
        it('should add validateField to ctx and call next', async () => {
            const ctx = {};
            const next = createSpy();

            await setup(ctx, next);

            expect(ctx).toEqual({
                publishFacets,
                validateField,
            });
        });

        it('should also set status and body if next is rejected', async () => {
            const ctx = {};
            const next = createSpy().andReturn(
                Promise.reject(new Error('Boom')),
            );

            await setup(ctx, next);

            expect(ctx).toEqual({
                publishFacets,
                validateField,
                body: { error: 'Boom' },
                status: 500,
            });
        });
    });

    describe('getAllField', () => {
        it('should call ctx.field.findAll and pass the result to ctx.body', async () => {
            const ctx = {
                field: {
                    findAll: createSpy().andReturn(
                        Promise.resolve('all fields'),
                    ),
                },
            };

            await getAllField(ctx);
            expect(ctx.field.findAll).toHaveBeenCalled();
            expect(ctx.body).toBe('all fields');
        });
    });

    describe('exportFieldsReady', () => {
        it('should call ctx.field.findAll and pass the result with correct transformers', async () => {
            const ctx = {
                field: {
                    findAll: createSpy().andReturn(
                        Promise.resolve([
                            { name: 'field1', label: 'column1', _id: 'id1' },
                            { name: 'field2', label: 'column2', _id: 'id2' },
                        ]),
                    ),
                },
                attachment: createSpy(),
            };

            await exportFieldsReady(ctx);
            expect(ctx.field.findAll).toHaveBeenCalled();
            expect(ctx.body).toEqual(
                JSON.stringify(
                    [
                        {
                            name: 'field1',
                            label: 'column1',
                            transformers: [
                                {
                                    operation: 'COLUMN',
                                    args: [
                                        {
                                            name: 'column',
                                            type: 'column',
                                            value: 'column1',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'field2',
                            label: 'column2',
                            transformers: [
                                {
                                    operation: 'COLUMN',
                                    args: [
                                        {
                                            name: 'column',
                                            type: 'column',
                                            value: 'column2',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    null,
                    4,
                ),
            );
            expect(ctx.attachment).toHaveBeenCalledWith('lodex_model.json');
            expect(ctx.type).toBe('application/json');
        });
    });

    describe('exportFields', () => {
        it('should call ctx.field.findAll and pass the result to ctx.body with correct headers', async () => {
            const ctx = {
                field: {
                    findAll: createSpy().andReturn(
                        Promise.resolve([
                            { name: 'field1', _id: 'id1' },
                            { name: 'field2', _id: 'id2' },
                        ]),
                    ),
                },
                attachment: createSpy(),
            };

            await exportFields(ctx);
            expect(ctx.field.findAll).toHaveBeenCalled();
            expect(ctx.body).toEqual(
                JSON.stringify(
                    [{ name: 'field1' }, { name: 'field2' }],
                    null,
                    4,
                ),
            );
            expect(ctx.attachment).toHaveBeenCalledWith('lodex_export.json');
            expect(ctx.type).toBe('application/json');
        });
    });

    describe('importFields', () => {
        let getUploadedFields;

        beforeEach(() => {
            getUploadedFields = createSpy().andReturn([
                { name: 'field1', label: 'Field 1' },
                { name: 'field2', label: 'Field 2' },
            ]);
        });

        const ctx = {
            req: 'request',
            field: {
                create: createSpy(),
                remove: createSpy(),
            },
        };

        it('should call rawBody', async () => {
            await importFields(getUploadedFields)(ctx);
            expect(getUploadedFields).toHaveBeenCalledWith('request');
        });

        it('should call ctx.field.remove', async () => {
            await importFields(getUploadedFields)(ctx);
            expect(ctx.field.remove).toHaveBeenCalled();
        });

        it('should call ctx.field.create for each field', async () => {
            await importFields(getUploadedFields)(ctx);

            expect(ctx.field.create).toHaveBeenCalledWith(
                { label: 'Field 1', position: 0 },
                'field1',
                false,
            );

            expect(ctx.field.create).toHaveBeenCalledWith(
                { label: 'Field 2', position: 1 },
                'field2',
                false,
            );
        });

        it('should pass the position ctx.field.create if available', async () => {
            getUploadedFields = createSpy().andReturn([
                { name: 'field1', label: 'Field 1', position: 5 },
                { name: 'field2', label: 'Field 2', position: 6 },
            ]);

            await importFields(getUploadedFields)(ctx);

            expect(ctx.field.create).toHaveBeenCalledWith(
                { label: 'Field 1', position: 5 },
                'field1',
                false,
            );

            expect(ctx.field.create).toHaveBeenCalledWith(
                { label: 'Field 2', position: 6 },
                'field2',
                false,
            );
        });

        it('should set ctx.status to 200', async () => {
            await importFields(getUploadedFields)(ctx);
            expect(ctx.status).toEqual(200);
        });
    });

    describe('postField', () => {
        it('should insert the new field', async () => {
            const ctx = {
                request: {
                    body: 'new field data',
                },
                field: {
                    create: createSpy().andReturn(
                        Promise.resolve('inserted item'),
                    ),
                },
            };

            await postField(ctx);
            expect(ctx.field.create).toHaveBeenCalledWith('new field data');
            expect(ctx.body).toBe('inserted item');
        });
    });

    describe('putField', () => {
        const ctx = {
            request: {
                body: {
                    overview: 200,
                },
            },
            field: {
                updateOneById: createSpy().andReturn(
                    Promise.resolve('update result'),
                ),
                findOneAndUpdate: createSpy(),
            },
            publishFacets: createSpy(),
        };

        beforeEach(() => {
            ctx.field.updateOneById.reset();
            ctx.field.findOneAndUpdate.reset();
            ctx.publishFacets.reset();
        });

        it('should remove overview form other field with same overview, if overview is set', async () => {
            await putField(ctx, 'id');
            expect(ctx.field.findOneAndUpdate).toHaveBeenCalledWith(
                { overview: 200 },
                { $unset: { overview: '' } },
            );
            expect(ctx.body).toInclude(['update result']);
        });

        it('should not remove overview form other field with same overview, if overview is not set', async () => {
            await putField(
                {
                    ...ctx,
                    request: {
                        body: {},
                    },
                },
                'id',
            );
            expect(ctx.field.findOneAndUpdate).toNotHaveBeenCalled();
        });

        it('should validateField and then update field', async () => {
            await putField(ctx, 'id');
            expect(ctx.field.updateOneById).toHaveBeenCalledWith('id', {
                overview: 200,
            });
            expect(ctx.body).toInclude(['update result']);
        });

        it('update the published facets', async () => {
            await putField(ctx, 'id');
            expect(ctx.publishFacets).toHaveBeenCalled();
        });
    });

    describe('removeField', () => {
        it('should validateField and then update field', async () => {
            const ctx = {
                request: {
                    body: 'updated field data',
                },
                field: {
                    removeById: createSpy().andReturn(
                        Promise.resolve('deletion result'),
                    ),
                },
            };

            await removeField(ctx, 'id');
            expect(ctx.field.removeById).toHaveBeenCalledWith('id');
            expect(ctx.body).toBe('deletion result');
        });
    });

    describe('reorderField', () => {
        it('should update field position based on index in array', async () => {
            const ctx = {
                request: {
                    query: {
                        fields: {
                            0: 'a',
                            1: 'b',
                            2: 'c',
                        },
                    },
                },
                field: {
                    findOneAndUpdate: createSpy().andReturn(
                        Promise.resolve('update result'),
                    ),
                },
            };

            await reorderField(ctx, 'id');

            expect(ctx.field.findOneAndUpdate).toHaveBeenCalledWith(
                { name: 'a' },
                { $set: { position: 0 } },
            );

            expect(ctx.field.findOneAndUpdate).toHaveBeenCalledWith(
                { name: 'b' },
                { $set: { position: 1 } },
            );

            expect(ctx.field.findOneAndUpdate).toHaveBeenCalledWith(
                { name: 'c' },
                { $set: { position: 2 } },
            );

            expect(ctx.body).toEqual([
                'update result',
                'update result',
                'update result',
            ]);
        });
    });
});
