import Koa from 'koa';
import route from 'koa-route';
import fs from 'fs';
import { unlinkFile } from '../../services/fsHelpers';

const app = new Koa();

const getExportHiddenResources = async ctx => {
    const hiddenResources = await ctx.hiddenResource.findAll();
    const filePath = `/tmp/hiddenResources.json`;
    const stream = fs.createWriteStream(filePath);
    stream.write(JSON.stringify(hiddenResources));
    stream.end();
    await new Promise(resolve => stream.on('finish', resolve));
    stream.on('finish', () => unlinkFile(filePath));

    ctx.set(
        'Content-disposition',
        `attachment; filename="hiddenResources_${new Date().toISOString()}.json"`,
    );
    ctx.set('Content-type', 'application/json');
    ctx.body = fs.createReadStream(filePath);
    ctx.status = 200;
};

app.use(route.get('/export', getExportHiddenResources));

export default app;
