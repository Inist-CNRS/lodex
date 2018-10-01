import progress from '../../services/progress';
import { PENDING } from '../../../common/progressStatus';

import preFetchFormatData from '../../services/preFetchFormatData';

export const preparePublication = async (ctx, next) => {
    ctx.preFetchFormatData = preFetchFormatData;
    await next();
};

export default async ctx => {
    const publishedDatasetCount = await ctx.publishedDataset.count();
    const characteristics = await ctx.publishedCharacteristic.findAllVersions(
        {},
    );
    const fields = await ctx.field.findAll();

    const fieldsWithCountPromises = fields.map(async field => ({
        ...field,
        count: await ctx.publishedDataset.countByFacet(field.name, {
            $ne: null,
        }),
    }));

    const fieldsWithCount = await Promise.all(fieldsWithCountPromises);

    const published =
        publishedDatasetCount > 0 || progress.getProgress().status !== PENDING;

    if (!published) {
        ctx.body = {
            characteristics,
            fields: fieldsWithCount,
            published,
        };
        return;
    }

    const prefetchFields = await ctx.field.findPrefetchDatasetFields();

    const prefetchedData = prefetchFields.length
        ? await ctx.preFetchFormatData(prefetchFields, characteristics[0])
        : {};

    ctx.body = {
        characteristics,
        fields: fieldsWithCount,
        prefetchedData,
        published,
    };
};
