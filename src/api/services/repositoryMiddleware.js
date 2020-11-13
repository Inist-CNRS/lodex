import dataset from '../models/dataset';
import field from '../models/field';
import publishedCharacteristic from '../models/publishedCharacteristic';
import publishedDataset from '../models/publishedDataset';
import publishedFacet from '../models/publishedFacet';
import resource from '../models/resource';

import mongoClient from './mongoClient';

export const mongoClientFactory = mongoClientImpl => async (ctx, next) => {
    ctx.db = await mongoClientImpl();
    ctx.dataset = await dataset(ctx.db);
    ctx.field = await field(ctx.db);
    ctx.resource = await resource(ctx.db);
    ctx.publishedCharacteristic = await publishedCharacteristic(ctx.db);
    ctx.publishedDataset = await publishedDataset(ctx.db);
    ctx.publishedFacet = await publishedFacet(ctx.db);

    await next();
};

export default mongoClientFactory(mongoClient);
