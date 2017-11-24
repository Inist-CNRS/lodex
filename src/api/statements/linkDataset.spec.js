import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import statements from './index';
import testOne from './testOne';

ezs.use(statements);

describe('linkDataset', () => {
    it('should return when no uri', done => {
        const stream = from([{}]).pipe(
            ezs('linkDataset', {
                scheme: 'http://scheme',
                datasetClass: 'DataSet',
            }),
        );
        testOne(
            stream,
            output => {
                expect(output).toEqual({});
            },
            done,
        );
    });

    it('should return null when no data', done => {
        const stream = from([]).pipe(
            ezs('linkDataset', {
                uri: 'http://uri',
                scheme: 'http://scheme',
                datasetClass: 'DataSet',
            }),
        );
        testOne(
            stream,
            output => {
                expect(output).toBe(null);
            },
            done,
        );
    });

    it('should return when no data[@context]', done => {
        const stream = from([{}]).pipe(
            ezs('linkDataset', {
                uri: 'http://uri',
                scheme: 'http://scheme',
                datasetClass: 'DataSet',
            }),
        );
        testOne(
            stream,
            output => {
                expect(output).toEqual({});
            },
            done,
        );
    });

    it('should return restructured data', done => {
        const options = {
            uri: 'http://uri',
            scheme: 'http://scheme',
            datasetClass: 'DataSet',
        };
        const data = {
            someData: 'some data',
            dataset: {
                this: 'should',
                be: 'a dataset',
            },
            '@context': {
                dataset: [1, 2],
            },
        };
        const stream = from([data]).pipe(ezs('linkDataset', options));
        testOne(
            stream,
            output => {
                expect(output).toEqual({
                    '@context': {
                        dataset: {
                            0: 1,
                            1: 2,
                            '@id': options.scheme,
                        },
                    },
                    dataset: {
                        '@id': options.uri,
                        '@type': options.datasetClass,
                        this: 'should',
                        be: 'a dataset',
                    },
                    someData: data.someData,
                });
            },
            done,
        );
    });

    it('should return restructured data when no scheme', done => {
        const options = {
            uri: 'http://uri',
            datasetClass: 'DataSet',
        };
        const data = {
            someData: 'some data',
            dataset: {
                this: 'should',
                be: 'a dataset',
            },
            '@context': {
                dataset: [1, 2],
            },
        };
        const stream = from([data]).pipe(ezs('linkDataset', options));
        testOne(
            stream,
            output => {
                expect(output).toEqual({
                    '@context': {
                        dataset: {
                            0: 1,
                            1: 2,
                            '@id': 'http://purl.org/dc/terms/isPartOf',
                        },
                    },
                    dataset: {
                        '@id': options.uri,
                        '@type': options.datasetClass,
                        this: 'should',
                        be: 'a dataset',
                    },
                    someData: data.someData,
                });
            },
            done,
        );
    });

    it('should return restructured data when no datasetClass', done => {
        const options = {
            uri: 'http://uri',
            scheme: 'http://scheme',
        };
        const data = {
            someData: 'some data',
            dataset: {
                this: 'should',
                be: 'a dataset',
            },
            '@context': {
                dataset: [1, 2],
            },
        };
        const stream = from([data]).pipe(ezs('linkDataset', options));
        testOne(
            stream,
            output => {
                expect(output).toEqual({
                    '@context': {
                        dataset: {
                            0: 1,
                            1: 2,
                            '@id': options.scheme,
                        },
                    },
                    dataset: {
                        '@id': options.uri,
                        '@type': '',
                        this: 'should',
                        be: 'a dataset',
                    },
                    someData: data.someData,
                });
            },
            done,
        );
    });
});
