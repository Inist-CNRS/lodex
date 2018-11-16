import Koa from 'koa';
import route from 'koa-route';

import repositoryMiddleware from '../services/repositoryMiddleware';

export const getFieldAndLatestValue = async ctx => {
    const { uri, fieldName } = ctx.query;

    const [resource, field] = await Promise.all([
        ctx.publishedDataset.findByUri(uri),
        ctx.field.findByName(fieldName),
    ]);

    if (!resource || !field) {
        ctx.status = 404;
        return;
    }

    const lastestVersion = resource.versions[resource.versions.length - 1];

    ctx.body = {
        value: lastestVersion[field.name],
        field,
    };
};

const app = new Koa();

app.use(repositoryMiddleware);

app.use(route.get('/', getFieldAndLatestValue));

export default app;
