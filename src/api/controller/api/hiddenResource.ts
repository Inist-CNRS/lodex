// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'koa-bodyparser'. Did you mean ... Remove this comment to see the full error message
import koaBodyParser from 'koa-bodyparser';
// @ts-expect-error TS(2792): Cannot find module '@recuperateur/async-busboy'. D... Remove this comment to see the full error message
import asyncBusboy from '@recuperateur/async-busboy';
// @ts-expect-error TS(2792): Cannot find module 'mime-types'. Did you mean to s... Remove this comment to see the full error message
import mime from 'mime-types';
import fs from 'fs';

const app = new Koa();

const getExportHiddenResources = async (ctx: any) => {
    const hiddenResources = await ctx.hiddenResource.findAll();
    ctx.body = JSON.stringify(hiddenResources);
    ctx.status = 200;
};

const postImportHiddenResources = async (ctx: any) => {
    const { files } = await asyncBusboy(ctx.req);

    if (files.length !== 1) {
        ctx.status = 400;
        ctx.body = { message: 'File does not exist' };
        return;
    }

    const type = mime.lookup(files[0].filename);
    if (type !== 'application/json') {
        ctx.status = 400;
        ctx.body = { message: 'Wrong mime type, application/json required' };
        return;
    }
    try {
        const file = fs.readFileSync(files[0].path, 'utf8');
        const hiddenResources = JSON.parse(file);
        await ctx.hiddenResource.deleteMany({});
        await ctx.hiddenResource.insertMany(hiddenResources);
        for (const hiddenResource of hiddenResources) {
            await ctx.publishedDataset.hide(
                hiddenResource.uri,
                hiddenResource.reason,
                hiddenResource.date,
            );
        }
    } catch (error) {
        ctx.status = 400;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { message: error.message };
        return;
    }

    ctx.body = { message: 'Imported' };
    ctx.status = 200;
};

app.use(koaBodyParser());
app.use(route.get('/export', getExportHiddenResources));
app.use(route.post('/import', postImportHiddenResources));

export default app;
