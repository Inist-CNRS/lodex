/**
 * Get last characteristic (list of all dataset covering fields).
 *
 * @example <caption>Input:</caption>
 * [
 *   {
 *     "_id" : ObjectId("5ca32c64019f45001d2b602d"),
 *     "publicationDate" : ISODate("2019-04-02T09:33:24.463Z")
 *   },
 *   {
 *     "_id" : ObjectId("5cee50bb019f45001d2b602f"),
 *     "publicationDate" : ISODate("2019-05-29T09:28:27.773Z")
 *   },
 *   {
 *     "_id" : ObjectId("5cee5119019f45001d2b6031"),
 *     "publicationDate" : ISODate("2019-05-29T09:30:01.319Z")
 *   },
 *   {
 *     "_id" : ObjectId("5cee5153019f45001d2b6032"),
 *     "publicationDate" : ISODate("2019-05-29T09:30:59.770Z")
 *   },
 *   {
 *     "_id" : ObjectId("5cee5160019f45001d2b6033"),
 *     "publicationDate" : ISODate("2019-05-29T09:31:12.503Z")
 *   },
 *   {
 *     "_id" : ObjectId("5cee530e3e9676001909ba24"),
 *     "publicationDate" : ISODate("2019-05-29T09:38:22.569Z")
 *   }
 * ]
 *
 * @example <caption>Output:</caption>
 * {
 *   "_id" : ObjectId("5cee530e3e9676001909ba24"),
 *   "publicationDate" : ISODate("2019-05-29T09:38:22.569Z")
 * }
 *
 * @export
 * @returns
 * @name getLastCharacteristic
 */
export default function getLastCharacteristic(chunk, feed) {
    if (this.isLast()) {
        feed.write(this.previousChunk);
        feed.close();
        return;
    }

    this.previousChunk = chunk;
    feed.end();
}
