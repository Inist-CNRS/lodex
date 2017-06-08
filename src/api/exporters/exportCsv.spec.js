import expect, { createSpy } from 'expect';
import through from 'through';

import {
    exportCsvFactory,
    getCsvFieldFactory,
    getLastVersionFactory,
    removeContributions,
} from './ezsLocals/convertToCSV';
import { VALIDATED, REJECTED, PROPOSED } from '../../common/propositionStatus';

describe('exportCsv', () => {
    describe('removeContributions', () => {
        it('should remove contributions field with status proposed', () => {
            const doc = {
                field: 'value',
                contribution: 'contribution value',
            };
            const contributions = [
                {
                    fieldName: 'contribution',
                    status: PROPOSED,
                },
            ];
            expect(removeContributions(doc, contributions)).toEqual({ field: 'value' });
        });

        it('should remove contributions field with status rejected', () => {
            const doc = { field: 'value', contribution: 'contribution value' };
            const contributions = [{ fieldName: 'contribution', status: REJECTED }];
            expect(removeContributions(doc, contributions))
                .toEqual({ field: 'value' });
        });

        it('should keep contributions field that are validated', () => {
            const doc = { field: 'value', contribution: 'contribution value' };
            const contributions = [{ fieldName: 'contribution', status: VALIDATED }];
            expect(removeContributions(doc, contributions))
                .toEqual(doc);
        });
    });

    describe('getCsvField', () => {
        const getCharacteristicByName = name => `${name}_value`;
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

        it('should return object with filter returning the field value when field cover is `collection`', () => {
            const result = getCsvField({
                cover: 'collection',
                name: 'foo',
            });

            expect(result.filter('bar')).toEqual('bar');
        });

        it('should return object.filter returning getCharacteristicByName result if field cover is dataset', () => {
            const result = getCsvField({
                cover: 'dataset',
                name: 'foo',
            });

            expect(result.filter('bar')).toEqual('foo_value');
        });
    });

    describe('getLastVersion', () => {
        it('should call this.queue with resource uri + last version', () => {
            const queue = createSpy();
            const bindedGetLastVersion = getLastVersionFactory({}).bind({ queue });

            bindedGetLastVersion({
                uri: 'uri',
                versions: [
                    { version1: 'data1' },
                    { version2: 'data2' },
                    { version3: 'data3' },
                ],
            });

            expect(queue).toHaveBeenCalledWith({
                uri: 'uri',
                version3: 'data3',
            });
        });

        it('should remove non validated contribution', () => {
            const queue = createSpy();
            const bindedGetLastVersion = getLastVersionFactory({}).bind({ queue });

            bindedGetLastVersion({
                uri: 'uri',
                versions: [
                    {
                        version1: 'data1',
                    },
                    {
                        version2: 'data2',
                        contribution: 'value',
                    },
                    {
                        version3: 'data3',
                        contribution: 'value',
                        validatedContribution: 'value',
                    },
                    {
                        version4: 'data4',
                        contribution: 'value',
                        validatedContribution: 'value',
                        rejectedContribution: 'rejected value',
                    },
                ],
                contributions: [
                    { fieldName: 'contribution', status: PROPOSED },
                    { fieldName: 'validatedContribution', status: VALIDATED },
                    { fieldName: 'rejectedContribution', status: REJECTED },
                ],
            });

            expect(queue).toHaveBeenCalledWith({
                uri: 'uri',
                version4: 'data4',
                validatedContribution: 'value',
            });
        });

        it('should add value from default document', () => {
            const queue = createSpy();
            const defaultDocument = {
                data: 'defaultValue',
            };
            const bindedGetLastVersion = getLastVersionFactory(defaultDocument).bind({ queue });

            bindedGetLastVersion({
                uri: 'uri',
                versions: [
                    { version1: 'data1' },
                    { version2: 'data2' },
                    { version3: 'data3' },
                ],
            });

            expect(queue).toHaveBeenCalledWith({
                uri: 'uri',
                version3: 'data3',
                data: 'defaultValue',
            });
        });

        it('should not add value from default document if they are present', () => {
            const queue = createSpy();
            const defaultDocument = {
                data: 'defaultValue',
            };
            const bindedGetLastVersion = getLastVersionFactory(defaultDocument).bind({ queue });

            bindedGetLastVersion({
                uri: 'uri',
                versions: [
                    { version1: 'data1' },
                    { version2: 'data2' },
                    { version3: 'data3', data: 'my value' },
                ],
            });

            expect(queue).toHaveBeenCalledWith({
                uri: 'uri',
                version3: 'data3',
                data: 'my value',
            });
        });
    });

    describe('exportCsv', () => {
        const resultStream = { resultStream: true };
        const lastVersionStream = {
            pipe: createSpy().andReturn(resultStream),
        };
        const datasetStream = {
            pipe: createSpy().andReturn(lastVersionStream),
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

        exportCsv({}, fields, characteristics, datasetStream);

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

        it('should pipe the datasetStream  to getLastVersion and then to csvTransformStream', () => {
            expect(datasetStream.pipe).toHaveBeenCalledWith(through(getLastVersionFactory({})));
            expect(lastVersionStream.pipe).toHaveBeenCalledWith(csvTransformStream);
        });
    });
});
