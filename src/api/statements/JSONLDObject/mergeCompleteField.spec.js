import expect from 'expect';
import mergeCompleteField from './mergeCompleteField';

describe('JSONLDObject / mergeCompleteField', () => {
    it('should throw when no parameters', async () => {
        try {
            await mergeCompleteField();
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when only 1 parameter', async () => {
        try {
            await mergeCompleteField({});
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when only 2 parameters', async () => {
        try {
            await mergeCompleteField({}, {});
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when only 3 parameters', async () => {
        try {
            await mergeCompleteField({}, {}, []);
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when only 4 parameters', async () => {
        try {
            await mergeCompleteField({}, {}, [], {});
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no field.completes', async () => {
        try {
            await mergeCompleteField({}, { name: 'completing' }, [], {});
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no field.name', async () => {
        try {
            await mergeCompleteField({}, { completes: 'completed' }, [], {});
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no fields', async () => {
        try {
            await mergeCompleteField(
                {},
                { completes: 'completed' },
                [],
                {},
            );
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no fields completing', async () => {
        try {
            await mergeCompleteField(
                {},
                { completes: 'completed' },
                [{
                    name: 'completed',
                    scheme: 'scheme1',
                }],
                {},
            );
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no fields completed', async () => {
        try {
            await mergeCompleteField(
                {},
                { completes: 'completed' },
                [{
                    name: 'completing',
                    scheme: 'scheme2',
                }],
                {},
            );
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no data', async () => {
        try {
            await mergeCompleteField(
                {},
                { completes: 'completed' },
                [{
                    name: 'completing',
                    scheme: 'scheme2',
                }, {
                    name: 'completing',
                    scheme: 'scheme2',
                }],
                {},
            );
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no data uri', async () => {
        try {
            await mergeCompleteField(
                {},
                { completes: 'completed' },
                [{
                    name: 'completing',
                    scheme: 'scheme2',
                }, {
                    name: 'completing',
                    scheme: 'scheme2',
                }],
                {
                    completing: 'completing value',
                    completed: 'completed value',
                },
            );
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no data completing', async () => {
        try {
            await mergeCompleteField(
                {},
                { completes: 'completed' },
                [{
                    name: 'completing',
                    scheme: 'scheme2',
                }, {
                    name: 'completing',
                    scheme: 'scheme2',
                }],
                {
                    uri: 'http://uri',
                    completed: 'completed value',
                },
            );
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no data completed', async () => {
        try {
            await mergeCompleteField(
                {},
                { completes: 'completed' },
                [{
                    name: 'completing',
                    scheme: 'scheme2',
                }, {
                    name: 'completing',
                    scheme: 'scheme2',
                }],
                {
                    uri: 'http://uri',
                    completing: 'completing value',
                },
            );
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should return the merged fields', async () => {
        const output = {};
        const field = { name: 'completing', completes: 'completed' };
        const fields = [{
            name: 'completed',
            scheme: 'scheme1',
        }, {
            name: 'completing',
            scheme: 'scheme2',
        }];
        const data = {
            uri: 'http://uri',
            completing: 'completing value',
            completed: 'completed value',
        };
        const res = await mergeCompleteField(output, field, fields, data);
        expect(res).toExist();
        const name = Object.keys(res).find(n => n !== '@context');
        expect(name).toExist();
        expect(res).toEqual({
            '@context': {
                completed: {
                    '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
                },
                completing: {
                    '@id': 'scheme2',
                },
                [name]: {
                    '@id': 'scheme1',
                },
            },
            [name]: {
                '@id': `http://uri#complete/${name}`,
                completed: 'completed value',
                completing: 'completing value',
            },
        });
    });
});
