import type { Context, Next } from 'koa';

// The version of the data of each tenant: it changes after any write (an API
// write request, the end of a job), so that the browsers keep what the
// routines returned until then, and ask for it again after.
// ponytail: in memory, the API runs as a single pm2 instance (see
// workers/index.ts); a restart starts a new version, which costs one
// revalidation. Several instances would need it in Redis.
const startedAt = Date.now();
const versions = new Map<string, number>();

const getDataVersion = (tenant: string) => versions.get(tenant) ?? startedAt;

export const bumpDataVersion = (tenant: string) => {
    // two writes within the same millisecond still make two versions
    versions.set(tenant, Math.max(Date.now(), getDataVersion(tenant) + 1));
};

// The browser keeps the response but asks for it on each use (no-cache):
// while the data of the tenant is unchanged, it gets a 304 without the
// routine being run.
export const revalidateUntilDataChanges = async (ctx: Context, next: Next) => {
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
        return next();
    }
    const tenant = (ctx as any).tenant;
    ctx.set('Cache-Control', 'no-cache');
    ctx.etag = `${tenant}-${getDataVersion(tenant)}`;
    // ctx.fresh only compares the ETags of a successful response
    ctx.status = 200;
    if (ctx.fresh) {
        ctx.status = 304;
        return;
    }
    return next();
};
