import expect, { createSpy } from 'expect';
import fieldFactory, {
    validateField,
    buildInvalidPropertiesMessage,
    buildInvalidTransformersMessage,
} from './field';
import { URI_FIELD_NAME } from '../../common/uris';
import { COVER_DOCUMENT, COVER_COLLECTION } from '../../common/cover';

describe('field', () => {
    describe('fieldFactory', () => {
        let fieldCollection;
        let db;
        let field;
        beforeEach(async () => {
            fieldCollection = {
                createIndex: createSpy(),
                findOne: createSpy().andReturn(Promise.resolve(null)),
                insertOne: createSpy().andReturn({ insertedId: 'insertedId' }),
                update: createSpy(),
                updateMany: createSpy(),
                find: createSpy().andReturn({
                    sort: () => ({
                        limit: () => ({
                            toArray: () => [
                                {
                                    position: 9,
                                },
                            ],
                        }),
                    }),
                }),
                findOneAndUpdate: createSpy().andReturn(
                    Promise.resolve({ value: 'result' }),
                ),
            };

            db = {
                collection: createSpy().andReturn(fieldCollection),
            };

            field = await fieldFactory(db);

            fieldCollection.insertOne.reset();
            fieldCollection.findOne.reset();
            fieldCollection.findOneAndUpdate.reset();
        });

        it('should call db.collection with `field`', () => {
            expect(db.collection).toHaveBeenCalledWith('field');
        });

        it('should call fieldCollection.createIndex', () => {
            expect(fieldCollection.createIndex).toHaveBeenCalledWith(
                { name: 1 },
                { unique: true },
            );
        });

        describe('field.create', () => {
            it('should call collection.inserOne with given data and a random uid', async () => {
                await field.create({ field: 'data', position: 10 });

                expect(fieldCollection.insertOne.calls.length).toBe(1);
                expect(fieldCollection.insertOne.calls[0].arguments).toMatch([
                    {
                        name: /^[A-Za-z0-9+/]{4}$/,
                        field: 'data',
                        position: 10,
                    },
                ]);
            });

            it('should call collection.inserOne with given data and random uid when given position', async () => {
                await field.create({ field: 'data', position: 15 });

                expect(fieldCollection.insertOne.calls.length).toBe(1);
                expect(fieldCollection.insertOne.calls[0].arguments).toMatch([
                    {
                        name: /^[A-Za-z0-9+/]{4}$/,
                        field: 'data',
                        position: 15,
                    },
                ]);
            });

            it('should call collection.updateMany to update existing columns indexes', async () => {
                await field.create({ field: 'data', position: 15 });

                expect(fieldCollection.updateMany).toHaveBeenCalledWith(
                    {
                        position: { $gte: 15 },
                    },
                    {
                        $inc: { position: 1 },
                    },
                );
            });

            it('should not call collection.updateMany if third argument is false', async () => {
                await field.create(
                    { field: 'data', position: 15 },
                    undefined,
                    false,
                );

                expect(fieldCollection.updateMany.calls.length).toBe(0);
            });

            it('should call collection.findOne with insertedId', async () => {
                await field.create({ field: 'data', position: 15 });

                expect(fieldCollection.findOne).toHaveBeenCalledWith({
                    _id: 'insertedId',
                });
            });
        });

        describe('field.addContributionField', () => {
            it('should call insertOne if no field name when logged', async () => {
                const fieldData = {
                    label: 'label',
                };

                const contributor = { contributor: 'data' };

                await field.addContributionField(
                    fieldData,
                    contributor,
                    true,
                    'nameArg',
                );

                expect(fieldCollection.insertOne).toHaveBeenCalledWith({
                    label: 'label',
                    name: 'nameArg',
                    cover: COVER_DOCUMENT,
                    contribution: true,
                    position: 10,
                    transformers: [
                        {
                            operation: 'COLUMN',
                            args: [
                                {
                                    name: 'column',
                                    type: 'column',
                                    value: 'label',
                                },
                            ],
                        },
                    ],
                });
            });

            it('should call insertOne if no field name with contributor when not logged', async () => {
                const fieldData = {
                    label: 'label',
                    value: 'field value',
                };
                const contributor = { contributor: 'data' };
                await field.addContributionField(
                    fieldData,
                    contributor,
                    false,
                    'nameArg',
                );
                expect(fieldCollection.insertOne).toHaveBeenCalledWith({
                    label: 'label',
                    name: 'nameArg',
                    cover: COVER_DOCUMENT,
                    contribution: true,
                    contributors: [contributor],
                    position: 10,
                    transformers: [
                        {
                            operation: 'COLUMN',
                            args: [
                                {
                                    name: 'column',
                                    type: 'column',
                                    value: 'label',
                                },
                            ],
                        },
                    ],
                });
            });

            it('should call update if field has a name when logged', async () => {
                const fieldData = {
                    label: 'label',
                    value: 'field value',
                    name: 'this field name',
                };
                const contributor = { contributor: 'data' };
                await field.addContributionField(
                    fieldData,
                    contributor,
                    true,
                    'nameArg',
                );
                expect(fieldCollection.update).toHaveBeenCalledWith(
                    {
                        name: 'this field name',
                        contribution: true,
                    },
                    {
                        $set: {
                            label: 'label',
                            cover: COVER_DOCUMENT,
                            contribution: true,
                        },
                    },
                );
            });

            it('should call update if field has a name and adding contributor when not logged', async () => {
                const fieldData = {
                    label: 'label',
                    value: 'field value',
                    name: 'this field name',
                };
                const contributor = { contributor: 'data' };
                await field.addContributionField(
                    fieldData,
                    contributor,
                    false,
                    'nameArg',
                );
                expect(fieldCollection.update).toHaveBeenCalledWith(
                    {
                        name: 'this field name',
                        contribution: true,
                    },
                    {
                        $set: {
                            label: 'label',
                            cover: COVER_DOCUMENT,
                            contribution: true,
                        },
                        $addToSet: {
                            contributors: contributor,
                        },
                    },
                );
            });
        });

        describe('field.initializeModel', () => {
            it('should try to find an existing uri field', async () => {
                await field.initializeModel();

                expect(fieldCollection.findOne).toHaveBeenCalledWith({
                    name: URI_FIELD_NAME,
                });
            });

            it('should create a new uri field if not present', async () => {
                await field.initializeModel();

                expect(fieldCollection.insertOne).toHaveBeenCalledWith({
                    cover: COVER_COLLECTION,
                    label: URI_FIELD_NAME,
                    name: URI_FIELD_NAME,
                    display_on_list: true,
                    transformers: [],
                    position: 0,
                });
            });

            it('should not create a new uri field if present', async () => {
                const fieldCollectionNoUri = {
                    createIndex: createSpy(),
                    findOne: createSpy().andReturn(Promise.resolve({})),
                    insertOne: createSpy(),
                };
                const dbNoUri = {
                    collection: createSpy().andReturn(fieldCollectionNoUri),
                };

                const fieldNoUri = await fieldFactory(dbNoUri);

                await fieldNoUri.initializeModel();

                expect(fieldCollectionNoUri.insertOne).toNotHaveBeenCalled();
            });
        });

        describe('field.getHighestPosition', () => {
            it('should get the highest position field and returns its position', async () => {
                const position = await field.getHighestPosition();

                expect(position).toBe(9);
                expect(fieldCollection.find).toHaveBeenCalledWith(
                    {},
                    { position: 1 },
                );
            });

            it('should return 0 if there is no field', async () => {
                fieldCollection.find = createSpy().andReturn({
                    sort: () => ({
                        limit: () => ({
                            toArray: () => [],
                        }),
                    }),
                });

                const position = await field.getHighestPosition();

                expect(position).toBe(0);
                expect(fieldCollection.find).toHaveBeenCalledWith(
                    {},
                    { position: 1 },
                );
            });
        });

        describe('updatePosition', () => {
            it('should call findOneAndUpdate with to update position of named field', async () => {
                expect(await field.updatePosition('name', 'position')).toBe(
                    'result',
                );
                expect(fieldCollection.findOneAndUpdate).toHaveBeenCalledWith(
                    {
                        name: 'name',
                    },
                    {
                        $set: { position: 'position' },
                    },
                    {
                        returnOriginal: false,
                    },
                );
            });
        });

        describe('findByNames', () => {
            it('should call find all field with names and make a name dictionary', async () => {
                fieldCollection = {
                    createIndex: createSpy(),
                    find: createSpy().andReturn({
                        toArray: () =>
                            Promise.resolve([
                                { name: 'a' },
                                { name: 'b' },
                                { name: 'c' },
                            ]),
                    }),
                };

                db = {
                    collection: createSpy().andReturn(fieldCollection),
                };

                field = await fieldFactory(db);
                expect(await field.findByNames(['b', 'a', 'c'])).toEqual({
                    a: { name: 'a' },
                    b: { name: 'b' },
                    c: { name: 'c' },
                });

                expect(fieldCollection.find).toHaveBeenCalledWith({
                    name: { $in: ['b', 'a', 'c'] },
                });
            });
        });
    });

    describe('validateField', () => {
        it('should return field if valid', async () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN', args: [{ value: 'a' }] }],
            };
            expect(validateField(field)).toEqual(field);
        });

        it('should return field if no transformers', async () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [],
            };
            expect(() => validateField(field)).toThrow(
                buildInvalidPropertiesMessage('label'),
            );
        });

        it('should throw an error if no cover', () => {
            const field = {
                cover: undefined,
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN', args: ['a'] }],
            };

            expect(() => validateField(field)).toThrow(
                buildInvalidPropertiesMessage('label'),
            );
        });

        it('should throw an error if cover is unknown', () => {
            const field = {
                cover: 'invalid_cover',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN', args: ['a'] }],
            };

            expect(() => validateField(field)).toThrow(
                buildInvalidPropertiesMessage('label'),
            );
        });

        it('should throw an error if scheme is not a valid url', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'ftp://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN', args: ['a'] }],
            };

            expect(() => validateField(field)).toThrow(
                buildInvalidPropertiesMessage('label'),
            );
        });

        it('should throw an error if transformer has no args', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN' }],
            };

            expect(() => validateField(field)).toThrow(
                buildInvalidTransformersMessage('label'),
            );
        });

        it('should throw an error if transformer operation has unknow operation', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [
                    { operation: 'COLUMN', args: [] },
                    { operation: 'UNKNOWN', args: [] },
                ],
            };

            expect(() => validateField(field)).toThrow(
                buildInvalidTransformersMessage('label'),
            );
        });

        it('should return field even if no transformers if isContribution is true', async () => {
            const field = {
                cover: 'document',
                label: 'label',
                name: 'name',
                position: 1,
                scheme: 'http://purl.org/dc/terms/title',
            };
            expect(validateField(field, true)).toEqual(field);
        });
    });
});
