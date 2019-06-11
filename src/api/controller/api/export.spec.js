import EventEmitter from 'events';
import { exportFileMiddleware } from './export';
import config from '../../../../config.json';

describe('export routes', () => {
    describe('exportMiddleware', () => {
        const characteristics = [
            { name: 'characteristic1', value: 'characteristic1_value' },
        ];
        const resultStream = new EventEmitter();
        resultStream.pipe = jest.fn().mockImplementation(() => resultStream);
        resultStream.resume = jest.fn().mockImplementation(() => resultStream);
        const exporterStreamFactory = jest
            .fn()
            .mockImplementation(() => resultStream);
        exporterStreamFactory.mimeType = 'a_mime_type';
        exporterStreamFactory.extension = 'foo';
        exporterStreamFactory.type = 'file';

        const fields = [
            { name: 'field1', cover: 'collection' },
            { name: 'characteristic1', cover: 'dataset' },
        ];
        const mongoStream = { mongoStream: true };

        const ctx = {
            request: {
                query: {},
            },
            field: {
                findAll: jest.fn().mockImplementation(() => fields),
                findSearchableNames: jest.fn().mockImplementation(() => []),
                findFacetNames: jest.fn().mockImplementation(() => []),
            },
            getExporter: jest
                .fn()
                .mockImplementation(() => exporterStreamFactory),
            publishedCharacteristic: {
                findAllVersions: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve(characteristics)),
            },
            publishedDataset: {
                getFindAllStream: jest
                    .fn()
                    .mockImplementation(() => mongoStream),
            },
            set: jest.fn(),
        };

        it('it should set keepDbOpened to true', async () => {
            await exportFileMiddleware(
                ctx,
                'accepted-type',
                exporterStreamFactory,
                config,
            );

            expect(ctx.keepDbOpened).toEqual(true);
        });

        it('it should get the characteristics', () => {
            expect(
                ctx.publishedCharacteristic.findAllVersions,
            ).toHaveBeenCalled();
        });

        it('it should get the publishedDataset', () => {
            expect(ctx.publishedDataset.getFindAllStream).toHaveBeenCalled();
        });

        it('it set the Content-disposition header', () => {
            expect(ctx.set).toHaveBeenCalledWith(
                'Content-Disposition',
                'attachment; filename="export.foo"',
            );
        });

        it('it set the Content-type header', () => {
            expect(ctx.type).toEqual(
                `${exporterStreamFactory.mimeType}; charset=utf-8`,
            );
        });

        it('it set the status to 200', () => {
            expect(ctx.status).toEqual(200);
        });

        it('it call the exporterStreamFactory', () => {
            expect(exporterStreamFactory).toHaveBeenCalledWith(
                config,
                fields,
                characteristics,
                mongoStream,
                {},
            );
        });

        it('it set the body to the exported stream', () => {
            expect(ctx.body).toEqual(resultStream);
        });

        it('it should close the db when resultStream emits an `error` event', () => {
            resultStream.emit('error');
        });
    });
});
