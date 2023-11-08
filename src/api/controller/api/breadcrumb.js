export default async ctx => {
    ctx.body = {
        breadcrumb: ctx.configTenant.front.breadcrumb,
    };
};
