import {
    formatSimilarity,
    isSimilarResourcesSource,
    parseSimilarityInput,
} from './similarity';
import { precomputed } from './testFixtures';

describe('isSimilarResourcesSource', () => {
    it('detects a PRECOMPUTED source using the vsimilar-precomputed routine', () => {
        expect(
            isSimilarResourcesSource(
                precomputed('/api/run/vsimilar-precomputed/'),
            ),
        ).toBe(true);
    });

    it.each([
        '/api/run/vsimilar-precomputed',
        '/api/run/vsimilar-precomputed?precomputedName=vector',
    ])('detects the routine without a trailing slash: %s', (routine) => {
        expect(isSimilarResourcesSource(precomputed(routine))).toBe(true);
    });

    it('rejects a routine whose name only starts with vsimilar-precomputed', () => {
        expect(
            isSimilarResourcesSource(
                precomputed('/api/run/vsimilar-precomputed-v2/'),
            ),
        ).toBe(false);
    });

    it('rejects a PRECOMPUTED source using another routine', () => {
        expect(
            isSimilarResourcesSource(
                precomputed('/api/run/vanswer-precomputed/'),
            ),
        ).toBe(false);
    });

    it('detects a ROUTINE source calling the vsimilar-precomputed routine', () => {
        expect(
            isSimilarResourcesSource([
                {
                    operation: 'ROUTINE',
                    args: [
                        {
                            name: 'value',
                            value: '/api/run/vsimilar-precomputed/?precomputedName=vector',
                        },
                    ],
                },
            ]),
        ).toBe(true);
    });

    it('rejects a ROUTINE source calling another routine', () => {
        expect(
            isSimilarResourcesSource([
                {
                    operation: 'ROUTINE',
                    args: [
                        {
                            name: 'value',
                            value: '/api/run/vsearch-precomputed/',
                        },
                    ],
                },
            ]),
        ).toBe(false);
    });

    it('rejects other operations even when the routine name appears in an argument', () => {
        expect(
            isSimilarResourcesSource([
                {
                    operation: 'COLUMN',
                    args: [{ name: 'column', value: 'vsimilar-precomputed' }],
                },
            ]),
        ).toBe(false);
    });

    it('returns false when there are no transformers', () => {
        expect(isSimilarResourcesSource(undefined)).toBe(false);
        expect(isSimilarResourcesSource([])).toBe(false);
    });
});

describe('formatSimilarity', () => {
    it('formats the similarity with two decimals in French', () => {
        expect(formatSimilarity(0.923, 'fr')).toBe('0,92');
    });

    it('formats the similarity with two decimals in English', () => {
        expect(formatSimilarity(0.5, 'en')).toBe('0.50');
    });
});

describe('parseSimilarityInput', () => {
    it.each([
        ['0.5', 0.5],
        ['0,5', 0.5],
        ['0', 0],
        ['1', 1],
        [' 0,75 ', 0.75],
    ])('parses %p as %p', (input, expected) => {
        expect(parseSimilarityInput(input)).toBe(expected);
    });

    it.each(['', '  ', 'abc', '1.5', '-0.1', '0,5,2', '0.5abc'])(
        'returns undefined for %p',
        (input) => {
            expect(parseSimilarityInput(input)).toBeUndefined();
        },
    );
});
