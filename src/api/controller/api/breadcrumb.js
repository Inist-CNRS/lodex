export default async ctx => {
    ctx.body = {
        breadcrumb: ctx.currentConfig.front.breadcrumb,
    };
};
