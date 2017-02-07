import expect, { createSpy } from 'expect';
import { exportMiddleware } from './export';

describe('export routes', () => {
    describe('exportMiddleware', () => {
        const characteristics = [{ name: 'characteristic1', value: 'characteristic1_value' }];
        const resultStream = { resultStream: true };
        const exporterStreamFactory = createSpy().andReturn(resultStream);
        const fields = [
            { name: 'field1', cover: 'collection' },
            { name: 'characteristic1', cover: 'dataset' },
        ];
        const mongoStream = { mongoStream: true };

        const ctx = {
            field: {
                find: createSpy().andReturn({
                    toArray: () => fields,
                }),
            },
            getExporter: createSpy().andReturn(exporterStreamFactory),
            publishedCharacteristic: {
                find: createSpy().andReturn({
                    toArray: () => characteristics,
                }),
            },
            publishedDataset: {
                find: createSpy().andReturn({
                    stream: () => mongoStream,
                }),
            },
            set: createSpy(),
        };

        it('it should get the exporterStreamFactory', async () => {
            await exportMiddleware(ctx, 'accepted-type');

            expect(ctx.getExporter).toHaveBeenCalledWith('accepted-type');
        });

        it('it should get the characteristics', () => {
            expect(ctx.publishedCharacteristic.find).toHaveBeenCalledWith({});
        });

        it('it should get the publishedDataset', () => {
            expect(ctx.publishedDataset.find).toHaveBeenCalledWith({});
        });

        it('it set the Content-disposition header', () => {
            expect(ctx.set).toHaveBeenCalledWith('Content-disposition', 'attachment; filename=export.csv');
        });

        it('it set the Content-type header', () => {
            expect(ctx.type).toEqual('accepted-type');
        });

        it('it set the status to 200', () => {
            expect(ctx.status).toEqual(200);
        });

        it('it call the exporterStreamFactory', () => {
            expect(exporterStreamFactory).toHaveBeenCalledWith(fields, characteristics, mongoStream);
        });

        it('it set the body the the exported stream', () => {
            expect(ctx.body).toEqual(resultStream);
        });
    });
});
