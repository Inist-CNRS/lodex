import validUrl from 'valid-url';

/*
 * Create a JSONLD context with prefixes and istexQuery informations in config.json
 *
 * @param {string}  schemeForIstexQuery URI of the link
 * @return JSONLD context with properties URI
 */
function getContext(schemeForIstexQuery) {
    const context = {};

    if (validUrl.isWebUri(schemeForIstexQuery)) {
        context.link = schemeForIstexQuery;
    }

    if (context.link === undefined) {
        // eslint-disable-next-line no-console
        console.error(
            'convertToExtendedJsonLd',
            'schemeForIstexQuery is a required URI!',
        );
    }

    context.link = {
        '@id': context.link,
        '@type': '@id',
    };

    return context;
}

/**
 * Convert the result of an ISTEX query to an extended JSON-LD.
 *
 * Every hit must contain the URI of original lodex resource, linked to the
 * query.
 *
 * @param {string}  schemeForIstexQuery URI to put between document and resource
 * @name convertToExtendedJsonLd
 */
export default function convertToExtendedJsonLd(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const schemeForIstexQuery = this.getParam('schemeForIstexQuery');

    if (!this.searchKeys) {
        this.context = getContext(schemeForIstexQuery);
        this.searchKeys = Object.keys(this.context);
    }
    const newHit = {};
    newHit['@id'] = `https://api.istex.fr/${data.arkIstex}`;
    newHit.link = data.uri;

    const doc = {
        '@context': this.context,
        '@graph': [newHit],
    };

    return feed.send(doc);
}
