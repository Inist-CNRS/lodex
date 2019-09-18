import jsonConfig from '../../../../config.json';

export const leftMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'top' || position === 'left',
);
export const rightMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'bottom' || position === 'right',
);
export const advancedMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'advanced',
);

export const customRoutes = jsonConfig.front.menu
    .filter(({ role }) => role === 'custom')
    .map(({ link }) => link);

export default async ctx => {
    ctx.body = {
        leftMenu,
        rightMenu,
        advancedMenu,
        customRoutes,
    };
};
