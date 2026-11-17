import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';

import getLogger from '../../services/logger';

const MAX_REPORTS_PER_MINUTE_PER_IP = 20;
// Bounds the logs even if X-Forwarded-For is spoofed to rotate ips
const MAX_REPORTS_PER_MINUTE = 300;
let windowEnd = 0;
let totalReports = 0;
const reportsByIp = new Map<string, number>();

// Behind ezmaster's reverse proxy, ctx.request.ip is the proxy:
// the client ip is the last address the proxy appended
export const getClientIp = (ctx: any) =>
    ctx.get('x-forwarded-for').split(',').pop().trim() || ctx.request.ip;

// ponytail: in-memory, per process; move to redis if the api runs on several processes
export const isRateLimited = (ip: string, now = Date.now()) => {
    if (now > windowEnd) {
        reportsByIp.clear();
        totalReports = 0;
        windowEnd = now + 60_000;
    }
    totalReports += 1;
    if (totalReports > MAX_REPORTS_PER_MINUTE) {
        return true;
    }
    const count = (reportsByIp.get(ip) || 0) + 1;
    reportsByIp.set(ip, count);
    return count > MAX_REPORTS_PER_MINUTE_PER_IP;
};

// Mounted before the tenant check and the body parser: rejected reports cost nothing
export const rateLimitClientErrors = async (ctx: any, next: any) => {
    if (isRateLimited(getClientIp(ctx))) {
        ctx.status = 429;
        return;
    }
    await next();
};

const asString = (value: unknown, maxLength: number) =>
    typeof value === 'string' ? value.slice(0, maxLength) : undefined;

// Query strings may contain search terms or tokens: never log them
const stripQueryStrings = (url?: string) => url?.replace(/\?[^#]*/g, '');

export const postClientError = async (ctx: any) => {
    const { message, stack, url, source } = ctx.request.body || {};
    if (typeof message !== 'string' || !message) {
        ctx.status = 400;
        return;
    }

    getLogger(ctx.tenant).error(`[BROWSER] ${message.slice(0, 500)}`, {
        source: asString(source, 50),
        url: stripQueryStrings(asString(url, 500)),
        userAgent: asString(ctx.get('user-agent'), 300),
        stack: asString(stack, 4000),
    });
    ctx.status = 204;
};

const app = new Koa();
// A malformed or too large body ends as a 400 below instead of an error log
app.use(koaBodyParser({ jsonLimit: '10kb', onerror: () => {} }));
app.use(route.post('/', postClientError));

export default app;
