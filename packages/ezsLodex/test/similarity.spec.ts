import {
    scoreToSimilarity,
    similarityToScore,
    parseMinSimilarity,
    parseMaxResources,
} from '../src/similarity';

describe('similarity', () => {
    describe('scoreToSimilarity', () => {
        it('converts a Mongo score to a similarity', () => {
            expect(scoreToSimilarity(1)).toBe(1);
            expect(scoreToSimilarity(0.85)).toBeCloseTo(0.7);
            expect(scoreToSimilarity(0.5)).toBe(0);
        });
        it('clamps negative cosines to 0', () => {
            expect(scoreToSimilarity(0.3)).toBe(0);
        });
    });

    describe('similarityToScore', () => {
        it('converts a similarity to a Mongo score', () => {
            expect(similarityToScore(0.5)).toBe(0.75);
            expect(similarityToScore(0)).toBe(0.5);
        });
    });

    describe('parseMinSimilarity', () => {
        it('accepts numbers and numeric strings (comma allowed)', () => {
            expect(parseMinSimilarity(0.5)).toBe(0.5);
            expect(parseMinSimilarity('0,5')).toBe(0.5);
            expect(parseMinSimilarity('0.85')).toBe(0.85);
        });
        it('returns undefined for invalid values', () => {
            expect(parseMinSimilarity('')).toBeUndefined();
            expect(parseMinSimilarity(undefined)).toBeUndefined();
            expect(parseMinSimilarity('abc')).toBeUndefined();
            expect(parseMinSimilarity(1.2)).toBeUndefined();
            expect(parseMinSimilarity(-0.1)).toBeUndefined();
        });
    });

    describe('parseMaxResources', () => {
        it('accepts integers >= 1', () => {
            expect(parseMaxResources('27')).toBe(27);
        });
        it('falls back to the default', () => {
            expect(parseMaxResources(undefined)).toBe(10);
            expect(parseMaxResources('0')).toBe(10);
            expect(parseMaxResources('abc')).toBe(10);
        });
    });
});
