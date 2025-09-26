// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'config'. Did you mean to set t... Remove this comment to see the full error message
import config from 'config';
// @ts-expect-error TS(2792): Cannot find module 'koa-cache-control'. Did you me... Remove this comment to see the full error message
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
        maxAge: config.cache.maxAge,
    }),
);
app.use(route.get('/:locale*', getTranslations));

export default app;
