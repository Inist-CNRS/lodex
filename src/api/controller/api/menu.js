export default async ctx => {
    ctx.body = {
        leftMenu: ctx.currentConfig.leftMenu,
        rightMenu: ctx.currentConfig.rightMenu,
        advancedMenu: ctx.currentConfig.advancedMenu,
        advancedMenuButton: ctx.currentConfig.advancedMenuButton,
        customRoutes: ctx.currentConfig.customRoutes,
    };
};
