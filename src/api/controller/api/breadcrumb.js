import jsonConfig from '../../../../config.json';

export const breadcrumb = jsonConfig.front.breadcrumb;

export default async ctx => {
    ctx.body = {
        breadcrumb,
    };
};
