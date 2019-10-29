import React, { createRef, Component } from 'react';
import * as d3 from 'd3';

class AsterPlot extends Component {
    constructor(props) {
        super(props);
        this.ref = createRef();
        this.createPie = d3
            .pie()
            .value(d => d.value)
            .sort(null);
        this.createArc = d3.arc();
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
        this.format = d3.format('.2f');
    }

    UNSAFE_componentDidMount() {
        const svg = d3.select(this.ref.current);
        const { data, width, height } = this.props;
        const pieData = this.createPie(data);
        svg.attr('class', 'chart')
            .attr('width', width)
            .attr('height', height);

        const group = svg.append('g').attr('transform', `translate(90 90)`);
        const groupWithEnter = group
            .selectAll('g.arc')
            .data(pieData)
            .enter();
        const path = groupWithEnter.append('g').attr('class', 'arc');
        path.append('path')
            .attr('class', 'arc')
            .attr('d', this.createArc);
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        const svg = d3.select(this.ref.current);
        const data = this.createPie(nextProps.data);
        let radius = Math.min(this.props.width, this.props.height) / 2;
        const circumferenceOfCircle = radius * Math.PI * 2;
        const arcLength = circumferenceOfCircle / data.length;

        const arcDegrees = (arcLength / circumferenceOfCircle) * (Math.PI * 2);
        const group = svg
            .select('g')
            .selectAll('g.arc')
            .data(data);
        group.exit().remove();
        const groupWithUpdate = group
            .enter()
            .append('g')
            .attr('class', 'arc');

        let inner = 0.2 * radius;
        let i = 0;
        let tempEndAngle;
        let j = 0;
        let tempEndAngle1;
        this.createArc = d3
            .arc()
            .innerRadius(inner)
            .outerRadius(function(d) {
                return (radius - inner) * (d.data.value / 100) + inner;
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

        const path = groupWithUpdate
            .enter()
            .append('path')
            .merge(group.select('path.arc'));

        path.attr('class', 'arc')
            .attr('d', this.createArc)
            .attr('fill', (d, i) => this.colors(i))
            .attr('stroke', (d, i) => this.colors(i))
            .attr('stroke-width', '1');

        let outlineArc = d3
            .arc()
            .innerRadius(inner)
            .outerRadius(function() {
                return radius;
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

        svg.selectAll('.outlineArc')
            .data(data)
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('class', 'outlineArc')
            .attr('d', outlineArc)
            .attr('transform', `translate(90 90)`);

        const text = groupWithUpdate.append('text').merge(group.select('text'));

        text.attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('transform', d => `translate(${this.createArc.centroid(d)})`)
            .text(d => d.value);
    }

    render() {
        return (
            <div>
                <svg ref={this.ref} />
            </div>
        );
    }
}

export default AsterPlot;
