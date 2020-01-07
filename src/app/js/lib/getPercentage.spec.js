import { getPercentValue } from './getPercentage';

describe('getPercentValue', () => {
    describe('getValue', () => {
        const wrongData = [
            { weight: undefined },
            { weight: null },
            { weight: -2 },
            { weight: 2 },
            { weight: '-2' },
            { weight: '2' },
            { weight: 'salut' },
        ];

        wrongData.forEach(data => {
            it(`should return 0 if weight is ${data.weight}`, () => {
                const result = getPercentValue(data);
                expect(result).toBe('0');
            });
        });

        it('should return the percentage', () => {
            const data = 0.98;

            const result = getPercentValue(data);
            expect(result).toBe('98');
        });

        it('should return the percentage with two decimals', () => {
            const data = 0.69696969;
            const nbDecimals = 2;

            const result = getPercentValue(data, nbDecimals);
            expect(result).toBe('69.70');
        });
    });
});
