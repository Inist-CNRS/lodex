import progress from '../../services/progress';
import { PENDING } from '../../../common/progressStatus';

export const getPublication = async ctx => {
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

    return {
        characteristics,
        fields: fieldsWithCount,
        published:
            publishedDatasetCount > 0 ||
            progress.getProgress().status !== PENDING,
    };
};

export default async ctx => {
    ctx.body = await getPublication(ctx);
};
