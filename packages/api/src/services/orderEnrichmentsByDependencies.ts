/**
 * @typedef {Object} Enrichment
 * @property {string} name
 * @property {string} sourceColumn
 */

import type { Enrichment } from '../models/enrichment';

export function orderEnrichmentsByDependencies<
    T extends Pick<Enrichment, 'name' | 'sourceColumn'>,
>(datasetColumns: string[], enrichments: T[]) {
    const enrichmentQueue: T[] = [...enrichments];

    const visitedEnrichments = new Set(datasetColumns);

    const orderedEnrichments: T[] = [];

    let loopDetector: T | null = null;

    function visitEnrichment(enrichment: T) {
        orderedEnrichments.push(enrichment);
        visitedEnrichments.add(enrichment.name);
        loopDetector = null;
    }

    while (enrichmentQueue.length) {
        const enrichment = enrichmentQueue.shift()!;

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
