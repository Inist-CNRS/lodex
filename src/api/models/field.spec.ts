import { MongoClient, ObjectId } from 'mongodb';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { SCOPE_DOCUMENT } from '../../common/scope';
import fieldFactory, {
    buildInvalidPropertiesMessage,
    buildInvalidTransformersMessage,
    validateField,
} from './field';

describe('field', () => {
    describe('fieldFactory', () => {
        const connectionStringURI = process.env.MONGO_URL;
        let fieldCollection: any;
        let db: any;
        let connection: any;

        beforeAll(async () => {
            connection = await MongoClient.connect(connectionStringURI!);
            db = connection.db();
        });

        afterAll(async () => {
            await connection.close();
        });

        beforeEach(async () => {
            await db.dropDatabase();
            fieldCollection = await fieldFactory(db);
        });

        it('should index _id and name', async () => {
            expect(await fieldCollection.listIndexes().toArray()).toStrictEqual(
                [
                    {
                        key: {
                            _id: 1,
                        },
                        name: '_id_',
                        v: 2,
                    },
                    {
                        key: {
                            name: 1,
                        },
                        name: 'name_1',
                        unique: true,
                        v: 2,
                    },
                ],
            );
        });

        describe('field.create', () => {
            it('should call collection.inserOne with given data and a random name', async () => {
                const createdField = await fieldCollection.create({
                    field: 'data',
                    position: 10,
                });

                expect(createdField).toStrictEqual({
                    _id: expect.any(ObjectId),
                    name: expect.stringMatching(/^[A-Za-z0-9+/]{4}$/),
                    field: 'data',
                    position: 10,
                });

                expect(await fieldCollection.find().toArray()).toStrictEqual([
                    createdField,
                ]);
            });
            it('should call collection.inserOne with given data second argument as name', async () => {
                const createdField = await fieldCollection.create(
                    {
                        field: 'data',
                        position: 10,
                    },
                    'notrandom',
                );

                expect(createdField).toStrictEqual({
                    _id: expect.any(ObjectId),
                    name: 'notrandom',
                    field: 'data',
                    position: 10,
                });

                expect(await fieldCollection.find().toArray()).toStrictEqual([
                    createdField,
                ]);
            });

            it('should update the position of all field with greater or equal position', async () => {
                const field1 = await fieldCollection.create({
                    field: 'field1',
                    position: 10,
                });
                const field2 = await fieldCollection.create({
                    field: 'field2',
                    position: 15,
                });
                const field3 = await fieldCollection.create({
                    field: 'field3',
                    position: 16,
                });
                const field4 = await fieldCollection.create({
                    field: 'field4',
                    position: 15,
                });

                expect(
                    await fieldCollection
                        .find(
                            {},
                            {
                                sort: { position: 1 },
                            },
                        )
                        .toArray(),
                ).toStrictEqual([
                    field1,
                    field4,
                    { ...field2, position: 16 },
                    { ...field3, position: 17 },
                ]);
            });

            it('should not update other field position if third argument is false', async () => {
                const field1 = await fieldCollection.create({
                    field: 'field1',
                    position: 10,
                });
                const field2 = await fieldCollection.create({
                    field: 'field2',
                    position: 15,
                });
                const field3 = await fieldCollection.create({
                    field: 'field3',
                    position: 16,
                });
                const field4 = await fieldCollection.create(
                    {
                        field: 'field4',
                        position: 15,
                    },
                    null,
                    false,
                );

                expect(
                    await fieldCollection
                        .find(
                            {},
                            {
                                sort: { position: 1 },
                            },
                        )
                        .toArray(),
                ).toStrictEqual([field1, field2, field4, field3]);
            });
        });

        describe('field.addContributionField', () => {
            it('should create a new field if no field name when logged using field arg', async () => {
                const fieldData = {
                    label: 'label',
                };

                const contributor = { contributor: 'data' };

                const name = await fieldCollection.addContributionField(
                    fieldData,
                    contributor,
                    true,
                    'nameArg',
                );

                expect(name).toBe('nameArg');

                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    {
                        _id: expect.any(ObjectId),
                        label: 'label',
                        name: 'nameArg',
                        scope: SCOPE_DOCUMENT,
                        contribution: true,
                        position: 1,
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
                    },
                ]);
            });

            it('should create a new field if no field name with contributor when not logged', async () => {
                const fieldData = {
                    label: 'label',
                    value: 'field value',
                };
                const contributor = { contributor: 'data' };
                const name = await fieldCollection.addContributionField(
                    fieldData,
                    contributor,
                    false,
                    'nameArg',
                );
                expect(name).toBe('nameArg');

                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    {
                        _id: expect.any(ObjectId),
                        label: 'label',
                        name: 'nameArg',
                        scope: SCOPE_DOCUMENT,
                        contribution: true,
                        contributors: [
                            {
                                contributor: 'data',
                            },
                        ],
                        position: 1,
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
                    },
                ]);
            });

            it('should update existing with given name name and it is already a contribution, but when logged does not update the contributor', async () => {
                const existingField = await fieldCollection.create({
                    label: 'existing label',
                    position: 1,
                    contribution: true,
                    contributors: [{ contributor: 'data' }],
                });
                const fieldData = {
                    label: 'new label',
                    value: 'field value',
                    name: existingField.name,
                };
                await fieldCollection.addContributionField(
                    fieldData,
                    { contributor: 'updated data' },
                    true,
                );
                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    {
                        ...existingField,
                        label: 'new label',
                        scope: 'document',
                    },
                ]);
            });

            it('should not update existing with given name name when logged but it is not a contribution', async () => {
                const contributor = { contributor: 'data' };
                const existingField = await fieldCollection.create({
                    label: 'existing label',
                    position: 1,
                    contribution: false,
                });
                const fieldData = {
                    label: 'new label',
                    value: 'field value',
                    name: existingField.name,
                };
                await fieldCollection.addContributionField(
                    fieldData,
                    contributor,
                    true,
                );
                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    existingField,
                ]);
            });

            it('should update existing if field has a name and adding contributor when not logged', async () => {
                const existingField = await fieldCollection.create({
                    label: 'existing label',
                    position: 1,
                    contribution: true,
                    contributors: [{ contributor: 'old contributor' }],
                });
                const fieldData = {
                    label: 'new label',
                    value: 'field value',
                    name: existingField.name,
                };
                await fieldCollection.addContributionField(
                    fieldData,
                    { contributor: 'new contributor' },
                    false,
                );
                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    {
                        ...existingField,
                        contributors: [
                            { contributor: 'old contributor' },
                            { contributor: 'new contributor' },
                        ],
                        label: 'new label',
                        scope: 'document',
                    },
                ]);
            });
        });

        describe('field.initializeModel', () => {
            it('should create a new uri field if none exists', async () => {
                expect(await fieldCollection.find({}).toArray()).toStrictEqual(
                    [],
                );
                await fieldCollection.initializeModel();
                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    {
                        _id: expect.any(ObjectId),
                        label: 'uri',
                        name: 'uri',
                        position: 0,
                        scope: 'collection',
                        transformers: [
                            {
                                args: [],
                                operation: 'AUTOGENERATE_URI',
                            },
                        ],
                    },
                ]);
            });

            it('should not create a new uri field if one is present', async () => {
                const uriField = await fieldCollection.create(
                    {
                        label: 'uri',
                        position: 0,
                        scope: 'collection',
                        transformers: [
                            {
                                args: [],
                                operation: 'AUTOGENERATE_URI',
                            },
                        ],
                    },
                    'uri',
                );

                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    uriField,
                ]);
                await fieldCollection.initializeModel();
                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    uriField,
                ]);
            });
        });

        describe('field.getHighestPosition', () => {
            it('should return the position of the field with the highest one', async () => {
                await fieldCollection.create({ position: 1 });
                await fieldCollection.create({ position: 10 });
                const position = await fieldCollection.getHighestPosition();

                expect(position).toBe(10);
            });

            it('should return 0 if there is no field', async () => {
                const position = await fieldCollection.getHighestPosition();

                expect(position).toBe(0);
            });
        });

        describe('updatePosition', () => {
            it('should update position of named field', async () => {
                const field = await fieldCollection.create({
                    position: 1,
                });
                const updatedField = await fieldCollection.updatePosition(
                    field.name,
                    42,
                );
                expect(await fieldCollection.find({}).toArray()).toStrictEqual([
                    { ...field, position: 42 },
                ]);
                expect(updatedField).toStrictEqual({
                    ...field,
                    position: 42,
                });
            });
        });

        describe('findByNames', () => {
            it('should call find all field with names and make a name dictionary', async () => {
                const fieldA = await fieldCollection.create(
                    {
                        position: 1,
                    },
                    'a',
                );
                const fieldB = await fieldCollection.create(
                    {
                        position: 2,
                    },
                    'b',
                );
                const fieldC = await fieldCollection.create(
                    {
                        position: 3,
                    },
                    'c',
                );
                await fieldCollection.create(
                    {
                        position: 4,
                    },
                    'd',
                );
                expect(
                    await fieldCollection.findByNames(['b', 'a', 'c']),
                ).toStrictEqual({
                    a: fieldA,
                    b: fieldB,
                    c: fieldC,
                });
            });
        });

        describe('findByName', () => {
            it('should find the field with the right name', async () => {
                const field1 = await fieldCollection.create({
                    position: 1,
                });
                const field2 = await fieldCollection.create({
                    position: 2,
                });
                expect(
                    await fieldCollection.findByName(field1.name),
                ).toStrictEqual(field1);
                expect(
                    await fieldCollection.findByName(field2.name),
                ).toStrictEqual(field2);
            });
            it('should return undefined if no field with the given name exist', async () => {
                await fieldCollection.create({
                    position: 1,
                });
                expect(await fieldCollection.findByName('404')).toBeUndefined();
            });
        });

        describe('findResourceTitle', () => {
            it('should return the field with overview 1', async () => {
                const titleField = await fieldCollection.create({
                    position: 1,
                    labe: 'title',
                    overview: 1,
                });
                await fieldCollection.create({
                    position: 2,
                    overview: 0,
                });
                expect(await fieldCollection.findResourceTitle()).toStrictEqual(
                    titleField,
                );
            });

            it('should return null if no field as overviw at 1', async () => {
                await fieldCollection.create({
                    position: 1,
                    overview: 2,
                });
                await fieldCollection.create({
                    position: 2,
                    overview: 0,
                });
                expect(await fieldCollection.findResourceTitle()).toBeNull();
            });
        });

        describe('findSubResourceTitles', () => {
            it('should return many fields with overview 5', async () => {
                const titleField = await fieldCollection.create({
                    position: 1,
                    labe: 'title',
                    overview: 5,
                });
                await fieldCollection.create({
                    position: 2,
                    overview: 0,
                });
                expect(
                    await fieldCollection.findSubResourceTitles(),
                ).toStrictEqual([titleField]);
            });

            it('should return an empty array if no fields with overview 5', async () => {
                await fieldCollection.create({
                    position: 1,
                    overview: 2,
                });
                await fieldCollection.create({
                    position: 2,
                    overview: 0,
                });
                expect(
                    await fieldCollection.findSubResourceTitles(),
                ).toHaveLength(0);
            });
        });

        describe('findManyByIds', () => {
            it('should return an empty object when no fields found', async () => {
                expect(await fieldCollection.findManyByIds([])).toStrictEqual(
                    {},
                );
            });
            it('should return matching field by their ids', async () => {
                const field1 = await fieldCollection.create({
                    position: 1,
                });
                const field2 = await fieldCollection.create({
                    position: 2,
                });
                await fieldCollection.create({
                    position: 3,
                });
                expect(
                    await fieldCollection.findManyByIds([
                        field2._id,
                        field1._id,
                    ]),
                ).toStrictEqual({
                    [field1._id]: field1,
                    [field2._id]: field2,
                });
            });
        });

        describe('findIdsByLabel', () => {
            it('should return a list of ids for every fields matching given label', async () => {
                const field1 = await fieldCollection.create({
                    position: 1,
                    label: 'a label',
                });
                const field2 = await fieldCollection.create({
                    position: 2,
                    label: 'another label',
                });
                const field3 = await fieldCollection.create({
                    position: 2,
                    label: 'something else',
                });

                expect(
                    await fieldCollection.findIdsByLabel('label'),
                ).toStrictEqual([field1._id.toString(), field2._id.toString()]);
                expect(
                    await fieldCollection.findIdsByLabel('else'),
                ).toStrictEqual([field3._id.toString()]);
                expect(
                    await fieldCollection.findIdsByLabel('not found'),
                ).toStrictEqual([]);
            });
        });

        describe('findIdsByName', () => {
            it('should return a list of ids for every fields matching given internalName', async () => {
                const field1 = await fieldCollection.create({
                    position: 1,
                    internalName: 'an internal name',
                });
                const field2 = await fieldCollection.create({
                    position: 2,
                    internalName: 'another internal name',
                });
                const field3 = await fieldCollection.create({
                    position: 2,
                    internalName: 'something else',
                });

                expect(
                    await fieldCollection.findIdsByInternalName('internal'),
                ).toStrictEqual([field1._id.toString(), field2._id.toString()]);
                expect(
                    await fieldCollection.findIdsByInternalName('else'),
                ).toStrictEqual([field3._id.toString()]);
                expect(
                    await fieldCollection.findIdsByInternalName('not found'),
                ).toStrictEqual([]);
            });

            it('should return a list of ids for every fields with given name', async () => {
                const field1 = await fieldCollection.create(
                    {
                        position: 1,
                    },
                    'nAmE',
                );
                const field2 = await fieldCollection.create(
                    {
                        position: 2,
                    },
                    'hGaV',
                );
                await fieldCollection.create(
                    {
                        position: 3,
                    },
                    'Yhko',
                );

                expect(
                    await fieldCollection.findIdsByName('nAmE'),
                ).toStrictEqual([field1._id.toString()]);
                expect(
                    await fieldCollection.findIdsByName('hGaV'),
                ).toStrictEqual([field2._id.toString()]);
                expect(
                    await fieldCollection.findIdsByName('not found'),
                ).toStrictEqual([]);
            });
        });

        describe('findIdsByInternalScopes', () => {
            it('should return a list of ids for every fields matching given scope', async () => {
                const field1 = await fieldCollection.create({
                    position: 1,
                    internalScopes: ['dataset', 'document'],
                });
                await fieldCollection.create({
                    position: 2,
                    internalScopes: [],
                });
                const field3 = await fieldCollection.create({
                    position: 2,
                    internalScopes: ['home', 'document'],
                });

                expect(
                    await fieldCollection.findIdsByInternalScopes('document'),
                ).toStrictEqual([field1._id.toString(), field3._id.toString()]);
                expect(
                    await fieldCollection.findIdsByInternalScopes('dataset'),
                ).toStrictEqual([field1._id.toString()]);
                expect(
                    await fieldCollection.findIdsByInternalScopes('chart'),
                ).toStrictEqual([]);
            });
        });
    });

    describe('validateField', () => {
        it('should return field if valid', async () => {
            const field = {
                scope: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN', args: [{ value: 'a' }] }],
            };
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(validateField(field)).toEqual(field);
        });

        it('should return field if no transformers', async () => {
            const field = {
                scope: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [],
            };
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(() => validateField(field)).toThrow(
                buildInvalidPropertiesMessage('label'),
            );
        });

        it('should throw an error if no scope', () => {
            const field = {
                scope: undefined,
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN', args: ['a'] }],
            };

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(() => validateField(field)).toThrow(
                buildInvalidPropertiesMessage('label'),
            );
        });

        it('should throw an error if scope is unknown', () => {
            const field = {
                scope: 'invalid_scope',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN', args: ['a'] }],
            };

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(() => validateField(field)).toThrow(
                buildInvalidPropertiesMessage('label'),
            );
        });

        it('should throw an error if scheme is not a valid url', () => {
            const field = {
                scope: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'ftp://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN', args: ['a'] }],
            };

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(() => validateField(field)).toThrow(
                buildInvalidPropertiesMessage('label'),
            );
        });

        it('should throw an error if transformer has no args', () => {
            const field = {
                scope: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [{ operation: 'COLUMN' }],
            };

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(() => validateField(field)).toThrow(
                buildInvalidTransformersMessage('label'),
            );
        });

        it('should throw an error if transformer operation has unknown operation', () => {
            const field = {
                scope: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                position: 1,
                transformers: [
                    { operation: 'COLUMN', args: [] },
                    { operation: 'UNKNOWN', args: [] },
                ],
            };

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(() => validateField(field)).toThrow(
                buildInvalidTransformersMessage('label'),
            );
        });

        it('should return field even if no transformers if isContribution is true', async () => {
            const field = {
                scope: 'document',
                label: 'label',
                name: 'name',
                position: 1,
                scheme: 'http://purl.org/dc/terms/title',
            };
            expect(validateField(field, true)).toEqual(field);
        });
    });
});
