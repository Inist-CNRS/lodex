/**
 * @typedef {Object} Enrichment
 * @property {string} name
 * @property {string} sourceColumn
 */

/**
 * @param {Enrichment[]} enrichments
 * @returns {Enrichment[]}
 */
export function orderEnrichmentsByDependencies(datasetColumns, enrichments) {
    /**
     * @type {Enrichment[]}
     */
    const enrichmentQueue = [].concat(enrichments);

    /**
     * @type {Set<string>}
     */
    const visitedEnrichments = new Set(datasetColumns);

    /**
     * @type {Enrichment[]}
     */
    const orderedEnrichments = [];

    /**
     * @type {Enrichment | null}
     */
    let loopDetector = null;

    function visitEnrichment(enrichment) {
        orderedEnrichments.push(enrichment);
        visitedEnrichments.add(enrichment.name);
        loopDetector = null;
    }

    while (enrichmentQueue.length) {
        const enrichment = enrichmentQueue.shift();

        if (enrichment === loopDetector) {
            throw new Error('circular_dependency');
        }

        if (!enrichment.sourceColumn) {
            visitEnrichment(enrichment);
            continue;
        }

        if (visitedEnrichments.has(enrichment.sourceColumn)) {
            visitEnrichment(enrichment);
            continue;
        }

        enrichmentQueue.push(enrichment);
        if (loopDetector === null) {
            loopDetector = enrichment;
        }
    }

    return orderedEnrichments;
}
