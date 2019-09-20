import jsonConfig from '../../../../config.json';

export const leftMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'left',
);
export const rightMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'right',
);
export const advancedMenu = jsonConfig.front.menu.filter(
    ({ position }) =>
        position === 'advanced' || position === 'top' || position === 'bottom',
);

export const customRoutes = jsonConfig.front.menu
    .filter(({ role }) => role === 'custom')
    .map(({ link }) => link);

export const advancedMenuButton = jsonConfig.front.advancedMenuButton;

export default async ctx => {
    ctx.body = {
        leftMenu,
        rightMenu,
        advancedMenu,
        advancedMenuButton,
        customRoutes,
    };
};
