import type Koa from 'koa';
import type { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import annotation from '../models/annotation';
import configTenant from '../models/configTenant';
import dataset from '../models/dataset';
import enrichment, { type EnrichmentCollection } from '../models/enrichment';
import field from '../models/field';
import hiddenResource from '../models/hiddenResource';
import precomputed, { type PrecomputedCollection } from '../models/precomputed';
import publishedCharacteristic from '../models/publishedCharacteristic';
import publishedDataset from '../models/publishedDataset';
import publishedFacet from '../models/publishedFacet';
import subresource from '../models/subresource';
import tenant from '../models/tenant';
import mongoClient, { type MongoClientFactory } from './mongoClient';

interface CustomContext extends DefaultContext {
    precomputed: PrecomputedCollection;
    enrichment: EnrichmentCollection;
    // Add other custom context properties here
}

export type AppContext<
    RequestBody = void,
    ResponseBody = unknown,
> = ParameterizedContext<
    DefaultState,
    DefaultContext & CustomContext & { request: { body: RequestBody } },
    ResponseBody
>;

export const mongoClientFactory =
    (mongoClientImpl: MongoClientFactory) =>
    async (ctx: Koa.Context, next: (ctx?: Koa.Context) => Promise<void>) => {
        ctx.db = await mongoClientImpl(ctx.tenant);
        ctx.annotation = await annotation(ctx.db);
        ctx.dataset = await dataset(ctx.db);
        ctx.field = await field(ctx.db);
        ctx.subresource = await subresource(ctx.db);
        ctx.enrichment = await enrichment(ctx.db);
        ctx.precomputed = await precomputed(ctx.db);
        ctx.publishedCharacteristic = await publishedCharacteristic(ctx.db);
        ctx.publishedDataset = await publishedDataset(ctx.db);
        ctx.publishedFacet = await publishedFacet(ctx.db);
        ctx.configTenantCollection = await configTenant(ctx.db);
        ctx.hiddenResource = await hiddenResource(ctx.db);

        await next();
    };

export const getPrecomputedCollectionForWebHook = async (tenant: any) => {
    const db = await mongoClient(tenant);
    return await precomputed(db);
};

export const mongoRootAdminClient = async (ctx: any, next: any) => {
    ctx.rootAdminDb = await mongoClient('admin');
    ctx.tenantCollection = await tenant(ctx.rootAdminDb);
    await next();
};

export default mongoClientFactory(mongoClient);

declare module 'koa' {
    interface Context {
        dataset: Awaited<ReturnType<typeof dataset>>;
        precomputed: Awaited<ReturnType<typeof precomputed>>;
    }
}
