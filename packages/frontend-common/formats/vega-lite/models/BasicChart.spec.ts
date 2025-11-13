import BasicChart from './BasicChart';

describe('BasicChart', () => {
    it('Default color need to be equals to MULTICHROMATIC_DEFAULT_COLORSET(transformed in to an array)', function () {
        const basicChart = new BasicChart();
        // @ts-expect-error TS2339
        expect(basicChart.colors).toStrictEqual([
            '#d7191c',
            '#fdae61',
            '#ffffbf',
            '#abdda4',
            '#2b83ba',
        ]);
    });

    it('Updated color need to return the new value', function () {
        const basicChart = new BasicChart();
        const newColor = '#ffa6e6';
        basicChart.setColor(newColor);
        // @ts-expect-error TS2339
        expect(basicChart.colors).toStrictEqual([newColor]);
    });

    it('The build function need to throw an error', function () {
        const basicChart = new BasicChart();
        expect(basicChart.buildSpec).toThrow(Error);
    });

    it('Test tooltip', function () {
        const basicChart = new BasicChart();
        // @ts-expect-error TS2339
        expect(basicChart.tooltip).toStrictEqual({
            toggle: false,
            category: {
                field: '_id',
                type: 'nominal',
                title: 'Category',
            },
            value: {
                field: 'value',
                type: 'quantitative',
                title: 'Value',
            },
        });

        basicChart.setTooltip(true);
        // @ts-expect-error TS2339
        expect(basicChart.tooltip.toggle).toBe(true);

        basicChart.setTooltipCategory('TestCategory');
        // @ts-expect-error TS2339
        expect(basicChart.tooltip.category.title).toBe('TestCategory');

        basicChart.setTooltipValue('TestValue');
        // @ts-expect-error TS2339
        expect(basicChart.tooltip.value.title).toBe('TestValue');

        // @ts-expect-error TS2339
        expect(basicChart.tooltip).toStrictEqual({
            toggle: true,
            category: {
                field: '_id',
                type: 'nominal',
                title: 'TestCategory',
            },
            value: {
                field: 'value',
                type: 'quantitative',
                title: 'TestValue',
            },
        });
    });
});
