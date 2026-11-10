import { downloadModelArchive, findCatalogModel } from './catalogModel';

describe('catalogModel', () => {
    describe('findCatalogModel', () => {
        const model = { id: 'a', url: 'https://x/a.tar', loader: 'csv' };

        it('should return the model with the given id', () => {
            expect(findCatalogModel([model], 'a', ['csv'])).toEqual(model);
        });

        it('should return null for an unknown id', () => {
            expect(findCatalogModel([model], 'b', ['csv'])).toBeNull();
        });

        it('should return null when the loader is not available', () => {
            expect(
                findCatalogModel([{ ...model, loader: 'other' }], 'a', ['csv']),
            ).toBeNull();
        });

        it('should return null for an invalid entry', () => {
            expect(
                findCatalogModel([{ ...model, url: 'ftp://x/a.tar' }], 'a', [
                    'csv',
                ]),
            ).toBeNull();
        });

        it('should only consider the first entry of an id', () => {
            expect(
                findCatalogModel(
                    [{ ...model, url: 'ftp://x/a.tar' }, model],
                    'a',
                    ['csv'],
                ),
            ).toBeNull();
        });
    });

    describe('downloadModelArchive', () => {
        it('should return a stream named after the last segment of the url', async () => {
            const fetchMock = jest.fn().mockResolvedValue(new Response('data'));

            const stream = await downloadModelArchive(
                'https://x/path/m.tar',
                fetchMock,
            );

            expect(stream.filename).toBe('m.tar');
            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(Buffer.from(chunk));
            }
            expect(Buffer.concat(chunks).toString()).toBe('data');
        });

        it('should reject when the response is not ok', async () => {
            const fetchMock = jest
                .fn()
                .mockResolvedValue(
                    new Response('', { status: 404, statusText: 'Not Found' }),
                );

            await expect(
                downloadModelArchive('https://x/m.tar', fetchMock),
            ).rejects.toThrow('404');
        });

        it('should reject when the archive is too large', async () => {
            const fetchMock = jest.fn().mockResolvedValue(
                new Response('data', {
                    headers: { 'content-length': '200000000' },
                }),
            );

            await expect(
                downloadModelArchive('https://x/m.tar', fetchMock),
            ).rejects.toThrow('model_archive_too_large');
        });

        it('should reject when a chunked body exceeds the limit', async () => {
            const body = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('12345'));
                    controller.enqueue(new TextEncoder().encode('67890'));
                    controller.close();
                },
            });
            const fetchMock = jest.fn().mockResolvedValue(new Response(body));

            await expect(
                downloadModelArchive('https://x/m.tar', fetchMock, 8),
            ).rejects.toThrow('model_archive_too_large');
        });

        it('should reject when the body errors mid-way', async () => {
            const body = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('12345'));
                    controller.error(new Error('connection reset'));
                },
            });
            const fetchMock = jest.fn().mockResolvedValue(new Response(body));

            await expect(
                downloadModelArchive('https://x/m.tar', fetchMock),
            ).rejects.toThrow('connection reset');
        });
    });
});
