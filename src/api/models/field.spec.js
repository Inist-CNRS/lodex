import expect from 'expect';
import {
    validateField,
    buildInvalidPropertiesMessage,
    buildInvalidTransformersMessage,
} from './field';

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
            expect(await validateField(field)).toEqual(field);
        });

        it('should return field if no transformers', async () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [],
            };
            expect(await validateField(field)).toEqual(field);
        });

        it('should throw an error if no cover', (done) => {
            const field = {
                cover: undefined,
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateField(field)
            .then(() => {
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidPropertiesMessage('name'));
                done();
            })
            .catch(done);
        });

        it('should throw an error if cover is unknown', (done) => {
            const field = {
                cover: 'invalid_cover',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateField(field)
            .then(() => {
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidPropertiesMessage('name'));
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

            validateField(field)
            .then(() => {
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidPropertiesMessage('name'));
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

            validateField(field)
            .then(() => {
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidPropertiesMessage('name'));
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

            validateField(field)
            .then(() => {
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidPropertiesMessage());
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

            validateField(field)
            .then(() => { 
field;
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidPropertiesMessage('na'));
                done();
            })
            .catch(done);
        });

        it('should throw an error if scheme is not a valid url', (done) => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'ftp://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            validateField(field)
            .then(() => {
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidPropertiesMessage('name'));
                done();
            })
            .catch(done);
        });

        it('should throw an error if transformer has no args', (done) => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN' },
                ],
            };

            validateField(field)
            .then(() => {
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidTransformersMessage('name'));
                done();
            })
            .catch(done);
        });

        it('should throw an error if transformer operation has unknow operation', (done) => {
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

            validateField(field)
            .then(() => {
                throw new Error('validateField should have thrown an error');
            })
            .catch((error) => {
                expect(error.message).toEqual(buildInvalidTransformersMessage('name'));
                done();
            })
            .catch(done);
        });
    });
});
