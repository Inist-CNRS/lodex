export default async (ctx: any) => {
    ctx.body = {
        leftMenu: ctx.configTenant.leftMenu,
        rightMenu: ctx.configTenant.rightMenu,
        advancedMenu: ctx.configTenant.advancedMenu,
        advancedMenuButton: ctx.configTenant.advancedMenuButton,
        customRoutes: ctx.configTenant.menu
            .filter(({ role }: any) => role === 'custom')
            .map(({ link }: any) => link),
    };
};
