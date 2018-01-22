import React from 'react';
import { scaleQuantize } from 'd3-scale';

import ColorScaleLegend from './ColorScaleLegend';

const getGradientScaleAndLegend = ({
    colorScheme,
    hoverColorScheme,
    maxValue,
}) => {
    const nullColor = colorScheme[0];
    const colorScale = scaleQuantize()
        .range(colorScheme.slice(1))
        .domain([1, maxValue]);

    const hoverColorScale = hoverColorScheme
        ? scaleQuantize()
              .range(hoverColorScheme.slice(1))
              .domain([1, maxValue])
        : () => {
              throw new Error('no hoverColorScheme specified');
          };

    return {
        colorScale: value => (value ? colorScale(value) : nullColor),
        hoverColorScale: value => (value ? hoverColorScale(value) : nullColor),
        legend: (
            <ColorScaleLegend colorScale={colorScale} nullColor={nullColor} />
        ),
    };
};

export default getGradientScaleAndLegend;
