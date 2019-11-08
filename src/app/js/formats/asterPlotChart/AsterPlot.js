import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';

import stylesToClassname from '../../lib/stylesToClassName';

const colors = d3.scaleOrdinal(d3.schemeCategory10);

const styles = stylesToClassname(
    {
        arc: {},
        outlineArc: {
            ':hover': {
                fill: 'white',
                fillOpacity: '0.33',
                cursor: 'pointer',
            },
        },
    },
    'aster-plot-chart',
);

const AsterPlot = ({ data, width, height }) => {
    const ref = useRef(null);
    const createPie = d3.pie().value(d => d.value);

    useEffect(() => {
        // Create structure

        const svg = d3.select(ref.current);

        svg.select('g.arcs').remove();
        const arcsGroup = svg.append('g').attr('class', 'arcs');

        // Prepare variables and methods

        const radius = Math.min(width, height) / 2;
        const inner = 0.2 * radius;
        const circumferenceOfCircle = radius * Math.PI * 2;
        const arcLength = circumferenceOfCircle / data.length;
        const arcDegrees = (arcLength / circumferenceOfCircle) * (Math.PI * 2);

        let startAngleIndex = 0;
        let tempEndAngle;
        let endAngleIndex = 0;
        let tempEndAngle1;

        const computeStartAngle = () => {
            let startAngle = 0;
            let endAngle = 0;
            if (startAngleIndex === 0) {
                startAngle = 0;
                endAngle = startAngle + arcDegrees;
            } else {
                startAngle = tempEndAngle;
                endAngle = startAngle + arcDegrees;
            }
            startAngleIndex++;
            tempEndAngle = endAngle;
            return startAngle;
        };

        const computeEndAngle = () => {
            let startAngle = 0;
            let endAngle = 0;
            if (endAngleIndex === 0) {
                startAngle = 0;
                endAngle = startAngle + arcDegrees;
            } else {
                startAngle = tempEndAngle1;
                endAngle = startAngle + arcDegrees;
            }
            endAngleIndex++;
            tempEndAngle1 = endAngle;
            return endAngle;
        };

        const pieData = createPie(data);

        // Create arcs

        const filledArc = d3
            .arc()
            .innerRadius(inner)
            .outerRadius(function(d) {
                return (radius - inner) * (d.value / 100) + inner;
            })
            .startAngle(computeStartAngle)
            .endAngle(computeEndAngle);

        const outlineArc = d3
            .arc()
            .innerRadius(inner)
            .outerRadius(radius)
            .startAngle(computeStartAngle)
            .endAngle(computeEndAngle);

        // Apply arcs to groups

        arcsGroup
            .selectAll('.arc')
            .data(pieData)
            .enter()
            .append('path')
            .attr('fill', (d, i) => colors(i))
            .attr('d', filledArc)
            .attr('class', `arc ${styles.arc}`)
            .attr('transform', `translate(${width / 2} ${height / 2})`);

        arcsGroup
            .selectAll('.outlineArc')
            .data(pieData)
            .enter()
            .append('path')
            .attr('fill', 'transparent')
            .attr('stroke', 'gray')
            .attr('d', outlineArc)
            .attr('class', `outlineArc ${styles.outlineArc}`)
            .attr('transform', `translate(${width / 2} ${height / 2})`)
            .attr('data-html', true)
            .attr('data-tip', function(d) {
                return d.data.label;
            })
            .on('click', function(d) {
                d.data.onClick();
            });

        // Manage Tooltip

        ReactTooltip.rebuild();
    }, [ref, data]);

    return (
        <>
            <svg
                className="aster-plot-chart"
                ref={ref}
                width={width}
                height={height}
                viewBox={`-5 -5 ${width + 10} ${height + 10}`}
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
            />
            <ReactTooltip />
        </>
    );
};

AsterPlot.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        }),
    ).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export default AsterPlot;
