import jsonConfig from '../../../../config.json';

const topMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'top',
);
const bottomMenu = jsonConfig.front.menu.filter(
    ({ position }) => position === 'bottom',
);

const customRoutes = jsonConfig.front.menu
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
