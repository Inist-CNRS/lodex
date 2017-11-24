import expect, { createSpy } from 'expect';
import EventEmitter from 'events';
import { exportFileMiddleware } from './export';
import config from '../../../../config.json';

describe('export routes', () => {
    describe('exportMiddleware', () => {
        const characteristics = [
            { name: 'characteristic1', value: 'characteristic1_value' },
        ];
        const resultStream = new EventEmitter();
        const exporterStreamFactory = createSpy().andReturn(resultStream);
        exporterStreamFactory.mimeType = 'a_mime_type';
        exporterStreamFactory.extension = 'foo';
        exporterStreamFactory.type = 'file';

        const fields = [
            { name: 'field1', cover: 'collection' },
            { name: 'characteristic1', cover: 'dataset' },
        ];
        const mongoStream = { mongoStream: true };

        const ctx = {
            db: {
                close: createSpy(),
            },
            request: {
                query: {},
            },
            field: {
                findAll: createSpy().andReturn(fields),
                findSearchableNames: createSpy().andReturn([]),
                findFacetNames: createSpy().andReturn([]),
            },
            getExporter: createSpy().andReturn(exporterStreamFactory),
            publishedCharacteristic: {
                findAllVersions: createSpy().andReturn(
                    Promise.resolve(characteristics),
                ),
            },
            publishedDataset: {
                getFindAllStream: createSpy().andReturn(mongoStream),
            },
            set: createSpy(),
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
                'Content-disposition',
                'attachment; filename=export.foo',
            );
        });

        it('it set the Content-type header', () => {
            expect(ctx.type).toEqual(exporterStreamFactory.mimeType);
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

        it('it should close the db when resultStream emits an `end` event', () => {
            resultStream.emit('end');
            expect(ctx.db.close).toHaveBeenCalled();
        });

        it('it should close the db when resultStream emits an `error` event', () => {
            resultStream.emit('error');
            expect(ctx.db.close).toHaveBeenCalled();
        });
    });
});
