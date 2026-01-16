import get from 'lodash/get.js';
import set from 'lodash/set.js';
import { pipeline } from "@huggingface/transformers";

const createVectorEmbeddings = async (data: any, feed: any, ctx: any) => {
    if (ctx.isLast()) {
        return feed.close();
    }
    const path = Array().concat(ctx.getParam('path', 'value')).shift();
    const value = get(data, path);
    if (!value) {
        set(data, path, []);
        return feed.send(data);
    }
    const extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
    );
    const result = await extractor(
        [value],
        {
            pooling: "mean",
            normalize: true,
        }
    );
    set(data, path, Array.from(result.data));
    feed.send(data);
}

export default createVectorEmbeddings;
