import { promises as jsonld } from 'jsonld';

module.exports = function JSONLDCompacter(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    jsonld.compact(data, {})
        .then((out) => {
            feed.send(out);
        },
        (err) => {
            throw err;
        });
};
