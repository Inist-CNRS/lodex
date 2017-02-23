import expect, { createSpy } from 'expect';
import fieldFactory, {
    validateField,
    buildInvalidPropertiesMessage,
    buildInvalidTransformersMessage,
} from './field';

describe('field', () => {
    describe('fieldFactory', () => {
        const fieldCollection = {
            createIndex: createSpy(),
            insertOne: createSpy(),
        };
        const db = {
            collection: createSpy().andReturn(fieldCollection),
        };
        let field;

        before(async () => {
            field = await fieldFactory(db);
        });

        it('should call db.collection with `field`', () => {
            expect(db.collection).toHaveBeenCalledWith('field');
        });

        it('should call fieldCollection.createIndex', () => {
            expect(fieldCollection.createIndex).toHaveBeenCalledWith({ name: 1 }, { unique: true });
        });

        describe('field.create', () => {
            it('should call collection.inserOne with given data and a random uid', async () => {
                await field.create({ field: 'data' });

                expect(fieldCollection.insertOne.calls.length).toBe(1);
                expect(fieldCollection.insertOne.calls[0].arguments).toMatch([{
                    name: /^[A-Za-z0-9]{4}$/,
                    field: 'data',
                }]);
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
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };
            expect(validateField(field)).toEqual(field);
        });

        it('should return field if no transformers', async () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [],
            };
            expect(validateField(field)).toEqual(field);
        });

        it('should throw an error if no cover', () => {
            const field = {
                cover: undefined,
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidPropertiesMessage('name'));
        });

        it('should throw an error if cover is unknown', () => {
            const field = {
                cover: 'invalid_cover',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidPropertiesMessage('name'));
        });

        it('should throw an error if no label', () => {
            const field = {
                cover: 'dataset',
                name: 'name',
                label: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidPropertiesMessage('name'));
        });

        it('should throw an error if label less than ', () => {
            const field = {
                cover: 'dataset',
                label: 'la',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidPropertiesMessage('name'));
        });

        it('should throw an error if no name', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidPropertiesMessage());
        });

        it('should throw an error if name less than ', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'na',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidPropertiesMessage('na'));
        });

        it('should throw an error if scheme is not a valid url', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'ftp://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidPropertiesMessage('name'));
        });

        it('should throw an error if transformer has no args', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN' },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidTransformersMessage('name'));
        });

        it('should throw an error if transformer operation has unknow operation', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: [] },
                    { operation: 'UNKNOWN', args: [] },
                ],
            };

            expect(() => validateField(field)).toThrow(buildInvalidTransformersMessage('name'));
        });

        it('should return field even if transformers is incorrect if isContribution is true', async () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: [] },
                    { operation: 'UNKNOWN', args: [] },
                ],
            };
            expect(validateField(field, true)).toEqual(field);
        });
    });
});
