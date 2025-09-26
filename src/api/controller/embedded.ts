// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';

export const getFieldAndLatestValue = async (ctx: any) => {
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

app.use(route.get('/', getFieldAndLatestValue));

export default app;
