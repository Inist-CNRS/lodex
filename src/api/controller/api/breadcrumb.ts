export default async (ctx: any) => {
    ctx.body = {
        breadcrumb: ctx.configTenant.front.breadcrumb,
    };
};
