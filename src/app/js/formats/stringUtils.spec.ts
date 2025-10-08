import { truncateByWords } from './stringUtils';

describe('stringUtils', () => {
    it('should export the same string', () => {
        const inputString = 'Hello, Lodex!';
        const outputString1 = truncateByWords(inputString, -10);
        const outputString2 = truncateByWords(inputString, -1);
        const outputString3 = truncateByWords(inputString, 0);
        const outputString4 = truncateByWords(inputString, 10);

        expect(outputString1).toBe(inputString);
        expect(outputString2).toBe(inputString);
        expect(outputString3).toBe(inputString);
        expect(outputString4).toBe(inputString);
    });

    it('should export the same string with out the last word', () => {
        const inputString = 'Hello, Lodex!';
        const outputString1 = truncateByWords(inputString, 1);
        const outputString2 = truncateByWords(inputString, 2);
        const outputString3 = truncateByWords(inputString, 4);
        const outputString4 = truncateByWords(inputString, 6);

        expect(outputString1).toBe('Hello,…');
        expect(outputString2).toBe('Hello,…');
        expect(outputString3).toBe('Hello,…');
        expect(outputString4).toBe('Hello,…');
    });
});
