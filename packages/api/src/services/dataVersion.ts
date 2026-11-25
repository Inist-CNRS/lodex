import type { Context, Next } from 'koa';

// The version of the data of each tenant: it changes after any write (a write
// of an admin, the end of a job), so that the browsers keep what the
// routines returned until then, and ask for it again after.
// ponytail: in memory, the API runs as a single pm2 instance (see
// workers/index.ts); a restart starts a new version, which costs one
// revalidation. Several instances would need it in Redis.
const startedAt = Date.now();
const versions = new Map<string, number>();

export const getDataVersion = (tenant: string) =>
    versions.get(tenant) ?? startedAt;

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

// POSTs that only read: a page or a search of the resources, a preview
const READ_ONLY_POST = /^\/publishedDataset(\/search)?\/?$|\/preview\/?$/;

// After a successful write of an admin, the browsers ask for the routines
// again. Visitors only read what the routines return (their annotations and
// contributions are not part of it), so their requests never change it: a
// visitor could otherwise keep every routine recomputing.
export const bumpAfterAdminWrite = async (ctx: Context, next: Next) => {
    await next();
    if (
        ctx.state.isAdmin &&
        ctx.method !== 'GET' &&
        ctx.method !== 'HEAD' &&
        !READ_ONLY_POST.test(ctx.path) &&
        ctx.status >= 200 &&
        ctx.status < 300
    ) {
        bumpDataVersion((ctx as any).tenant);
    }
};

// An empty or failed answer may come from a transient failure: the browser
// must not keep it until the next write. No effect once the headers are sent.
export const doNotKeep = (ctx: Pick<Context, 'set' | 'remove'>) => {
    ctx.set('Cache-Control', 'no-store');
    ctx.remove('ETag');
};
