import Koa from 'koa';
import route from 'koa-route';
import koaQs from 'koa-qs';
import get from 'lodash.get';
import cors from 'kcors';

import istexDocuments from './istexDocuments.json';
import istexIssue from './istexIssue.json';
import istexVolume from './istexVolume.json';
import istexYear from './istexYear.json';
import nextPage from './nextPage.json';

const app = koaQs(new Koa());

app.use(cors());

app.use(
    route.get('/document', async ctx => {
        if (get(ctx, 'query.q', '').match('host.issue:')) {
            ctx.body = istexDocuments;
            return;
        }

        if (get(ctx, 'query.q', '').match('host.volume:')) {
            ctx.body = istexIssue;
            return;
        }

        if (get(ctx, 'query.q', '').match('publicationDate:')) {
            ctx.body = istexVolume;
            return;
        }

        if (get(ctx, 'query.q', '').match('host.issn:')) {
            ctx.body = istexYear;
            return;
        }
        ctx.body = {};
    }),
);

app.use(
    route.get('/nextPage', async ctx => {
        ctx.body = nextPage;
    }),
);

app.listen(3011);
