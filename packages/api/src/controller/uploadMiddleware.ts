import asyncBusboy from '@recuperateur/async-busboy';
import Koa from 'koa';
import config from 'config';
import route from 'koa-route';

import {
    checkFileExists,
    clearChunks,
    getUploadedFileSize,
    mergeChunks,
    saveStreamInFile,
    unlinkFile,
} from '../services/fsHelpers';

export const requestToStream = async (req: any) => {
    const { files, fields } = await asyncBusboy(req);
    files[0].once('close', async () => {
        await unlinkFile(files[0].path);
    });
    return { stream: files[0], fields };
};

export const uploadMiddleware = (routePath: string, saveStream: any) => {
    const app = new Koa();

    const parseRequest = async (ctx: any, ...rest: any) => {
        const next = rest[rest.length - 1];
        const { stream, fields } = await requestToStream(ctx.req);

        const {
            resumableChunkNumber,
            resumableIdentifier,
            resumableTotalChunks,
            resumableTotalSize,
            resumableCurrentChunkSize,
            resumableFilename = '',
        } = fields;

        const extension = resumableFilename.split('.').pop();
        const chunkNumber = parseInt(resumableChunkNumber, 10);

        let uploadDir: string = config.get('uploadDir');
        if (!uploadDir.startsWith('/')) {
            uploadDir = `../../${uploadDir}`;
        }

        ctx.resumable = {
            totalChunks: parseInt(resumableTotalChunks, 10),
            totalSize: parseInt(resumableTotalSize, 10),
            currentChunkSize: parseInt(resumableCurrentChunkSize, 10),
            filename: `${uploadDir}/${ctx.tenant}_${resumableIdentifier}`,
            extension,
            chunkname: `${uploadDir}/${ctx.tenant}_${resumableIdentifier}.${chunkNumber}`,
            stream,
        };
        await next();
    };

    async function uploadChunkMiddleware(ctx: any, ...params: string[]) {
        const {
            chunkname,
            currentChunkSize,
            stream,
            filename,
            totalChunks,
            totalSize,
        } = ctx.resumable;
        if (!(await checkFileExists(chunkname, currentChunkSize))) {
            await saveStreamInFile(stream, chunkname);
        }

        const uploadedFileSize = await getUploadedFileSize(
            filename,
            totalChunks,
        );

        if (uploadedFileSize >= totalSize) {
            try {
                const stream = mergeChunks(filename, totalChunks);

                await saveStream(stream, ctx, ...params);

                await clearChunks(filename, totalChunks);
                ctx.body = { message: 'Imported' };
            } catch (error) {
                ctx.status = 400;
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                ctx.body = { message: error.message };
                return;
            }
        }

        ctx.status = 200;
    }

    const checkChunkMiddleware = async (ctx: any, ...params: string[]) => {
        const {
            resumableChunkNumber,
            resumableTotalChunks,
            resumableIdentifier,
            resumableCurrentChunkSize,
        } = ctx.request.query;
        const chunkNumber = parseInt(resumableChunkNumber, 10);
        const totalChunks = parseInt(resumableTotalChunks, 10);
        const currentChunkSize = parseInt(resumableCurrentChunkSize, 10);
        const filename = `${config.get('uploadDir')}/${ctx.tenant}_${resumableIdentifier}`;
        const chunkname = `${config.get('uploadDir')}/${ctx.tenant}_${resumableIdentifier}.${resumableChunkNumber}`;

        const exists = await checkFileExists(chunkname, currentChunkSize);

        if (exists && chunkNumber === totalChunks) {
            try {
                const stream = mergeChunks(filename, totalChunks);

                await saveStream(stream, ctx, ...params);

                await clearChunks(filename, totalChunks);
                ctx.body = { message: 'Imported' };
            } catch (error) {
                ctx.status = 400;
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                ctx.body = { message: error.message };
                return;
            }
        }
        ctx.status = exists ? 200 : 204;
    };

    app.use(route.post(routePath, parseRequest));
    app.use(route.post(routePath, uploadChunkMiddleware));
    app.use(route.get(routePath, checkChunkMiddleware));

    return app;
};
