
module.exports = function convertToAtom(data, feed) {
    const fields = this.getParam('fields', {});
    const atomFeed = this.getParam('atomFeed', {});

    if (this.isLast()) {
        feed.write(atomFeed.atom1());
        return feed.close();
    }

    const title = fields.find(f => f.overview && f.overview === 1);
    const description = fields.find(f => f.overview && f.overview === 2);

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
};
