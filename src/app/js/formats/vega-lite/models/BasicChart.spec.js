import BasicChart from "./BasicChart";
import { PADDING_BOTTOM, PADDING_LEFT, PADDING_RIGHT, PADDING_TOP } from '../chartsUtils';

describe('BasicChart', () => {
    it('Default color need to be equals to MULTICHROMATIC_DEFAULT_COLORSET(transformed in to an array)', function () {
        let basicChart = new BasicChart();
        expect(basicChart.colors).toStrictEqual([
            '#d7191c',
            '#fdae61',
            '#ffffbf',
            '#abdda4',
            '#2b83ba'
        ]);
    });

    it('Default padding need to return 0 on the 4 side', function() {
        let basicChart = new BasicChart();
        expect(basicChart.padding).toStrictEqual({left: 0, right: 0, top: 0, bottom: 0});
    });

    it('Updated padding need to return the new values', function() {
        let basicChart = new BasicChart();
        let newPadding = {
            left: 10,
            right: 12,
            top: 100,
            bottom: 45
        }
        basicChart.setPadding(PADDING_BOTTOM, newPadding.bottom);
        basicChart.setPadding(PADDING_RIGHT, newPadding.right);
        basicChart.setPadding(PADDING_TOP, newPadding.top);
        basicChart.setPadding(PADDING_LEFT, newPadding.left);

        expect(basicChart.padding).toStrictEqual(newPadding);
    });

    it('Updated color need to return the new value', function () {
        let basicChart = new BasicChart();
        let newColor = '#ffa6e6';
        basicChart.setColor(newColor);
        expect(basicChart.colors).toStrictEqual([newColor]);
    });

    it('Default mark need to be an empty string', function () {
        let basicChart = new BasicChart();
        expect(basicChart.mark).toBe('');
    });

    it('Updated mark need to return the new value', function () {
        let basicChart = new BasicChart();
        basicChart.setMark('bar')
        expect(basicChart.mark).toBe('bar');
    });

    it('The build function need to throw an error', function () {
        let basicChart = new BasicChart();
        expect(basicChart.buildSpec).toThrow(Error);
    });
})