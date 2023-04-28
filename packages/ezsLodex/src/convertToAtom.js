/**
 * Generate an atom XML feed from a resources feed, the LODEX configuration and
 * model.
 *
 * @name convertToAtom
 * @param {Object}  [fields={}]     LODEX model
 * @param {Feed}    [atomFeed={}]   A feed of resources, see [feed](https://github.com/jpmonette/feed)
 * @param {Object}  [config={}]     LODEX configuration (with `perPage`)
 * @returns {String}
 */
export default function convertToAtom(data, feed) {
    const fields = this.getParam('fields', {});
    // TODO: create the feed in this function (see exportAtom)
    const atomFeed = this.getParam('atomFeed', {});
    const config = this.getParam('config', {});

    if (this.isLast() || this.getIndex() > config.perPage) {
        feed.write(atomFeed.atom1());
        return feed.close();
    }

    const title = fields.find((f) => f.overview && f.overview === 1);
    const description = fields.find((f) => f.overview && f.overview === 2);

    if (title === undefined || description === undefined) {
        return feed.end();
    }

    atomFeed.addItem({
        title: data[title.name],
        description: data[description.name],
        link: data.uri,
        date: new Date(),
    });

    return feed.end();
}
