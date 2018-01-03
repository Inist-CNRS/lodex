import expect from 'expect';

import { mapSourceToX, mapTargetToX } from './parseChartData';

describe('parseChartData', () => {
    const chartData = {
        source: 'source',
        target: 'target',
        weight: 10,
    };

    describe('mapSourceToX', () => {
        it('should add chartData to given acc using source as xAxis', () => {
            expect(
                mapSourceToX(
                    {
                        xAxis: ['x'],
                        yAxis: ['y'],
                        dictionary: {},
                        maxValue: 5,
                    },
                    chartData,
                ),
            ).toEqual({
                xAxis: ['x', 'source'],
                yAxis: ['y', 'target'],
                dictionary: {
                    source: { target: 10 },
                },
                maxValue: 10,
            });
        });

        it('should parse chartData by using source as xAxis completing existing data', () => {
            expect(
                mapSourceToX(
                    {
                        xAxis: ['source', 'x'],
                        yAxis: ['target', 'y'],
                        dictionary: { foo: 'bar', source: { foo: 'bar' } },
                        maxValue: 50,
                    },
                    chartData,
                ),
            ).toEqual({
                xAxis: ['source', 'x'],
                yAxis: ['target', 'y'],
                dictionary: {
                    foo: 'bar',
                    source: { foo: 'bar', target: 10 },
                },
                maxValue: 50,
            });
        });
    });

    describe('mapTargetToX', () => {
        it('should add chartData to given acc using target as xAxis', () => {
            expect(
                mapTargetToX(
                    {
                        xAxis: ['x'],
                        yAxis: ['y'],
                        dictionary: {},
                        maxValue: 5,
                    },
                    chartData,
                ),
            ).toEqual({
                xAxis: ['x', 'target'],
                yAxis: ['y', 'source'],
                dictionary: {
                    target: { source: 10 },
                },
                maxValue: 10,
            });
        });

        it('should add chartData by using target as xAxis completing existing data', () => {
            expect(
                mapTargetToX(
                    {
                        xAxis: ['target', 'x'],
                        yAxis: ['source', 'y'],
                        dictionary: { foo: 'bar', target: { foo: 'bar' } },
                        maxValue: 50,
                    },
                    chartData,
                ),
            ).toEqual({
                xAxis: ['target', 'x'],
                yAxis: ['source', 'y'],
                dictionary: {
                    foo: 'bar',
                    target: { foo: 'bar', source: 10 },
                },
                maxValue: 50,
            });
        });
    });
});
