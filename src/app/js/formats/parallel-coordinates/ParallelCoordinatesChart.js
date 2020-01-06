import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { getColor } from '../colorUtils';

const margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 0,
};

const ParallelCoordinates = ({ fieldNames, data, width, height, colorSet }) => {
    const ref = useRef(null);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    if (!data) {
        return null;
    }

    useEffect(() => {
        const svg = d3
            .select(ref.current)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const y = d3.scaleLinear().range([chartHeight, 0]);

        const x = d3
            .scalePoint()
            .range([0, chartWidth])
            .padding(1)
            .domain(fieldNames);

        const path = d => {
            return d3.line()(
                fieldNames.map((fieldName, i) => {
                    return [x(fieldName), y(d.weights[i])];
                }),
            );
        };

        // Draw the lines
        svg.selectAll('lines')
            .data(data)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('stroke', (_, i) => getColor(colorSet, i))
            .style('fill', 'none')
            .style('opacity', 0.5);

        // Draw the axes
        svg.selectAll('fields')
            .data(fieldNames)
            .enter()
            .append('g')
            .attr('transform', d => 'translate(' + x(d) + ')')
            .each(function(d) {
                d3.select(this).call(d3.axisLeft().scale(y));
            })
            // Add axes title
            .append('text')
            .style('text-anchor', 'middle')
            .attr('y', -9)
            .text(d => d)
            .style('fill', 'black');
    }, [ref, data]);

    return (
        <svg
            className="parallel-coordinates-chart"
            ref={ref}
            width={chartWidth + margin.left + margin.right}
            height={chartHeight + margin.top + margin.bottom}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        />
    );
};

ParallelCoordinates.propTypes = {
    fieldNames: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(
        PropTypes.shape({
            weights: PropTypes.arrayOf(PropTypes.number),
        }),
    ).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

export default ParallelCoordinates;
