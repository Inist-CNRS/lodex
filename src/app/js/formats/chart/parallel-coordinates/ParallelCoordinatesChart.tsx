import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import * as d3 from 'd3';
// @ts-expect-error TS7016
import ReactTooltip from 'react-tooltip';

import { isLongText, getShortText } from '../../../lib/longTexts';
import { getColor } from '../../utils/colorUtils';

const margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 0,
};

// @ts-expect-error TS7031
const ParallelCoordinates = ({ fieldNames, data, width, height, colorSet }) => {
    const ref = useRef(null);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    useEffect(() => {
        if (!data) return;
        const svg = d3
            .select(ref.current)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const y = d3.scaleLinear().range([chartHeight, 0]).domain([0, 100]);

        const x = d3
            .scalePoint()
            .range([0, chartWidth])
            .padding(1)
            .domain(fieldNames);

        // @ts-expect-error TS7006
        const path = (d) => {
            return d3.line()(
                // @ts-expect-error TS7006
                fieldNames.map((fieldName, i) => [
                    x(fieldName),
                    y(d.weights[i]),
                ]),
            );
        };

        function doNotHighlight() {
            d3.selectAll('.line')
                .transition()
                .duration(200)
                .delay(200)
                // @ts-expect-error TS7006
                .style('stroke', (_, i) => getColor(colorSet, i))
                .style('opacity', '1');
        }

        // Draw the lines
        const lines = svg
            .selectAll('lines')
            .data(data)
            .enter()
            .append('path')
            // @ts-expect-error TS7006
            .attr('class', (_, i) => 'line l' + i)
            .attr('d', path)
            // @ts-expect-error TS7006
            .attr('stroke', (_, i) => getColor(colorSet, i))
            .attr('stroke-width', 3)
            .style('fill', 'none')
            .style('opacity', '0.5')
            .attr('data-html', true)
            // @ts-expect-error TS7006
            .attr('data-tip', (d) => d.label);

        lines
            // @ts-expect-error TS7006
            .on('click', (_event, d) => d.onClick())
            .on('mouseover', function highlight() {
                const e = lines.nodes();
                // @ts-expect-error TS2683
                const i = e.indexOf(this);
                d3.selectAll('.line')
                    .transition()
                    .duration(200)
                    .style('opacity', '0');
                d3.selectAll('.l' + i)
                    .transition()
                    .duration(200)
                    .style('stroke', getColor(colorSet, i))
                    .style('opacity', '1');
            })
            .on('mouseleave', doNotHighlight);

        // Draw the axes
        svg.selectAll('fields')
            .data(fieldNames)
            .enter()
            .append('g')
            // @ts-expect-error TS7006
            .attr('transform', (d) => 'translate(' + x(d) + ')')
            .each(function () {
                // @ts-expect-error TS2683
                d3.select(this).call(d3.axisLeft().ticks(5).scale(y));
            })
            // Add axes title
            .append('text')
            .style('text-anchor', 'middle')
            .attr('y', -9)
            // @ts-expect-error TS7006
            .text((d) => (isLongText(d, 20) ? getShortText(d, 20) : d))
            .style('fill', 'black');

        ReactTooltip.rebuild();
    }, [ref, data, chartHeight, chartWidth, fieldNames, colorSet]);

    if (!data) {
        return null;
    }

    return (
        <>
            <svg
                className="parallel-coordinates-chart"
                ref={ref}
                width={chartWidth + margin.left + margin.right}
                height={chartHeight + margin.top + margin.bottom}
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
            />
            <ReactTooltip />
        </>
    );
};

ParallelCoordinates.propTypes = {
    fieldNames: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            weights: PropTypes.arrayOf(PropTypes.number),
            onClick: PropTypes.func,
        }),
    ).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

export default ParallelCoordinates;
