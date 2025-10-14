import {
    getCsvFieldFactory,
    getDefaultDocuments,
    getLastVersionFactory,
    removeContributions,
} from '../src/convertToCSV';

// import { VALIDATED, REJECTED, PROPOSED } from '../../common/propositionStatus'; // IN LODEX
const [VALIDATED, REJECTED, PROPOSED] = ['VALIDATED', 'REJECTED', 'PROPOSED'];

describe('convertToCSV', () => {
    describe('removeContributions', () => {
        it('should remove PROPOSED contributions', () => {
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
            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(removeContributions(doc, contributions)).toEqual({
                field: 'value',
            });
        });

        it('should remove REJECTED contributions', () => {
            const doc = {
                field: 'value',
                contribution: 'contribution value',
            };
            const contributions = [
                {
                    fieldName: 'contribution',
                    status: REJECTED,
                },
            ];
            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(removeContributions(doc, contributions)).toEqual({
                field: 'value',
            });
        });

        it('should keep VALIDATED contributions', () => {
            const doc = {
                field: 'value',
                contribution: 'contribution value',
            };
            const contributions = [
                {
                    fieldName: 'contribution',
                    status: VALIDATED,
                },
            ];
            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(removeContributions(doc, contributions)).toEqual({
                field: 'value',
                contribution: 'contribution value',
            });
        });
    });

    describe('getCsvField', () => {
        const getCharacteristicByName = (name: any) => `${name}_value`;
        const getCsvField = getCsvFieldFactory(getCharacteristicByName);

        it('should return an object with the specified label', () => {
            const result = getCsvField({
                cover: 'collection',
                label: 'Foo',
                name: 'foo',
            });

            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(result.name).toEqual('foo');
            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(result.label).toEqual('Foo');
        });

        it('should return an object with name as label when label is not specified', () => {
            const result = getCsvField({
                cover: 'collection',
                name: 'foo',
            });

            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(result.name).toEqual('foo');
            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(result.label).toEqual('foo');
        });

        it('should return object with filter returning the field value when field cover is `collection`', () => {
            const result = getCsvField({
                cover: 'collection',
                name: 'foo',
            });

            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(result.filter('bar')).toEqual('bar');
        });

        it('should return object.filter returning getCharacteristicByName result if field cover is dataset', () => {
            const result = getCsvField({
                cover: 'dataset',
                name: 'foo',
            });

            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(result.filter('bar')).toEqual('foo_value');
        });
    });

    describe('getLastVersion', () => {
        it('should call this.queue with resource uri + last version', () => {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            const queue = jest.fn();
            const bindedGetLastVersion = getLastVersionFactory({}).bind({
                queue,
            });

            bindedGetLastVersion({
                uri: 'uri',
                versions: [
                    { version1: 'data1' },
                    { version2: 'data2' },
                    { version3: 'data3' },
                ],
            });

            // @ts-expect-error TS(2339): Property 'toHaveBeenCalledWith' does not exist on ... Remove this comment to see the full error message
            expect(queue).toHaveBeenCalledWith({
                uri: 'uri',
                version3: 'data3',
            });
        });

        it('should remove non validated contribution', () => {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            const queue = jest.fn();
            const bindedGetLastVersion = getLastVersionFactory({}).bind({
                queue,
            });

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

            // @ts-expect-error TS(2339): Property 'toHaveBeenCalledWith' does not exist on ... Remove this comment to see the full error message
            expect(queue).toHaveBeenCalledWith({
                uri: 'uri',
                version4: 'data4',
                validatedContribution: 'value',
            });
        });

        it('should add value from default document', () => {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            const queue = jest.fn();
            const defaultDocument = {
                data: 'defaultValue',
            };
            const bindedGetLastVersion = getLastVersionFactory(
                defaultDocument,
            ).bind({ queue });

            bindedGetLastVersion({
                uri: 'uri',
                versions: [
                    { version1: 'data1' },
                    { version2: 'data2' },
                    { version3: 'data3' },
                ],
            });

            // @ts-expect-error TS(2339): Property 'toHaveBeenCalledWith' does not exist on ... Remove this comment to see the full error message
            expect(queue).toHaveBeenCalledWith({
                uri: 'uri',
                version3: 'data3',
                data: 'defaultValue',
            });
        });

        it('should not add value from default document if they are present', () => {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            const queue = jest.fn();
            const defaultDocument = {
                data: 'defaultValue',
            };
            const bindedGetLastVersion = getLastVersionFactory(
                defaultDocument,
            ).bind({ queue });

            bindedGetLastVersion({
                uri: 'uri',
                versions: [
                    { version1: 'data1' },
                    { version2: 'data2' },
                    { version3: 'data3', data: 'my value' },
                ],
            });

            // @ts-expect-error TS(2339): Property 'toHaveBeenCalledWith' does not exist on ... Remove this comment to see the full error message
            expect(queue).toHaveBeenCalledWith({
                uri: 'uri',
                version3: 'data3',
                data: 'my value',
            });
        });
    });

    describe('getDefaultDocuments', () => {
        it('should create a document containing one empty field', () => {
            const fields = {
                field0: 'value 0',
                field: 'value',
            };
            // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
            expect(getDefaultDocuments(fields)).toEqual({
                field: '',
            });
        });
    });
});
