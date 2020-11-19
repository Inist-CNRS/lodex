import dataset from '../models/dataset';
import field from '../models/field';
import publishedCharacteristic from '../models/publishedCharacteristic';
import publishedDataset from '../models/publishedDataset';
import publishedFacet from '../models/publishedFacet';
import subresource from '../models/subresource';
import mongoClient from './mongoClient';

export const mongoClientFactory = mongoClientImpl => async (ctx, next) => {
    ctx.db = await mongoClientImpl();
    ctx.dataset = await dataset(ctx.db);
    ctx.field = await field(ctx.db);
    ctx.subresource = await subresource(ctx.db);
    ctx.publishedCharacteristic = await publishedCharacteristic(ctx.db);
    ctx.publishedDataset = await publishedDataset(ctx.db);
    ctx.publishedFacet = await publishedFacet(ctx.db);

    await next();
};

export default mongoClientFactory(mongoClient);
