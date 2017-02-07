import expect, { createSpy } from 'expect';
import { exportCsvFactory, getCsvFieldFactory } from './exportCsv';

describe('exportCsv', () => {
    describe('getCsvField', () => {
        const getCharacteristicByName = name => ({ value: `${name}_value` });
        const getCsvField = getCsvFieldFactory(getCharacteristicByName);

        it('should return an object with specified label', () => {
            const result = getCsvField({
                cover: 'collection',
                label: 'Foo',
                name: 'foo',
            });

            expect(result.name).toEqual('foo');
            expect(result.label).toEqual('Foo');
        });

        it('should return an object with name as label when label is not specified', () => {
            const result = getCsvField({
                cover: 'collection',
                name: 'foo',
            });

            expect(result.name).toEqual('foo');
            expect(result.label).toEqual('foo');
        });

        it('should return an object with a filter function returning the field value when field has a cover equal to `collection`', () => {
            const result = getCsvField({
                cover: 'collection',
                name: 'foo',
            });

            expect(result.filter('bar')).toEqual('bar');
        });

        it('should return an object with a filter function returning the getCharacteristicByName result when field has a cover equal to `dataset`', () => {
            const result = getCsvField({
                cover: 'dataset',
                name: 'foo',
            });

            expect(result.filter('bar')).toEqual('foo_value');
        });
    });

    describe('exportCsv', () => {
        const resultStream = { resultStream: true };
        const datasetStream = {
            pipe: createSpy().andReturn(resultStream),
        };

        const csvTransformStream = { csvTransformStream: true };
        const csvTransformStreamFactory = createSpy().andReturn(csvTransformStream);

        const exportCsv = exportCsvFactory(csvTransformStreamFactory);
        const fields = [
            { name: 'foo', cover: 'collection' },
            { name: 'bar', cover: 'dataset' },
        ];

        const characteristics = [
            { name: 'bar', value: 'bar_value' },
        ];

        exportCsv(fields, characteristics, datasetStream);

        it('should correctly initialized the csvTransformStream', () => {
            expect(csvTransformStreamFactory).toHaveBeenCalled();

            expect(csvTransformStreamFactory.calls[0].arguments[0].fieldSeparator).toEqual(';');

            const configuredField = csvTransformStreamFactory.calls[0].arguments[0].fields;
            expect(configuredField.length).toEqual(2);

            expect(configuredField[0].name).toEqual('foo');
            expect(configuredField[0].label).toEqual('foo');
            expect(configuredField[0].quoted).toEqual(true);

            expect(configuredField[1].name).toEqual('bar');
            expect(configuredField[1].label).toEqual('bar');
            expect(configuredField[1].quoted).toEqual(true);
        });

        it('should pipe the datasetStream to the csvTransformStream', () => {
            expect(datasetStream.pipe).toHaveBeenCalledWith(csvTransformStream);
        });
    });
});
