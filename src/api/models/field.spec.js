import expect from 'expect';
import { INVALID_FIELD_MESSAGE, validateFieldFactory } from './field';

describe('field', () => {
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
            expect(await validateFieldFactory(() => true)(field)).toEqual(field);
        });

        it('should return field if no transformers', async () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [],
            };
            expect(await validateFieldFactory(() => true)(field)).toEqual(field);
        });

        it('should throw an error if no cover', (done) => {
            const field = {
                cover: undefined,
                label: 'label',
                name: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateFieldFactory(() => true)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(INVALID_FIELD_MESSAGE);
                done();
            })
            .catch(done);
        });

        it('should throw an error if cover is unknown', (done) => {
            const field = {
                cover: 'invalid_cover',
                label: 'label',
                name: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateFieldFactory(() => true)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(INVALID_FIELD_MESSAGE);
                done();
            })
            .catch(done);
        });

        it('should throw an error if no label', (done) => {
            const field = {
                cover: 'dataset',
                name: 'name',
                label: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateFieldFactory(() => true)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(INVALID_FIELD_MESSAGE);
                done();
            })
            .catch(done);
        });

        it('should throw an error if label less than ', (done) => {
            const field = {
                cover: 'dataset',
                label: 'la',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateFieldFactory(() => true)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(INVALID_FIELD_MESSAGE);
                done();
            })
            .catch(done);
        });

        it('should throw an error if no name', (done) => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateFieldFactory(() => true)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(INVALID_FIELD_MESSAGE);
                done();
            })
            .catch(done);
        });

        it('should throw an error if name less than ', (done) => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'na',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateFieldFactory(() => true)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(INVALID_FIELD_MESSAGE);
                done();
            })
            .catch(done);
        });

        it('should throw an error if schemeService return false', (done) => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'na',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateFieldFactory(() => false)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(INVALID_FIELD_MESSAGE);
                done();
            })
            .catch(done);
        });

        it('should throw an error if transformer has no args', (done) => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'field',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN' },
                ],
            };

            validateFieldFactory(() => true)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(
`Invalid transformer in field at index: 0,
transformer must have a valid operation and an args array`,
                );
                done();
            })
            .catch(done);
        });

        it('should throw an error if transformer operation has unknow operation', (done) => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'field',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: [] },
                    { operation: 'UNKNOWN', args: [] },
                ],
            };

            validateFieldFactory(() => true)(field)
            .then(() => {
                throw new Error('validateFiel should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(
`Invalid transformer in field at index: 1,
transformer must have a valid operation and an args array`,
                );
                done();
            })
            .catch(done);
        });
    });
});
