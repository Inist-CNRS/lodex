import { normalize, tokenize, filterOptions } from '../searchUtils';

describe('searchUtils', () => {
    describe('normalize', () => {
        it('should convert to lowercase', () => {
            expect(normalize('HELLO')).toBe('hello');
        });

        it('should remove diacritics', () => {
            expect(normalize('café')).toBe('cafe');
            expect(normalize('naïve')).toBe('naive');
            expect(normalize('résumé')).toBe('resume');
        });

        it('should handle null and undefined', () => {
            expect(normalize(null)).toBe('');
            expect(normalize(undefined)).toBe('');
            expect(normalize('')).toBe('');
        });

        it('should handle special characters', () => {
            expect(normalize('hello-world')).toBe('hello-world');
            expect(normalize('test_123')).toBe('test_123');
        });
    });

    describe('tokenize', () => {
        it('should split on spaces', () => {
            expect(tokenize('hello world')).toEqual(['hello', 'world']);
        });

        it('should split on special characters', () => {
            expect(tokenize('hello-world_test')).toEqual([
                'hello',
                'world',
                'test',
            ]);
        });

        it('should filter out empty tokens', () => {
            expect(tokenize('hello  world')).toEqual(['hello', 'world']);
            expect(tokenize('hello---world')).toEqual(['hello', 'world']);
        });

        it('should normalize before tokenizing', () => {
            expect(tokenize('CAFÉ-WORLD')).toEqual(['cafe', 'world']);
        });

        it('should handle empty strings', () => {
            expect(tokenize('')).toEqual([]);
            expect(tokenize('   ')).toEqual([]);
        });
    });

    describe('filterOptions', () => {
        const mockOptions = [
            { label: 'First Name', name: 'firstName' },
            { label: 'Last Name', name: 'lastName' },
            { label: 'Email Address', name: 'email' },
            { label: 'Phone Number', name: 'phone' },
            { label: 'Date of Birth', name: 'birthDate' },
        ];

        it('should return all options for empty input', () => {
            const result = filterOptions(mockOptions, { inputValue: '' });
            expect(result).toHaveLength(5);
        });

        it('should match beginning of tokens', () => {
            const result = filterOptions(mockOptions, { inputValue: 'fir' });
            expect(result).toContainEqual({
                label: 'First Name',
                name: 'firstName',
            });
            expect(result).toHaveLength(1);
        });

        it('should match multiple tokens', () => {
            const result = filterOptions(mockOptions, {
                inputValue: 'first na',
            });
            expect(result).toContainEqual({
                label: 'First Name',
                name: 'firstName',
            });
            expect(result).toHaveLength(1);
        });

        it('should match on name field', () => {
            const result = filterOptions(mockOptions, {
                inputValue: 'firstName',
            });
            expect(result).toContainEqual({
                label: 'First Name',
                name: 'firstName',
            });
            expect(result).toHaveLength(1);
        });

        it('should match exact label', () => {
            const result = filterOptions(mockOptions, {
                inputValue: 'Email Address',
            });
            expect(result).toContainEqual({
                label: 'Email Address',
                name: 'email',
            });
        });

        it('should be case insensitive', () => {
            const result = filterOptions(mockOptions, { inputValue: 'FIRST' });
            expect(result).toContainEqual({
                label: 'First Name',
                name: 'firstName',
            });
        });

        it('should handle diacritics', () => {
            const optionsWithDiacritics = [
                { label: 'Café', name: 'cafe' },
                { label: 'Naïve', name: 'naive' },
            ];
            const result = filterOptions(optionsWithDiacritics, {
                inputValue: 'cafe',
            });
            expect(result).toContainEqual({ label: 'Café', name: 'cafe' });
        });

        it('should return empty array when no matches', () => {
            const result = filterOptions(mockOptions, { inputValue: 'xyz' });
            expect(result).toHaveLength(0);
        });

        it('should match partial tokens across label and name', () => {
            const result = filterOptions(mockOptions, { inputValue: 'em ad' });
            expect(result).toContainEqual({
                label: 'Email Address',
                name: 'email',
            });
        });

        it('should require all input tokens to match', () => {
            const result = filterOptions(mockOptions, {
                inputValue: 'first phone',
            });
            expect(result).toHaveLength(0);
        });
    });
});
