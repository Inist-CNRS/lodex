import annotation from '../models/annotation';
import configTenant from '../models/configTenant';
import dataset from '../models/dataset';
import enrichment from '../models/enrichment';
import field from '../models/field';
import hiddenResource from '../models/hiddenResource';
import precomputed from '../models/precomputed';
import publishedCharacteristic from '../models/publishedCharacteristic';
import publishedDataset from '../models/publishedDataset';
import publishedFacet from '../models/publishedFacet';
import subresource from '../models/subresource';
import tenant from '../models/tenant';
import mongoClient from './mongoClient';

export const mongoClientFactory = (mongoClientImpl) => async (ctx, next) => {
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

export const getPrecomputedCollectionForWebHook = async (tenant) => {
    const db = await mongoClient(tenant);
    return await precomputed(db);
};

export const mongoRootAdminClient = async (ctx, next) => {
    ctx.rootAdminDb = await mongoClient('admin');
    ctx.tenantCollection = await tenant(ctx.rootAdminDb);
    await next();
};

export default mongoClientFactory(mongoClient);
