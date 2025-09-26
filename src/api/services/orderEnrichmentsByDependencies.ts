/**
 * @typedef {Object} Enrichment
 * @property {string} name
 * @property {string} sourceColumn
 */

/**
 * @param {Enrichment[]} enrichments
 * @returns {Enrichment[]}
 */
export function orderEnrichmentsByDependencies(
    datasetColumns: any,
    enrichments: any,
) {
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
    const orderedEnrichments: any = [];

    /**
     * @type {Enrichment | null}
     */
    let loopDetector = null;

    function visitEnrichment(enrichment: any) {
        orderedEnrichments.push(enrichment);
        visitedEnrichments.add(enrichment.name);
        loopDetector = null;
    }

    while (enrichmentQueue.length) {
        const enrichment = enrichmentQueue.shift();

        if (enrichment === loopDetector) {
            throw new Error('circular_dependency');
        }

        // @ts-expect-error TS(18048): enrichment is possibly undefined
        if (!enrichment.sourceColumn) {
            visitEnrichment(enrichment);
            continue;
        }

        // @ts-expect-error TS(18048): enrichment is possibly undefined
        if (visitedEnrichments.has(enrichment.sourceColumn)) {
            visitEnrichment(enrichment);
            continue;
        }

        // @ts-expect-error TS(18048): enrichment is possibly undefined
        enrichmentQueue.push(enrichment);
        if (loopDetector === null) {
            loopDetector = enrichment;
        }
    }

    return orderedEnrichments;
}
