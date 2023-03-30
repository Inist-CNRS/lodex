import jsonld from 'jsonld';

export default async function JSONLDCompacter(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const out = await jsonld.compact(data, {});
    feed.send(out);
}
