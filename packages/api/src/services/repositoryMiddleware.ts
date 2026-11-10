import type Koa from 'koa';
import type { Db } from 'mongodb';
import type { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import annotation from '../models/annotation';
import configTenant from '../models/configTenant';
import dataset from '../models/dataset';
import dataSource from '../models/dataSource';
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

const createRepositories = async (db: Db) => {
    const [
        annotationRepository,
        datasetRepository,
        fieldRepository,
        subresourceRepository,
        enrichmentRepository,
        precomputedRepository,
        publishedCharacteristicRepository,
        publishedDatasetRepository,
        publishedFacetRepository,
        configTenantCollection,
        hiddenResourceRepository,
    ] = await Promise.all([
        annotation(db),
        dataset(db),
        field(db),
        subresource(db),
        enrichment(db),
        precomputed(db),
        publishedCharacteristic(db),
        publishedDataset(db),
        publishedFacet(db),
        configTenant(db),
        hiddenResource(db),
    ]);

    return {
        annotation: annotationRepository,
        dataset: datasetRepository,
        field: fieldRepository,
        subresource: subresourceRepository,
        enrichment: enrichmentRepository,
        precomputed: precomputedRepository,
        publishedCharacteristic: publishedCharacteristicRepository,
        publishedDataset: publishedDatasetRepository,
        publishedFacet: publishedFacetRepository,
        configTenantCollection,
        hiddenResource: hiddenResourceRepository,
        dataSource: dataSource(datasetRepository, precomputedRepository),
    };
};

// Building the repositories checks/creates every collection and index (~20 Mongo calls),
// so it is done once per tenant instead of on every request.
// Any code dropping a collection or a database MUST call invalidateRepositories(tenant),
// otherwise the dropped indexes are not recreated until the next restart.
// ponytail: in-memory per process, fine with a single API process; needs a shared signal if PM2 runs several instances.
const repositoriesByTenant = new Map<
    string,
    ReturnType<typeof createRepositories>
>();

export const invalidateRepositories = (tenant: string) => {
    repositoriesByTenant.delete(tenant);
};

export const mongoClientFactory =
    (mongoClientImpl: MongoClientFactory) =>
    async (ctx: Koa.Context, next: (ctx?: Koa.Context) => Promise<void>) => {
        ctx.db = await mongoClientImpl(ctx.tenant);
        if (!repositoriesByTenant.has(ctx.tenant)) {
            repositoriesByTenant.set(
                ctx.tenant,
                createRepositories(ctx.db).catch((error) => {
                    repositoriesByTenant.delete(ctx.tenant);
                    throw error;
                }),
            );
        }
        Object.assign(ctx, await repositoriesByTenant.get(ctx.tenant));

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
        dataSource: Awaited<ReturnType<typeof dataSource>>;
    }
}
