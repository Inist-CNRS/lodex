import mime from 'mime';
import moment from 'moment';
import { streamEnd } from '../../services/streamHelper';
import { version } from '../../../../../package.json';

export default async (ctx: any) => {
    const { fields } = ctx.query;
    const fieldsArray = !Array.isArray(fields)
        ? fields.split(',')
        : fields ?? [];
    const filename = `${ctx.tenant}_dataset_v${version}_${moment().format('YYYY-MM-DD-HHmmss')}.jsonl`;

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
