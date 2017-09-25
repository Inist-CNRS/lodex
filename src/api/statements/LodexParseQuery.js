import mqs from 'mongodb-querystring';

export default function LodexParseQuery(data, feed) {
    feed.send(data);
    /*
    if (this.isLast()) {
        return feed.close();
    }
    const query = mqs.parse(data);
    console.log('query', query);
    feed.send({ a: true });
    */
}

