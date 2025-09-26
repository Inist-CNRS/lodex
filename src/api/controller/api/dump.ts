import mime from 'mime';
import moment from 'moment';
import { streamEnd } from '../../services/streamHelper';

export default async (ctx: any) => {
    const { fields } = ctx.query;
    const fieldsArray = fields ? fields.split(',') : [];
    const filename = `dataset_${moment().format('YYYY-MM-DD-HHmmss')}.jsonl`;

    const stream = await ctx.dataset.dumpAsJsonLStream(fieldsArray);

    const mimetype = mime.lookup(filename);
    ctx.set('Content-disposition', `attachment; filename=${filename}`);
    ctx.set('Content-type', mimetype);
    ctx.status = 200;
    try {
        stream.pipe(ctx.res);
        await streamEnd(stream);
    } catch (e) {
        ctx.status = 500;
    }
};
