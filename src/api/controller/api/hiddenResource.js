import Koa from 'koa';
import route from 'koa-route';
import fs from 'fs';
import { unlinkFile } from '../../services/fsHelpers';

const app = new Koa();

const getExportHiddenResources = async ctx => {
    const hiddenResources = await ctx.hiddenResource.findAll();
    const date = new Date().getTime();
    const filePath = `/tmp/hiddenResources${date}.json`;
    const stream = fs.createWriteStream(filePath);
    stream.write(JSON.stringify(hiddenResources));
    stream.end();
    stream.on('finish', () => unlinkFile(filePath));
    ctx.body = fs.createReadStream(filePath);
    ctx.status = 200;
};

app.use(route.get('/export', getExportHiddenResources));

export default app;
