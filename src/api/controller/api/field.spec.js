import { validateField } from '../../models/field';
import indexSearchableFields from '../../services/indexSearchableFields';
import publishFacets from './publishFacets';

import {
    exportFields,
    getAllField,
    importFields,
    patchField,
    patchOverview,
    postField,
    removeField,
    reorderField,
    restoreFields,
    setup,
} from './field';

import {
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../../common/scope';

jest.mock('../../services/indexSearchableFields');

describe('field routes', () => {
    beforeAll(() => {
        indexSearchableFields.mockImplementation(() => null);
    });

    describe('setup', () => {
        it('should add validateField to ctx and call next', async () => {
            const ctx = {};
            const next = jest.fn();

            await setup(ctx, next);

            expect(ctx).toEqual({
                publishFacets,
                validateField,
                restoreFields,
            });
        });

        it('should also set status and body if next is rejected', async () => {
            const ctx = {};
            const next = jest
                .fn()
                .mockImplementation(() => Promise.reject(new Error('Boom')));

            await setup(ctx, next);

            expect(ctx).toEqual({
                publishFacets,
                validateField,
                body: { error: 'Boom' },
                status: 500,
                restoreFields,
            });
        });
    });

    describe('getAllField', () => {
        it('should call ctx.field.findAll and pass the result to ctx.body', async () => {
            const ctx = {
                field: {
                    findAll: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve('all fields'),
                        ),
                },
            };

            await getAllField(ctx);
            expect(ctx.field.findAll).toHaveBeenCalled();
            expect(ctx.body).toBe('all fields');
        });
    });

    describe('exportFields', () => {
        const ctx = {
            req: 'request',
            set: jest.fn(),
            res: 'result',
        };

        beforeEach(() => {
            ctx.set.mockClear();
        });

        it('should return good header infromations', async () => {
            await exportFields(ctx);

            expect(ctx.set.mock.calls[0][0]).toBe('Content-disposition');
            expect(
                ctx.set.mock.calls[0][1].startsWith(
                    'attachment; filename=model_',
                ) && ctx.set.mock.calls[0][1].endsWith('.tar'),
            ).toBeTruthy();

            expect(ctx.set.mock.calls[1]).toEqual([
                'Content-type',
                'application/x-tar',
            ]);
        });

        it('should return 500 in ctx.status and error message in ctx.body on error', async () => {
            await exportFields(ctx);
            expect(ctx.status).toBe(500);
        });
    });

    describe('importFields', () => {
        const ctx = {
            req: 'request',
            set: jest.fn(),
            restoreFields: jest
                .fn()
                .mockImplementation(() => Promise.resolve('RESTORE OK')),
            enrichment: {
                findAll: jest.fn(),
            },
            precomputed: {
                findAll: jest.fn(),
            },
        };
        beforeEach(() => {
            ctx.restoreFields.mockClear();
            ctx.set.mockClear();
            ctx.enrichment.findAll.mockClear();
            ctx.precomputed.findAll.mockClear();
        });

        it('should import fields without enrichments', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            ctx.enrichment.findAll.mockImplementation(() =>
                Promise.resolve([]),
            );
            ctx.precomputed.findAll.mockImplementation(() =>
                Promise.resolve([]),
            );

            await importFields(asyncBusboyImpl)(ctx);
            expect(asyncBusboyImpl).toHaveBeenCalledWith('request');
            expect(ctx.restoreFields).toHaveBeenCalledWith('file0', ctx);
            expect(ctx.status).toBe(200);
            expect(ctx.body.hasEnrichments).toBe(false);
        });

        it('should import fields with enrichments', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            ctx.enrichment.findAll.mockImplementation(() =>
                Promise.resolve(['id: 1']),
            );

            await importFields(asyncBusboyImpl)(ctx);
            expect(asyncBusboyImpl).toHaveBeenCalledWith('request');
            expect(ctx.restoreFields).toHaveBeenCalledWith('file0', ctx);
            expect(ctx.status).toBe(200);
            expect(ctx.body.hasEnrichments).toBe(true);
        });

        it('should import fields with precomputed', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            ctx.precomputed.findAll.mockImplementation(() =>
                Promise.resolve(['id: 1']),
            );

            await importFields(asyncBusboyImpl)(ctx);
            expect(asyncBusboyImpl).toHaveBeenCalledWith('request');
            expect(ctx.restoreFields).toHaveBeenCalledWith('file0', ctx);
            expect(ctx.status).toBe(200);
            expect(ctx.body.hasPrecomputed).toBe(true);
        });

        it('should import fields with precomputed and enrichment', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            ctx.precomputed.findAll.mockImplementation(() =>
                Promise.resolve(['id: 1']),
            );

            ctx.enrichment.findAll.mockImplementation(() =>
                Promise.resolve(['id: 1']),
            );

            await importFields(asyncBusboyImpl)(ctx);
            expect(asyncBusboyImpl).toHaveBeenCalledWith('request');
            expect(ctx.restoreFields).toHaveBeenCalledWith('file0', ctx);
            expect(ctx.status).toBe(200);
            expect(ctx.body.hasPrecomputed).toBe(true);
            expect(ctx.body.hasEnrichments).toBe(true);
        });

        it('should return 500 in ctx.status and error message in ctx.body on error', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            ctx.restoreFields.mockImplementation(() => {
                throw new Error('Error!');
            });

            await importFields(asyncBusboyImpl)(ctx);
            expect(ctx.status).toBe(500);
            expect(ctx.body).toBe('Error!');
        });
    });

    describe('postField', () => {
        it('should insert the new field', async () => {
            const ctx = {
                request: {
                    body: 'new field data',
                },
                field: {
                    create: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve('inserted item'),
                        ),
                },
            };

            await postField(ctx);
            expect(ctx.field.create).toHaveBeenCalledWith('new field data');
            expect(ctx.body).toBe('inserted item');
        });
    });

    describe('patchField', () => {
        const ctx = {
            request: {
                body: {
                    label: 'new label',
                },
            },
            field: {
                updateOneById: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve('update result')),
            },
            publishFacets: jest.fn(),
            publishedDataset: {
                countAll: jest.fn(() => Promise.resolve(1000)),
            },
        };

        beforeEach(() => {
            ctx.field.updateOneById.mockClear();
            ctx.publishFacets.mockClear();
        });

        it('should validateField and then update field', async () => {
            await patchField(ctx, 'id');
            expect(ctx.field.updateOneById).toHaveBeenCalledWith('id', {
                label: 'new label',
            });
            expect(ctx.body).toContain('update result');
        });

        it('update the published facets', async () => {
            await patchField(ctx, 'id');
            expect(ctx.publishFacets).toHaveBeenCalledWith(
                ctx,
                ['update result'],
                false,
            );
        });

        it('should not update the published facets if dataset is not published (publishedDataset = 0)', async () => {
            ctx.publishedDataset.countAll.mockImplementation(() =>
                Promise.resolve(0),
            );
            expect(ctx.publishFacets).toHaveBeenCalledTimes(0);
        });
    });

    describe('patchOverview', () => {
        it('should remove overview from other field with same overview', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: 'id',
                        overview: 200,
                    },
                },
                field: {
                    updateMany: jest.fn(),
                    updateOneById: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve('update result'),
                        ),
                },
            };
            await patchOverview(ctx);
            expect(ctx.field.updateMany).toHaveBeenCalledWith(
                { overview: 200 },
                { $unset: { overview: '' } },
            );
        });

        it('should remove overview from other field with same overview and same subresourceId if subresourceId is set', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: 'id',
                        overview: 200,
                        subresourceId: 'subresourceId',
                    },
                },
                field: {
                    updateMany: jest.fn(),
                    updateOneById: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve('update result'),
                        ),
                },
            };
            await patchOverview(ctx);
            expect(ctx.field.updateMany).toHaveBeenCalledWith(
                { overview: 200, subresourceId: 'subresourceId' },
                { $unset: { overview: '' } },
            );
        });

        it('should update field overview if id is set', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: 'id',
                        overview: 200,
                    },
                },
                field: {
                    updateMany: jest.fn(),
                    updateOneById: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve('update result'),
                        ),
                },
            };
            await patchOverview(ctx);
            expect(ctx.field.updateOneById).toHaveBeenCalledWith('id', {
                overview: 200,
            });
            expect(ctx.body).toContain('update result');
        });

        it('should not update field overview if id is null', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: null,
                        overview: 200,
                    },
                },
                field: {
                    updateMany: jest.fn(),
                    updateOneById: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve('update result'),
                        ),
                },
            };
            await patchOverview(ctx);
            expect(ctx.field.updateOneById).not.toHaveBeenCalled();
            expect(ctx.body).toContain('ok');
        });
    });

    describe('removeField', () => {
        it('should validateField and then update field', async () => {
            const ctx = {
                request: {
                    body: 'updated field data',
                },
                field: {
                    removeById: jest
                        .fn()
                        .mockImplementation(() =>
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
        it('should update field position based on index in array when all scope are dataset', async () => {
            const fieldsByName = {
                a: { scope: SCOPE_DATASET },
                b: { scope: SCOPE_DATASET },
                c: { scope: SCOPE_DATASET },
            };
            const ctx = {
                request: {
                    body: {
                        fields: ['a', 'b', 'c'],
                    },
                },
                field: {
                    updatePosition: jest
                        .fn()
                        .mockImplementation((name) =>
                            Promise.resolve(`updated ${name}`),
                        ),
                    findByNames: jest
                        .fn()
                        .mockImplementation(() => fieldsByName),
                },
            };

            await reorderField(ctx, 'id');

            expect(ctx.field.updatePosition).toHaveBeenCalledWith('a', 1);
            expect(ctx.field.updatePosition).toHaveBeenCalledWith('b', 2);
            expect(ctx.field.updatePosition).toHaveBeenCalledWith('c', 3);

            expect(ctx.body).toEqual(['updated a', 'updated b', 'updated c']);
        });

        it('should update field position based on index in array when all scope are collection or document and first one is uri', async () => {
            const fieldsByName = {
                a: { scope: SCOPE_COLLECTION, name: 'uri' },
                b: { scope: SCOPE_DOCUMENT },
                c: { scope: SCOPE_COLLECTION },
            };
            const ctx = {
                request: {
                    body: {
                        fields: ['a', 'b', 'c'],
                    },
                },
                field: {
                    updatePosition: jest
                        .fn()
                        .mockImplementation((name) =>
                            Promise.resolve(`updated ${name}`),
                        ),
                    findByNames: jest
                        .fn()
                        .mockImplementation(() => fieldsByName),
                },
            };

            await reorderField(ctx, 'id');

            expect(ctx.field.updatePosition).toHaveBeenCalledWith('a', 1);
            expect(ctx.field.updatePosition).toHaveBeenCalledWith('b', 2);
            expect(ctx.field.updatePosition).toHaveBeenCalledWith('c', 3);

            expect(ctx.body).toEqual(['updated a', 'updated b', 'updated c']);
        });

        it('should throw an error if dataset is mixed with other scope', async () => {
            const fieldsByName = {
                a: { scope: SCOPE_DATASET },
                b: { scope: SCOPE_DOCUMENT },
                c: { scope: SCOPE_COLLECTION },
            };
            const ctx = {
                request: {
                    body: {
                        fields: ['a', 'b', 'c'],
                    },
                },
                field: {
                    updatePosition: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve(`updated field`),
                        ),
                    findByNames: jest
                        .fn()
                        .mockImplementation(() => fieldsByName),
                },
            };

            await reorderField(ctx, 'id');

            expect(ctx.status).toBe(400);
            expect(ctx.body.error).toBe(
                'Bad scope: trying to mix home fields with other fields',
            );

            expect(ctx.field.updatePosition).not.toHaveBeenCalled();
        });

        it('should throw an error if graphic is mixed with other scope', async () => {
            const fieldsByName = {
                a: { scope: SCOPE_GRAPHIC },
                b: { scope: SCOPE_DOCUMENT },
                c: { scope: SCOPE_DATASET },
            };
            const ctx = {
                request: {
                    body: {
                        fields: ['a', 'b', 'c'],
                    },
                },
                field: {
                    updatePosition: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve(`updated field`),
                        ),
                    findByNames: jest
                        .fn()
                        .mockImplementation(() => fieldsByName),
                },
            };

            await reorderField(ctx, 'id');

            expect(ctx.status).toBe(400);
            expect(ctx.body.error).toBe(
                'Bad scope: trying to mix graphic fields with other fields',
            );

            expect(ctx.field.updatePosition).not.toHaveBeenCalled();
        });
    });
    afterAll(() => {
        indexSearchableFields.mockClear();
    });
});
