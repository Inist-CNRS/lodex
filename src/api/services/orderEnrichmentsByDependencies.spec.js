import { orderEnrichmentsByDependencies } from './orderEnrichmentsByDependencies';

describe('orderEnrichmentsByDependencies', () => {
    it('should return empty array if no enrichments', () => {
        expect(orderEnrichmentsByDependencies([])).toStrictEqual([]);
    });

    it('should not change order if no dependencies between enrichments', () => {
        const A = { name: 'A' };
        const B = { name: 'B' };
        const C = { name: 'C' };
        expect(orderEnrichmentsByDependencies([C, A, B])).toStrictEqual([
            C,
            A,
            B,
        ]);
    });

    it('should execute dependent enrichment after its dependency', () => {
        const A = { name: 'A' };
        const B = { name: 'B' };
        const C = { name: 'C', sourceColumn: 'B' };
        const D = { name: 'D', sourceColumn: 'A' };
        expect(orderEnrichmentsByDependencies([D, A, B, C])).toStrictEqual([
            A,
            B,
            C,
            D,
        ]);
    });

    it('should throw an error if a dependency does not exist', () => {
        const A = { name: 'A' };
        const B = { name: 'B' };
        const C = { name: 'C', sourceColumn: 'D' };
        expect(() => orderEnrichmentsByDependencies([A, B, C, D])).toThrow();
    });

    it('should throw an error if there is a circular dependency', () => {
        const A = { name: 'A' };
        const B = { name: 'B' };
        const C = { name: 'C', sourceColumn: 'D' };
        const D = { name: 'D', sourceColumn: 'C' };
        const E = { name: 'E' };
        expect(() => orderEnrichmentsByDependencies([A, B, C, D])).toThrow();
        expect(() => orderEnrichmentsByDependencies([A, B, C, D, E])).toThrow();
    });
});
