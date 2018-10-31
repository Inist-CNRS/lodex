import jsonConfig from '../../../../config.json';

export const topMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'top',
);
export const bottomMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'bottom',
);

export const customRoutes = jsonConfig.front.menu
    .filter(
        ({ role, link }) => (role !== 'custom' ? false : link.startsWith('/')),
    )
    .map(({ link }) => link);

export default async ctx => {
    ctx.body = {
        topMenu,
        bottomMenu,
        customRoutes,
    };
};
