import { exportCsvFactory } from './exportCsv';

describe('exportCsv', () => {
    const resultStream = { resultStream: true };
    const lastVersionStream = {
        pipe: jest.fn().mockImplementation(() => resultStream),
    };
    const datasetStream = {
        pipe: jest.fn().mockImplementation(() => lastVersionStream),
    };

    const csvTransformStream = { csvTransformStream: true };
    const csvTransformStreamFactory = jest
        .fn()
        .mockImplementation(() => csvTransformStream);

    const exportCsv = exportCsvFactory(csvTransformStreamFactory);
    const fields = [
        { name: 'foo', cover: 'collection' },
        { name: 'bar', cover: 'dataset' },
    ];

    const characteristics = [{ name: 'bar', value: 'bar_value' }];

    exportCsv({}, fields, characteristics, datasetStream);

    it('should correctly initialized the csvTransformStream', () => {
        expect(csvTransformStreamFactory).toHaveBeenCalled();

        expect(
            csvTransformStreamFactory.mock.calls[0][0].fieldSeparator,
        ).toEqual(';');

        const configuredField =
            csvTransformStreamFactory.mock.calls[0][0].fields;
        expect(configuredField.length).toEqual(2);

        expect(configuredField[0].name).toEqual('foo');
        expect(configuredField[0].label).toEqual('foo');
        expect(configuredField[0].quoted).toEqual(true);

        expect(configuredField[1].name).toEqual('bar');
        expect(configuredField[1].label).toEqual('bar');
        expect(configuredField[1].quoted).toEqual(true);
    });

    it('should pipe the datasetStream  to getLastVersion and then to csvTransformStream', () => {
        expect(datasetStream.pipe).toHaveBeenCalled();
        expect(lastVersionStream.pipe).toHaveBeenCalledWith(csvTransformStream);
    });
});
