import jsonld from 'jsonld';

export default async function JSONLDString(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const out = await jsonld.toRDF(data, { format: 'application/n-quads' });
    feed.send(out);
}
