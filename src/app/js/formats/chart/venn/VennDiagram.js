import * as venn from 'venn.js';
import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import { getColor } from '../../utils/colorUtils';
import PropTypes from 'prop-types';


const margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 0,
};

const VennDiagram = ({ input, width, height, colorSet }) => {
    const ref = useRef(null);
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const sets = input
        .filter( (item, idex, all) => all.find(x => item.target === x.source ))
        .map(item => {
            if (item.source === item.target) {
                return { sets: [item.source], size: item.weight };
            }
            return {sets: [item.source, item.target], size: item.weight };
        });
    useEffect(() => {
        const buildVenn = venn.VennDiagram().width(width).height(height);

        const svg = d3
            .select(ref.current)
            .datum(sets)
            .call(buildVenn)
        svg.selectAll(".venn-circle path")
            .style("fill-opacity", 0)
            .style("stroke-width", 10)
            .style("stroke-opacity", .5)
            .style("stroke", (d, index) => getColor(colorSet, index));

        svg.selectAll(".venn-circle text")
            .style("fill", (d, index) => getColor(colorSet, index))
            .style("font-size", "32px")
            .style("font-weight", "100");


        let tooltip = d3.select("body").append("div").attr("class", "venntooltip");
        d3.selectAll(".venn-area")
            .on("mouseover", function (d, i) {
                // sort all the areas relative to the current item
                venn.sortAreas(svg, i);
                // highlight the current path
                const selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("fill-opacity", .1)
                    .style("stroke-width", 10)
                    .style("stroke-opacity", 1);
            })
            .on("mousemove", function (event, d) {
                tooltip.style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");

                // Display a tooltip with the current size
                tooltip.transition().duration(400).style("opacity", "0.9");
                tooltip.text(d.size);
                tooltip
                    .style("position", "absolute")
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY - 28 + "px");
            })
            .on("mouseout", function (d, i) {
                tooltip.transition().duration(400).style("opacity", 0);
                const selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("fill-opacity", 0)
                    .style("stroke-width", 10)
                    .style("stroke-opacity", .5);
            });

    }, [ref, sets]);

    return (
        <svg
            className="venn-chart"
            ref={ref}
            width={chartWidth + margin.left + margin.right}
            height={chartHeight + margin.top + margin.bottom}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        />
    );
}
VennDiagram.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    input: PropTypes.arrayOf({
        sets: PropTypes.arrayOf(PropTypes.string).isRequired,
        size: PropTypes.number.isRequired,
    }),
};

export default VennDiagram;
