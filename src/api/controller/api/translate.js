import Koa from 'koa';
import route from 'koa-route';

import translations from '../../services/translations';

const getTranslations = async (ctx, locale) => {
    ctx.status = 200;
    ctx.body = translations.getByLanguage(locale);
};

const app = new Koa();
app.use(route.get('/:locale*', getTranslations));

export default app;
