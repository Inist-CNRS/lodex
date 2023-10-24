import dataset from '../models/dataset';
import field from '../models/field';
import publishedCharacteristic from '../models/publishedCharacteristic';
import publishedDataset from '../models/publishedDataset';
import publishedFacet from '../models/publishedFacet';
import subresource from '../models/subresource';
import enrichment from '../models/enrichment';
import precomputed from '../models/precomputed';
import mongoClient from './mongoClient';
import tenant from '../models/tenant';

export const mongoClientFactory = mongoClientImpl => async (ctx, next) => {
    ctx.db = await mongoClientImpl(ctx.tenant);
    ctx.dataset = await dataset(ctx.db);
    ctx.field = await field(ctx.db);
    ctx.subresource = await subresource(ctx.db);
    ctx.enrichment = await enrichment(ctx.db);
    ctx.precomputed = await precomputed(ctx.db);
    ctx.publishedCharacteristic = await publishedCharacteristic(ctx.db);
    ctx.publishedDataset = await publishedDataset(ctx.db);
    ctx.publishedFacet = await publishedFacet(ctx.db);

    await next();
};

export const mongoRootAdminClient = async (ctx, next) => {
    ctx.rootAdminDb = await mongoClient('admin');
    ctx.tenantCollection = await tenant(ctx.rootAdminDb);
    await next();
};

export default mongoClientFactory(mongoClient);
