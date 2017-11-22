import mqs from 'mongodb-querystring';

export default function LodexParseQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const query = mqs.parse(data.querystring);
    feed.send({ ...data, ...query });
}
