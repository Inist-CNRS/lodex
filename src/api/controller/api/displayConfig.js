import jsonConfig from '../../../../config.json';

export const displayDensity = jsonConfig.front.displayDensity;

export default async ctx => {
    ctx.body = {
        displayDensity,
    };
};
