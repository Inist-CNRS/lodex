// @ts-expect-error TS6133
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';

import { getColor } from '../../utils/colorUtils';
import stylesToClassname from '../../../lib/stylesToClassName';

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

// @ts-expect-error TS7031
const AsterPlot = ({ data, width, height, colorSet }) => {
    const ref = useRef(null);
    // @ts-expect-error TS7006
    const createPie = d3.pie().value((d) => d.value);

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
        // @ts-expect-error TS7034
        let tempEndAngle;
        let endAngleIndex = 0;
        // @ts-expect-error TS7034
        let tempEndAngle1;

        const computeStartAngle = () => {
            let startAngle = 0;
            let endAngle = 0;
            if (startAngleIndex === 0) {
                startAngle = 0;
                endAngle = startAngle + arcDegrees;
            } else {
                // @ts-expect-error TS7005
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
                // @ts-expect-error TS7005
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
            // @ts-expect-error TS7006
            .outerRadius(function (d) {
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
            // @ts-expect-error TS7006
            .attr('fill', (_, i) => getColor(colorSet, i))
            .attr('d', filledArc)
            // @ts-expect-error TS2339
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
            // @ts-expect-error TS2339
            .attr('class', `outlineArc ${styles.outlineArc}`)
            .attr('transform', `translate(${width / 2} ${height / 2})`)
            .attr('data-html', true)
            // @ts-expect-error TS7006
            .attr('data-tip', function (d) {
                return d.data.label;
            })
            // @ts-expect-error TS7006
            .on('click', function (_event, d) {
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
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

export default AsterPlot;
