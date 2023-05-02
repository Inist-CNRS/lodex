import { Parser } from 'n3';

/**
 * Take N-Quads string and transform it to Objects.
 *
 * @name parseNQuads
 * @param none.
 * @returns {Object}
 */
export default function parseNQuads(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    if (this.isFirst()) {
        this.parser = new Parser({ format: 'N-Quads' });
    }

    return this.parser.parse(data, (error, quad, prefixes) => {
        if (error) {
            return feed.stop(new Error(error));
        }
        if (!quad) {
            return feed.send({ prefixes });
        }
        return feed.write({ quad });
    });
}
