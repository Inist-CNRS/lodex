import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
import { StyleSheet, css } from 'aphrodite/no-important';
import * as d3 from 'd3';
import {
    zoomFunction,
    transformDataIntoMapArray,
    getMinMaxValue,
    cutStr,
    findFirstTickPosition,
    findNearestTickPosition,
    generateUniqueId,
} from './utils';
import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import moment from 'moment';

import * as colorUtils from '../colorUtils';
import ReactTooltip from 'react-tooltip';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = StyleSheet.create({
    divContainer: {
        overflow: 'hidden',
        position: 'relative',
    },
    tooltip: {
        position: 'relative',
        height: '65px',
        marginLeft: '20px',
        marginRight: '20px',
        backgroundColor: 'rgb(232, 232, 232)',
        borderRadius: '0.45rem',
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        paddingTop: '14px',
    },
    vertical: {
        marginTop: 60,
        height: 190,
        pointerEvents: 'none',
    },
    legend: {
        position: 'relative',
        textAlign: 'left',
        marginLeft: 20,
        columnCount: 3,
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
        padding: '5px 4px',

        position: 'absolute',
        left: '0px',
        top: '-33px',
        zIndex: 10,
    },
    legendItemText: {
        marginLeft: 5,
    },
    legendButton: {
        height: 15,
        width: 15,
    },
    zoomIcon: {
        position: 'absolute',
        top: '210px',
        left: '55px',
    },
});

class Streamgraph extends PureComponent {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            width: 800,
            height: 300,
            margin: { top: 60, right: 40, bottom: 50, left: 60 },
        };
        this.divContainer = React.createRef();
        this.svgContainer = React.createRef();
        this.anchor = React.createRef();
        this.zoomIndicator = React.createRef();
        this.zoomIndicatorBackground = React.createRef();

        this.mouseIsOverStream = false;
        this.zoomFunction = zoomFunction.bind(this);
        this.uniqueId = generateUniqueId();
    }

    initTheGraphBasicsElements(width, height, margin, svgViewport) {
        const zoom = d3
            .zoom()
            .scaleExtent([1, 99999])
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
            .attr('id', `mask${this.uniqueId}`)
            .append('rect')
            .attr('width', width)
            .attr('height', height);

        const graphZone = innerSpace
            .append('g')
            .attr('width', width)
            .attr('height', height)
            .attr('clip-path', `url(#mask${this.uniqueId})`)
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
        const minMoment = moment(`01/01/${minDate}`, 'DD/MM/YYYY', true);
        const maxMoment = moment(`01/01/${maxDate}`, 'DD/MM/YYYY', true);

        this.xAxisScale = d3
            .scaleTime()
            .domain([minMoment.toDate(), maxMoment.toDate()])
            .range([0, width]);

        this.xAxis = d3
            .axisBottom()
            .tickFormat(d3.timeFormat('%Y'))
            .tickPadding(5)
            .ticks(d3.timeYear)
            .scale(this.xAxisScale);

        this.gx = innerSpace
            .append('g')
            .attr('class', `xAxis${this.uniqueId}`)
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
            .style('visibility', 'hidden')
            .call(this.yAxisR);

        this.gyl = innerSpace
            .append('g')
            .attr('class', 'y axis')
            .style('visibility', 'hidden')
            .call(this.yAxisL);
    }

    createAndSetStreams(layersNumber, graphZone, stackedData, nameList) {
        const colorNameList = [];
        if (stackedData) {
            let colorList = this.props.colors;
            if (!colorList) {
                colorList =
                    colorUtils.MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH;
            }
            let z = colorList.split(' ');
            while (z.length < layersNumber) {
                z = [...z, ...z];
            }
            const area = d3
                .area()
                .x((d, i) => {
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
            .insert('div', `#svgContainer${this.uniqueId}`)
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
            .style('visibility', 'hidden')
            .style('background', '#000');

        const tooltip = divContainer
            .insert('div', '#d3DivContainer')
            .attr('class', `remove ${css(styles.tooltip)}`)
            .attr('id', 'tooltip')
            .style('z-index', '2')
            .style('visibility', 'hidden')
            .style('marginLeft', '20px');

        return { tooltip, vertical };
    }

    createAndSetTheLegend(d3DivContainer, colorNameList, width) {
        const legendView = d3DivContainer
            .append('div')
            .attr('id', 'legend')
            .attr('class', `${css(styles.legend)}`);

        width > 500
            ? legendView.style('column-count', 3)
            : legendView.style('column-count', 2);

        const colorNameTmpList = colorNameList;
        colorNameTmpList.reverse();

        colorNameList.forEach((item, index) => {
            const element = colorNameList[index];
            const legendItemContainer = legendView
                .append('div')
                .attr('class', `${css(styles.legendItem)}`);

            legendItemContainer
                .append('svg')
                .attr('width', 15)
                .attr('height', 15)
                .style('vertical-align', 'middle')
                .style('background-color', element.color);

            legendItemContainer
                .append('text')
                .attr('class', `${css(styles.legendItemText)}`)
                .text(cutStr(element.name));

            const legendItemTooltip = legendItemContainer
                .append('span')
                .attr('class', `${css(styles.legendItemTooltip)}`)
                .text(element.name);

            legendItemContainer
                .on('mouseover', (d, i) => {
                    legendItemTooltip.style('visibility', 'visible');
                })
                .on('mousemove', (d, i) => {
                    legendItemTooltip.style('visibility', 'visible');
                })
                .on('mouseout', (d, i) => {
                    legendItemTooltip.style('visibility', 'hidden');
                });
        });
    }

    setViewportEvents(svgViewport, vertical) {
        svgViewport
            .on('mouseover', (d, i, nodes) => {
                if (this.mouseIsOverStream) {
                    const mousex = d3.mouse(nodes[i])[0];
                    const { tickPosition, tickValue } = findNearestTickPosition(
                        mousex,
                        this.uniqueId,
                    );
                    this.nearestTickPosition = tickPosition;
                    this.nearestTickValue = tickValue;
                    vertical.style('visibility', 'visible');
                    vertical.style('left', this.nearestTickPosition + 'px');
                } else {
                    vertical.style('visibility', 'hidden');
                }
            })
            .on('mousemove', (d, i, nodes) => {
                if (this.mouseIsOverStream) {
                    const mousex = d3.mouse(nodes[i])[0];
                    const { tickPosition, tickValue } = findNearestTickPosition(
                        mousex,
                        this.uniqueId,
                    );
                    this.nearestTickPosition = tickPosition;
                    this.nearestTickValue = tickValue;
                    vertical.style('visibility', 'visible');
                    vertical.style('left', this.nearestTickPosition + 'px');
                } else {
                    vertical.style('visibility', 'hidden');
                }
            });
    }

    setMouseMoveAndOverStreams(tooltip, colorNameList) {
        if (this.streams) {
            this.streams
                .on('mousemove', (d, i, nodes) => {
                    const date = this.nearestTickValue;
                    this.mouseIsOverStream = true;
                    this.hoveredKey = d3.select(nodes[i]).attr('name');

                    this.hoveredValue = d.find(
                        elem => elem.data.date.getFullYear() === parseInt(date),
                    ).data[this.hoveredKey];

                    d3.select(nodes[i]).classed('hover', true);
                    tooltip
                        .html(
                            '<p>' +
                                '<svg width="15" height="15" style="vertical-align: middle; background-color: ' +
                                this.hoveredColor +
                                '"></svg>' +
                                '  ' +
                                this.hoveredKey +
                                '<br>' +
                                this.hoveredValue +
                                '</p>',
                        )
                        .style('visibility', 'visible');

                    this.hoveredColor = colorNameList.find(
                        elem => elem.name === this.hoveredKey,
                    ).color;
                })
                .on('mouseover', (d, i) => {
                    this.mouseIsOverStream = true;
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
            this.streams.on('mouseout', function(d, i) {
                componentContext.mouseIsOverStream = false;
                componentContext.streams
                    .transition()
                    .duration(25)
                    .attr('opacity', '1');
                d3.select(this).classed('hover', false);
                tooltip
                    .html(
                        '<p>  ' +
                            this.hoveredKey +
                            '<br>' +
                            this.hoveredValue +
                            '</p>',
                    )
                    .style('visibility', 'hidden');
            });
        }
    }

    setTheEventsActions(svgViewport, vertical, tooltip, colorNameList) {
        // Can't split events in different blocks because .on("") events
        // definition erase the previous ones
        this.setViewportEvents(svgViewport, vertical);
        this.setMouseMoveAndOverStreams(tooltip, colorNameList);
        this.setMouseOutStreams(tooltip);
    }

    updateDimensions() {
        this.removeGraph();
        this.setGraph();
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
        const { margin, height: svgHeight } = this.state;
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
        if (this._isMounted) {
            this.setState({ width: width });
        }
        const divContainer = d3.select(this.divContainer.current);

        const d3DivContainer = divContainer
            .attr('class', `${css(styles.divContainer)}`)
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

        this.createAndSetTheLegend(d3DivContainer, colorNameList, width);
        this.setTheEventsActions(svgViewport, vertical, tooltip, colorNameList);
    }

    removeGraph() {
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

        d3.select(this.divContainer.current)
            .selectAll('#tooltip')
            .remove();

        d3.select(this.anchor.current)
            .selectAll('g')
            .remove();

        d3.select(this.anchor.current)
            .selectAll('defs')
            .remove();
    }

    componentDidMount() {
        this._isMounted = true;
        window.addEventListener('resize', this.updateDimensions.bind(this));
        this.setGraph();
    }

    UNSAFE_componentWillUpdate() {
        this.removeGraph();
    }

    componentDidUpdate() {
        this.setGraph();
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('resize', this.updateDimensions.bind(this));
        this.removeGraph();
    }

    render() {
        const { width, height, margin } = this.state;
        const { p: polyglot } = this.props;

        return (
            <div
                ref={this.divContainer}
                style={styles.divContainer}
                id={`divContainer${this.uniqueId}`}
            >
                <div
                    style={{ position: 'absolute', top: '210px', left: '5px' }}
                >
                    <svg
                        data-tip
                        data-for="mouseIconTooltip"
                        width="45"
                        height="45"
                        viewBox="0 0 197.896 197.896"
                    >
                        <path
                            d="M102.004 56.098c-.054-4.559 2.061-8.12 4.119-11.581 2.713-4.574 5.522-9.305 3.568-15.808-1.986-5.966-5.751-8.893-9.087-11.495-4.488-3.482-7.727-5.998-6.038-15.543l.147-.82L89.883 0l-.143.812c-2.201 12.469 3.142 16.617 7.856 20.278 3.042 2.373 5.916 4.61 7.415 9.097 1.31 4.381-.644 7.669-3.11 11.832-2.294 3.869-4.889 8.231-4.828 14.076-24.469.025-49.47 1.041-49.47 88.004 0 39.192 31.49 53.797 51.346 53.797 19.845 0 51.346-14.605 51.346-53.797-.001-86.859-25.479-87.929-48.291-88.001zm-.604 4.907c20.195.043 39.106.845 43.172 57.809-13.814 6.46-28.33 9.896-43.172 10.236v-10.615c3.024-.58 5.3-3.253 5.3-6.378V80.005c0-3.135-2.28-5.801-5.3-6.385V61.005zM97.724 78.38h2.452a1.63 1.63 0 0 1 1.621 1.625v32.052c0 .891-.73 1.607-1.621 1.607h-2.452a1.612 1.612 0 0 1-1.618-1.607V80.005c0-.891.727-1.625 1.618-1.625zm-1.235-17.375V73.62c-3.024.583-5.293 3.257-5.293 6.385v32.052c0 3.124 2.269 5.798 5.293 6.378v10.615c-22.586-.53-39.027-8.06-43.172-10.16 4.048-57.047 22.97-57.842 43.172-57.885zm2.459 131.97c-17.952 0-46.439-13.267-46.439-48.88 0-7.097.161-13.789.48-19.909 7.168 3.325 23.964 9.806 46.053 9.806 15.725 0 31.15-3.343 45.856-9.917.319 6.148.483 12.884.483 20.024-.001 35.609-28.481 48.876-46.433 48.876z"
                            fill="#010002"
                        />
                        <path
                            fill="#010002"
                            d="M114.742 70.936l-4.807 5.87h9.602zM114.913 121.223l4.796-5.869h-9.591z"
                        />
                    </svg>

                    <ReactTooltip id="mouseIconTooltip" effect="solid">
                        <ul>
                            {polyglot.t('user_can_interact_with_mouse_1')}
                            {<br />}
                            {polyglot.t('user_can_interact_with_mouse_2')}
                        </ul>
                    </ReactTooltip>
                </div>

                <svg
                    id={`svgContainer${this.uniqueId}`}
                    ref={this.svgContainer}
                    width={width}
                    height={height}
                >
                    <g id="anchor" ref={this.anchor} />
                </svg>
            </div>
        );
    }
}

Streamgraph.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(
    injectData(),
    exportableToPng,
)(Streamgraph);
