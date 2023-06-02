function removeNumberInstance(uri) {
    const reg = new RegExp('(\\-\\d+)(\\.[a-z]+)+');
    const match = reg.exec(uri);

    if (match !== null) {
        return uri.replace(match[1], '');
    }

    return uri;
}

/**
 * @typedef {Object<string, any>} Field
 * @property {string} name The identifier of the field.
 * @property {string} scheme The semantic property of the field.
 */
/**
 * Extract an ISTEX API query.
 *
 * @param {Field[]} [fields=[]]   list of LODEX fields
 * @name extractIstexQuery
 * @example <caption>Output:</caption>
 * {
 *    content: 'fake query',
 *    lodex: {
 *       uri: 'http://resource.uri',
 *   },
 * }
 * @returns
 */
module.exports = function extractIstexQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const fields = /** @type Field[] */(this.getParam('fields', []));

    const isIstexQuery = (field) => {
        const istexQuerySchemes = [
            'istex:query',
            'https://data.istex.fr/ontology/istex#query',
        ];
        return istexQuerySchemes.includes(field.scheme);
    };

    /*
     * If we don't have any istexQuery, close the export
     */
    if (!fields.some(isIstexQuery)) {
        return feed.close();
    }

    const field = fields.filter(isIstexQuery)[0];
    const propertyName = field.name;

    const formatedUri = removeNumberInstance(data.uri);

    return feed.send({
        lodex: {
            uri: formatedUri,
        },
        content: data[propertyName],
    });
};
