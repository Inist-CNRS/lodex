import Koa from 'koa';
import route from 'koa-route';
import config from 'config';
import cacheControl from 'koa-cache-control';

import translations from '../../services/translations';

const getTranslations = async (ctx, locale) => {
    ctx.status = 200;
    ctx.body = translations.getByLanguage(locale);
};

const app = new Koa();
app.use(
    cacheControl({
        public: true,
        maxAge: config.cache.maxAge,
    }),
);
app.use(route.get('/:locale*', getTranslations));

export default app;
