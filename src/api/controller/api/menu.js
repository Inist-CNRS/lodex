export default async (ctx) => {
    ctx.body = {
        leftMenu: ctx.configTenant.leftMenu,
        rightMenu: ctx.configTenant.rightMenu,
        advancedMenu: ctx.configTenant.advancedMenu,
        advancedMenuButton: ctx.configTenant.advancedMenuButton,
        customRoutes: ctx.configTenant.menu
            .filter(({ role }) => role === 'custom')
            .map(({ link }) => link),
    };
};
