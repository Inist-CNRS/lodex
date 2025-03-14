import mime from 'mime';
import fs from 'fs';
import os from 'os';
import moment from 'moment';
import { streamEnd } from '../../services/streamHelper';
import { unlinkFile } from '../../services/fsHelpers.js';

export default async (ctx) => {
    const { fields } = ctx.query;
    const fieldsArray = fields ? fields.split(',') : [];
    const filename = `dataset_${moment().format('YYYY-MM-DD-HHmmss')}.jsonl`;

    const pathname = `${os.tmpdir()}/${filename}`;
    const fileWriter = fs.createWriteStream(pathname);

    const stream = await ctx.dataset.dumpAsJsonLStream(fieldsArray);
    await streamEnd(stream.pipe(fileWriter));

    const mimetype = mime.lookup(pathname);
    ctx.set('Content-disposition', `attachment; filename=${filename}`);
    ctx.set('Content-type', mimetype);
    ctx.status = 200;

    try {
        const readStream = fs.createReadStream(pathname);
        readStream.pipe(ctx.res);

        await streamEnd(readStream);
        await unlinkFile(pathname);
    } catch (e) {
        ctx.status = 500;
    }
};
