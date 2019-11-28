import { getPercentValue } from './AsterPlotChartView';

describe('AsterPlotChartView', () => {
    describe('getValue', () => {
        it('should return 0 if weight is wrong', () => {
            const test = data => {
                const result = getPercentValue(data);
                expect(result).toBe(0);
            };

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
                test(data);
            });
        });

        it('should return the percentage', () => {
            const data = {
                weight: 0.98,
            };

            const result = getPercentValue(data);
            expect(result).toBe(98);
        });

        it('should return the percentage with two decimals', () => {
            const data = {
                weight: 0.69696969,
            };

            const result = getPercentValue(data);
            expect(result).toBe(69.69);
        });
    });
});
