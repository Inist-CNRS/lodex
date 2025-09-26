import Koa from 'koa';
import route from 'koa-route';
import config from 'config';
import cacheControl from 'koa-cache-control';

// @ts-expect-error TS(2306): File '/home/madeorsk/Cloud/Marmelab/Code/lodex/src... Remove this comment to see the full error message
import translations from '../../services/translations';

const getTranslations = async (ctx: any, locale: any) => {
    ctx.status = 200;
    ctx.body = translations.getByLanguage(locale);
};

const app = new Koa();
app.use(
    cacheControl({
        public: true,
        maxAge: config.get('cache.maxAge'),
    }),
);
app.use(route.get('/:locale*', getTranslations));

export default app;
