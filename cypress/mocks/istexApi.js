import Koa from 'koa';
import route from 'koa-route';
import koaQs from 'koa-qs';
import get from 'lodash.get';
import cors from 'kcors';

const app = koaQs(new Koa());

app.use(cors());

app.use(
    route.get('/document', async ctx => {
        if (get(ctx, 'query.q', '').match('publicationDate:')) {
            ctx.body = {
                total: 61,
                hits: [],
                aggregations: {
                    'host.volume': {
                        buckets: [
                            {
                                key: 52,
                                docCount: 61,
                                rangeAsString: '[52-53]',
                            },
                        ],
                        keyCount: 1,
                    },
                },
            };
        }

        if (get(ctx, 'query.q', '').match('host.issn=')) {
            ctx.body = {
                total: 520,
                hits: [],
                aggregations: {
                    publicationDate: {
                        buckets: [
                            {
                                keyAsString: '1997',
                                key: 852076800000,
                                docCount: 84,
                                rangeAsString: '[1997-1998[',
                            },
                            {
                                keyAsString: '1998',
                                key: 883612800000,
                                docCount: 63,
                                rangeAsString: '[1998-1999[',
                            },
                            {
                                keyAsString: '1999',
                                key: 915148800000,
                                docCount: 61,
                                rangeAsString: '[1999-2000[',
                            },
                            {
                                keyAsString: '2000',
                                key: 946684800000,
                                docCount: 66,
                                rangeAsString: '[2000-2001[',
                            },
                            {
                                keyAsString: '2001',
                                key: 978307200000,
                                docCount: 87,
                                rangeAsString: '[2001-2002[',
                            },
                            {
                                keyAsString: '2002',
                                key: 1009843200000,
                                docCount: 80,
                                rangeAsString: '[2002-2003[',
                            },
                            {
                                keyAsString: '2003',
                                key: 1041379200000,
                                docCount: 79,
                                rangeAsString: '[2003-2004]',
                            },
                        ],
                        keyCount: 7,
                    },
                },
            };
            return;
        }
        console.log(ctx.query);
        ctx.body = {};
    }),
);

app.listen(3011);
