
import dataset from '../../models/dataset';
import parsingResult from '../../models/parsingResult';

export default async function parsing(ctx) {
    const excerptLines = await dataset(ctx.db).find().limit(5)
    .toArray();
    const parsingData = await parsingResult(ctx.db).find().toArray();
    ctx.body = {
        ...parsingData[0],
        excerptLines,
    };
}
