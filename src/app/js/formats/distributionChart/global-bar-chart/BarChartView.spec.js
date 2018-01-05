import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { XAxis, YAxis } from 'recharts';

import BarChartView, {
    getCategoryAxisProps,
    getValueAxisProps,
} from './BarChartView';

describe('BarChartView', () => {
    it('should pass valueAxisProps to XAxis and categoryProps to YAxis if direction is horizontal', () => {
        const props = {
            chartData: [],
            valueAxisProps: {
                propsFor: 'value',
            },
            categoryAxisProps: {
                propsFor: 'category',
            },
            direction: 'horizontal',
        };
        const barChart = shallow(
            <BarChartView.WrappedComponent.WrappedComponent {...props} />,
        );

        const xAxis = barChart.find(XAxis);
        const yAxis = barChart.find(YAxis);

        expect(xAxis.props().propsFor).toBe('value');

        expect(yAxis.props().propsFor).toBe('category');
    });

    it('should pass valueAxisProps to yAxis and categoryProps to XAxis if direction is vertical', () => {
        const props = {
            chartData: [],
            valueAxisProps: {
                propsFor: 'value',
            },
            categoryAxisProps: {
                propsFor: 'category',
            },
            direction: 'vertical',
        };
        const barChart = shallow(
            <BarChartView.WrappedComponent.WrappedComponent {...props} />,
        );

        const xAxis = barChart.find(XAxis);
        const yAxis = barChart.find(YAxis);

        expect(xAxis.props().propsFor).toBe('category');

        expect(yAxis.props().propsFor).toBe('value');
    });

    describe('getCategoryAxisProps', () => {
        it('should set props for categoryAxis', () => {
            expect(getCategoryAxisProps({})).toEqual({
                angle: null,
                dataKey: '_id',
                interval: 0,
                padding: {
                    bottom: 3,
                    top: 3,
                },
                textAnchor: 'middle',
                type: 'category',
                height: undefined,
            });
        });

        it('should set angle to `-45` if diagonalCategoryAxis is true', () => {
            expect(
                getCategoryAxisProps({
                    diagonalCategoryAxis: true,
                }).angle,
            ).toBe(-45);
        });

        it('should set angle to `null` if diagonalCategoryAxis is false', () => {
            expect(
                getCategoryAxisProps({
                    diagonalCategoryAxis: false,
                }).angle,
            ).toBe(null);
        });

        it('should set textAnchor to `end` if diagonalCategoryAxis is true', () => {
            expect(
                getCategoryAxisProps({
                    diagonalCategoryAxis: true,
                }).textAnchor,
            ).toBe('end');
        });

        it('should set textAnchor to `end` if diagonalCategoryAxis is false and direction is horizontal', () => {
            expect(
                getCategoryAxisProps({
                    diagonalCategoryAxis: false,
                    direction: 'horizontal',
                }).textAnchor,
            ).toBe('end');
        });

        it('should set textAnchor to `middle` if diagonalValueAxis is false and direction is vertical', () => {
            expect(
                getCategoryAxisProps({
                    diagonalCategoryAxis: false,
                    direction: 'vertical',
                }).textAnchor,
            ).toBe('middle');
        });

        it('should set width to categoryMargin if direction is horizontal', () => {
            const props = getCategoryAxisProps({
                categoryMargin: 200,
                direction: 'horizontal',
            });
            expect(props.width).toBe(200);
            expect(props.height).toBe(undefined);
        });

        it('should set height to categoryMargin if direction is vertical', () => {
            const props = getCategoryAxisProps({
                categoryMargin: 200,
                direction: 'vertical',
            });
            expect(props.height).toBe(200);
            expect(props.width).toBe(undefined);
        });
    });

    describe('getValueAxisProps', () => {
        it('should set props for valueAxis', () => {
            expect(getValueAxisProps({})).toEqual({
                allowDecimals: true,
                angle: null,
                dataKey: 'value',
                domain: [0, 'auto'],
                scale: undefined,
                textAnchor: 'end',
                tickCount: 6,
                type: 'number',
                width: undefined,
            });
        });

        it('should set angle to `-45` if diagonalValueAxis is true', () => {
            expect(
                getValueAxisProps({
                    diagonalValueAxis: true,
                }).angle,
            ).toBe(-45);
        });

        it('should set angle to `null` if diagonalValueAxis is false', () => {
            expect(
                getValueAxisProps({
                    diagonalValueAxis: false,
                }).angle,
            ).toBe(null);
        });

        it('should set textAnchor to `end` if diagonalValueAxis is true', () => {
            expect(
                getCategoryAxisProps({
                    diagonalValueAxis: true,
                }).textAnchor,
            ).toBe('middle');
        });

        it('should set textAnchor to `middle` if diagonalValueAxis is false and direction is horizontal', () => {
            expect(
                getValueAxisProps({
                    diagonalValueAxis: false,
                    direction: 'horizontal',
                }).textAnchor,
            ).toBe('middle');
        });

        it('should set textAnchor to `middle` if diagonalValueAxis is false and direction is vertical', () => {
            expect(
                getValueAxisProps({
                    diagonalValueAxis: false,
                    direction: 'vertical',
                }).textAnchor,
            ).toBe('end');
        });

        it('should set allowDecimals to true if axisRoundValue is false', () => {
            expect(
                getValueAxisProps({
                    axisRoundValue: false,
                }).allowDecimals,
            ).toBe(true);
        });

        it('should set allowDecimals to false if axisRoundValue is true', () => {
            expect(
                getValueAxisProps({
                    axisRoundValue: true,
                }).allowDecimals,
            ).toBe(false);
        });

        it('should set scale to scale', () => {
            expect(
                getValueAxisProps({
                    scale: 'scale',
                }).scale,
            ).toBe('scale');
        });

        it('should set tickCount to max + 1 if max is less than 5', () => {
            expect(
                getValueAxisProps({
                    max: 2,
                }).tickCount,
            ).toBe(3);
        });

        it('should set tickCount to 5 if max is more than 5', () => {
            expect(
                getValueAxisProps({
                    max: 10,
                }).tickCount,
            ).toBe(5);
        });

        it('should set domain to [0,auto] if scale is linear', () => {
            expect(
                getValueAxisProps({
                    scale: 'linear',
                }).domain,
            ).toEqual([0, 'auto']);
        });

        it('should set domain to [auto,auto] if scale is log', () => {
            expect(
                getValueAxisProps({
                    scale: 'log',
                }).domain,
            ).toEqual(['auto', 'auto']);
        });

        it('should set width to valueMargin if direction is vertical', () => {
            const props = getValueAxisProps({
                valueMargin: 200,
                direction: 'vertical',
            });
            expect(props.width).toBe(200);
            expect(props.height).toBe(undefined);
        });

        it('should set height to valueMargin if direction is horizontal', () => {
            const props = getValueAxisProps({
                valueMargin: 200,
                direction: 'horizontal',
            });
            expect(props.height).toBe(200);
            expect(props.width).toBe(undefined);
        });
    });
});
