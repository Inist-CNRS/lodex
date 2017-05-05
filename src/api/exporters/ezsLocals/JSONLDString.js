import { promises as jsonld } from 'jsonld';

export default function JSONLDString(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    jsonld.toRDF(data, { format: 'application/nquads' })
        .then((out) => {
            feed.send(out);
        },
            (err) => {
                throw err;
            });
}
