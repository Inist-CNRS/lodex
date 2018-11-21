import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
import * as d3 from 'd3';

import {
    zoomFunction,
    distinctColors,
    transformDataIntoMapArray,
    getMinMaxValue,
    cutStr,
} from './utils';
import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        divContainer: {
            overflow: 'hidden',
            position: 'relative',
        },
        tooltip: {
            position: 'absolute',
        },
        vertical: {
            marginTop: 60,
            height: 190,
            pointerEvents: 'none',
        },
        legend: {
            position: 'relative',
            columnCount: 3,
            textAlign: 'left',
            marginLeft: 20,
            paddingBottom: 30,
        },
        legendItem: {
            marginTop: 2,
        },
        legendItemTooltip: {
            visibility: 'hidden',
            backgroundColor: '#4e4e4e',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '6px',
            padding: '5px 0',

            position: 'absolute',
            zIndex: 10,
        },
        legendItemText: {
            marginLeft: 5,
        },
        legendButton: {
            height: 15,
            width: 15,
        },
    },
    'stream-graph',
);

const WIDTH = 800;
const HEIGHT = 300;

class Streamgraph extends PureComponent {
    constructor(props) {
        super(props);

        this.divContainer = React.createRef();
        this.svgContainer = React.createRef();
        this.anchor = React.createRef();

        this.mouseIsOverStream = false;
        this.zoomFunction = zoomFunction.bind(this);
    }

    initTheGraphBasicsElements(width, height, margin, svgViewport) {
        const zoom = d3
            .zoom()
            .scaleExtent([1, 32])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom', this.zoomFunction);

        const innerSpace = svgViewport
            .append('g')
            .attr('width', width)
            .attr('class', 'inner_space')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        innerSpace
            .append('defs')
            .append('clipPath')
            .attr('id', 'mask')
            .append('rect')
            .attr('width', width)
            .attr('height', height);

        const graphZone = innerSpace
            .append('g')
            .attr('width', width)
            .attr('height', height)
            .attr('clip-path', 'url(#mask)')
            .call(zoom);

        graphZone
            .append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('opacity', 0);

        return { innerSpace, graphZone };
    }

    stackDatas(nameList, valuesArray) {
        if (
            valuesArray.length <= 0 ||
            nameList === undefined ||
            nameList.length <= 0
        ) {
            return null;
        }

        const stackMethod = d3
            .stack()
            .keys(nameList)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetWiggle);

        return stackMethod(valuesArray);
    }

    createAndSetAxis(
        minDate,
        maxDate,
        minValue,
        maxValue,
        width,
        height,
        innerSpace,
    ) {
        const min = new Date(String(minDate));
        const max = new Date(String(maxDate));

        this.xAxisScale = d3
            .scaleTime()
            .domain([min, max])
            .range([0, width]);

        this.xAxis = d3
            .axisBottom(this.xAxisScale)
            .tickFormat(d3.timeFormat('%Y'))
            .ticks(d3.timeYear, 1);

        this.gx = innerSpace
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(this.xAxis);

        this.yAxisScale = d3
            .scaleLinear()
            .domain([minValue, maxValue])
            .range([height, 0]);

        this.yAxisL = d3.axisLeft(this.yAxisScale);
        this.yAxisR = d3.axisRight(this.yAxisScale);

        this.gyr = innerSpace
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + width + ', 0)')
            .call(this.yAxisR);

        this.gyl = innerSpace
            .append('g')
            .attr('class', 'y axis')
            .call(this.yAxisL);
    }

    createAndSetStreams(layersNumber, graphZone, stackedData, nameList) {
        const colorNameList = [];
        if (stackedData) {
            const z = distinctColors(layersNumber);
            const area = d3
                .area()
                .x(d => {
                    return this.xAxisScale(d.data.date);
                })
                .y0(d => {
                    return this.yAxisScale(d[0]);
                })
                .y1(d => {
                    return this.yAxisScale(d[1]);
                });

            this.streams = graphZone
                .selectAll('path')
                .data(stackedData)
                .enter()
                .append('path')
                .attr('d', d => (d ? area(d) : []))
                .attr('name', (d, i) => {
                    const currentName = nameList[i];
                    const currentColor = z[i];
                    colorNameList.push({
                        name: currentName,
                        color: currentColor,
                    });
                    return currentName;
                })
                .attr('opacity', 1)
                .attr('fill', (d, i) => z[i]);
        }
        return colorNameList;
    }

    createAndSetDataReader(divContainer, height, margin) {
        const vertical = divContainer
            .insert('div', '#svgContainer')
            .attr('id', 'vertical')
            .style('position', 'absolute') // need relative in parent
            .style('z-index', '19')
            .style('width', '1px')
            .style('height', `${height}px`)
            .style('top', '10px')
            .style('bottom', '30px')
            .style('left', '0px')
            .style('margin-top', `${margin.top - 10}px`)
            .style('pointer-events', 'none')
            .style('background', '#000');

        const tooltip = divContainer
            .insert('div', '#svgContainer')
            .attr('class', `remove ${styles.tooltip}`)
            .attr('id', 'tooltip')
            .style('position', 'absolute')
            .style('z-index', '2')
            .style('visibility', 'hidden')
            .style('top', '4px')
            .style('left', '12px');

        return { tooltip, vertical };
    }

    createAndSetTheLegend(d3DivContainer, colorNameList) {
        const legendView = d3DivContainer
            .append('div')
            .attr('id', 'legend')
            .attr('class', `${styles.legend}`);

        const colorNameTmpList = colorNameList;
        colorNameTmpList.reverse();

        colorNameList.forEach((item, index) => {
            const element = colorNameList[index];
            const legendItemContainer = legendView
                .append('div')
                .attr('class', `${styles.legendItem}`);

            legendItemContainer
                .append('svg')
                .attr('width', 15)
                .attr('height', 15)
                .style('background-color', element.color);

            legendItemContainer
                .append('text')
                .attr('class', `${styles.legendItemText}`)
                .text(cutStr(element.name));

            const legendItemTooltip = legendItemContainer
                .append('span')
                .attr('class', `${styles.legendItemTooltip}`)
                .text(element.name);

            legendItemContainer
                .on('mouseover', () => {
                    legendItemTooltip.style('visibility', 'visible');
                })
                .on('mousemove', () => {
                    legendItemTooltip.style('visibility', 'visible');
                })
                .on('mouseout', () => {
                    legendItemTooltip.style('visibility', 'hidden');
                });
        });
    }

    setViewportEvents(svgViewport, vertical) {
        const componentContext = this;
        svgViewport
            .on('mouseover', function() {
                if (componentContext.mouseIsOverStream) {
                    let mousex = d3.mouse(this);
                    mousex = mousex[0];
                    vertical.style('visibility', 'visible');
                    vertical.style('left', mousex + 'px');
                } else {
                    vertical.style('visibility', 'hidden');
                }
            })
            .on('mousemove', function() {
                if (componentContext.mouseIsOverStream) {
                    let mousex = d3.mouse(this);
                    mousex = mousex[0];
                    vertical.style('visibility', 'visible');
                    vertical.style('left', mousex + 'px');
                } else {
                    vertical.style('visibility', 'hidden');
                }
            });
    }

    setMouseMoveAndOverStreams(tooltip) {
        const componentContext = this;

        if (this.streams) {
            this.streams
                .on('mousemove', function(d) {
                    const mousex = d3.mouse(this)[0];
                    const date = componentContext.xAxisScale.invert(mousex);
                    componentContext.mouseIsOverStream = true;
                    this.hoveredKey = d3.select(this).attr('name');

                    this.hoveredValue = d.find(
                        elem =>
                            elem.data.date.getFullYear() === date.getFullYear(),
                    ).data[this.hoveredKey];

                    d3
                        .select(this)
                        .classed('hover', true)
                        .attr('stroke', '#000')
                        .attr('stroke-width', '0.5px'),
                        tooltip
                            .html(
                                '<p>' +
                                    this.hoveredKey +
                                    '<br>' +
                                    this.hoveredValue +
                                    '</p>',
                            )
                            .style('visibility', 'visible');
                })
                .on('mouseover', (d, i) => {
                    componentContext.mouseIsOverStream = true;
                    this.streams
                        .transition()
                        .duration(25)
                        .attr('opacity', (d, j) => {
                            return j != i ? 0.3 : 1;
                        });
                });
        }
    }

    setMouseOutStreams(tooltip) {
        const componentContext = this;

        if (this.streams) {
            this.streams.on('mouseout', function() {
                componentContext.mouseIsOverStream = false;
                componentContext.streams
                    .transition()
                    .duration(25)
                    .attr('opacity', '1');
                d3
                    .select(this)
                    .classed('hover', false)
                    .attr('stroke-width', '0px'),
                    tooltip
                        .html(
                            '<p>' +
                                this.hoveredKey +
                                '<br>' +
                                this.hoveredValue +
                                '</p>',
                        )
                        .style('visibility', 'hidden');
            });
        }
    }

    setTheEventsActions(svgViewport, vertical, tooltip) {
        // Can't split events in different blocks because .on("") events
        // definition erase the previous ones
        this.setViewportEvents(svgViewport, vertical);
        this.setMouseMoveAndOverStreams(tooltip);
        this.setMouseOutStreams(tooltip);
    }

    setGraph() {
        const {
            valuesObjectsArray,
            valuesArray,
            dateMin,
            dateMax,
            namesList,
        } = transformDataIntoMapArray(this.props.formatData);

        const svgWidth = this.divContainer.current.clientWidth;

        const margin = { top: 60, right: 40, bottom: 50, left: 60 };
        const width = svgWidth - margin.left - margin.right;
        const height = HEIGHT - margin.top - margin.bottom;

        const divContainer = d3.select(this.divContainer.current);

        const d3DivContainer = divContainer
            .attr('class', `${styles.divContainer}`)
            .append('div')
            .attr('id', 'd3DivContainer');

        const svgViewport = d3.select(this.anchor.current);

        d3.select(this.svgContainer.current).attr('width', svgWidth);

        const layersNumber = valuesObjectsArray.length;

        const stackedData = this.stackDatas(namesList, valuesArray);
        const { minValue, maxValue } = getMinMaxValue(stackedData);

        const { innerSpace, graphZone } = this.initTheGraphBasicsElements(
            width,
            height,
            margin,
            svgViewport,
        );

        const { tooltip, vertical } = this.createAndSetDataReader(
            divContainer,
            height,
            margin,
        );

        this.createAndSetAxis(
            dateMin,
            dateMax,
            minValue,
            maxValue,
            width,
            height,
            innerSpace,
        );

        const colorNameList = this.createAndSetStreams(
            layersNumber,
            graphZone,
            stackedData,
            namesList,
        );

        this.createAndSetTheLegend(d3DivContainer, colorNameList);
        this.setTheEventsActions(svgViewport, vertical, tooltip);
    }

    componentDidMount() {
        this.setGraph();
    }

    UNSAFE_componentWillUpdate() {
        d3.select(this.divContainer.current)
            .selectAll('#d3DivContainer')
            .selectAll('div')
            .remove();

        d3.select(this.divContainer.current)
            .selectAll('#d3DivContainer')
            .remove();

        d3.select(this.divContainer.current)
            .selectAll('#vertical')
            .remove();

        d3.select(this.anchor.current)
            .selectAll('g')
            .remove();

        d3.select(this.anchor.current)
            .selectAll('defs')
            .remove();
    }

    componentDidUpdate() {
        this.setGraph();
    }

    render() {
        return (
            <div
                id="divContainer"
                ref={this.divContainer}
                style={styles.divContainer}
            >
                <svg
                    id="svgContainer"
                    ref={this.svgContainer}
                    width={WIDTH}
                    height={HEIGHT}
                >
                    <g id="anchor" ref={this.anchor} />
                </svg>
            </div>
        );
    }
}

export default compose(
    injectData(),
    exportableToPng,
)(Streamgraph);
