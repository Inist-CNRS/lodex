import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const colors = d3.scaleOrdinal(d3.schemeCategory10);

const AsterPlot = ({ data, width, height }) => {
    const ref = useRef(null);
    const createPie = d3.pie().value(d => d.value);

    useEffect(() => {
        // Create structure

        const svg = d3.select(ref.current);

        svg.select('g.arcs').remove();
        const arcsGroup = svg.append('g').attr('class', 'arcs');

        svg.select('g.outlineArcs').remove();
        const outlineArcsGroup = svg.append('g').attr('class', 'outlineArcs');

        // Prepare variables

        const radius = Math.min(width, height) / 2;
        const circumferenceOfCircle = radius * Math.PI * 2;
        const arcLength = circumferenceOfCircle / data.length;
        const arcDegrees = (arcLength / circumferenceOfCircle) * (Math.PI * 2);

        let inner = 0.2 * radius;
        let i = 0;
        let tempEndAngle;
        let j = 0;
        let tempEndAngle1;

        // Create Arcs

        const pieData = createPie(data);

        const arc = d3
            .arc()
            .innerRadius(inner)
            .outerRadius(function(d) {
                return (radius - inner) * (d.value / 100) + inner;
            })
            .startAngle(function() {
                var startAngle = 0;
                var endAngle = 0;
                if (i === 0) {
                    startAngle = 0;
                    endAngle = startAngle + arcDegrees;
                } else {
                    startAngle = tempEndAngle;
                    endAngle = startAngle + arcDegrees;
                }
                i++;
                tempEndAngle = endAngle;
                return startAngle;
            })
            .endAngle(function() {
                var startAngle = 0;
                var endAngle = 0;
                if (j === 0) {
                    startAngle = 0;
                    endAngle = startAngle + arcDegrees;
                } else {
                    startAngle = tempEndAngle1;
                    endAngle = startAngle + arcDegrees;
                }
                j++;
                tempEndAngle1 = endAngle;
                return endAngle;
            });

        arcsGroup
            .selectAll('.arc')
            .data(pieData)
            .enter()
            .append('path')
            .attr('fill', (d, i) => colors(i))
            .attr('fill-opacity', '0.7')
            .attr('stroke', (d, i) => colors(i))
            .attr('stroke-width', '1')
            .attr('d', arc)
            .attr('class', 'arc')
            .attr('transform', `translate(${width / 2} ${height / 2})`);

        // Create outlineArcs

        const outlineArc = d3
            .arc()
            .innerRadius(inner)
            .outerRadius(function() {
                return radius;
            })
            .startAngle(function() {
                let startAngle = 0;
                let endAngle = 0;
                if (i === 0) {
                    startAngle = 0;
                    endAngle = startAngle + arcDegrees;
                } else {
                    startAngle = tempEndAngle;
                    endAngle = startAngle + arcDegrees;
                }
                i++;
                tempEndAngle = endAngle;
                return startAngle;
            })
            .endAngle(function() {
                let startAngle = 0;
                let endAngle = 0;
                if (j === 0) {
                    startAngle = 0;
                    endAngle = startAngle + arcDegrees;
                } else {
                    startAngle = tempEndAngle1;
                    endAngle = startAngle + arcDegrees;
                }
                j++;
                tempEndAngle1 = endAngle;
                return endAngle;
            });

        outlineArcsGroup
            .selectAll('.outlineArc')
            .data(data)
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('class', 'outlineArc')
            .attr('d', outlineArc)
            .attr('transform', `translate(${width / 2} ${height / 2})`);
    }, [ref, data]);

    return (
        <div>
            <svg
                ref={ref}
                width={width}
                height={height}
                viewBox={`-5 -5 ${width + 10} ${height + 10}`}
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
            />
        </div>
    );
};

AsterPlot.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
        }),
    ).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export default AsterPlot;
