import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
import { StyleSheet, css } from 'aphrodite/no-important';
import * as d3 from 'd3';
import {
    zoomFunction,
    transformDataIntoMapArray,
    getMinMaxValue,
    cutStr,
    findNearestTickPosition,
    generateUniqueId,
} from './utils';
import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import moment from 'moment';

import * as colorUtils from '../colorUtils';

import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import LoadingGraph from '../shared/LoadingGraph';
import MouseIcon from '../shared/MouseIcon';

import theme from '../../theme';
import CenterIcon from '../shared/CenterIcon';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = StyleSheet.create({
    divContainer: {
        overflow: 'hidden',
        position: 'relative',
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
        'white-space': 'nowrap',
        padding: '5px',
        margin: '-5px',
    },
    graphItemTooltip: {
        color: '#000000',
        position: 'relative',
        borderStyle: 'solid',
        borderColor: '#9e9e9e',
        borderRadius: '6px',
        marginLeft: '20px',
        marginRight: '20px',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '15px',
        paddingBottom: '5px',
        paddingLeft: '15px',
        paddingRight: '5px',
        height: '65px',
        marginBottom: '10px',
    },
    legendItemTooltip: {
        visibility: 'hidden',
        position: 'absolute',
        color: '#000000',
        borderStyle: 'solid',
        borderColor: '#9e9e9e',
        borderRadius: '6px',
        paddingTop: '15px',
        paddingBottom: '5px',
        paddingLeft: '15px',
        paddingRight: '5px',
        left: '0px',
        right: '20px',
        top: '-75px',
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

export const defaultArgs = {
    colors: colorUtils.MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH,
    maxLegendLength: 30,
    height: 300,
};

const stylesWithClassnames = stylesToClassname({
    icon: {
        color: theme.green.primary,
        ':hover': {
            color: theme.purple.primary,
            cursor: 'pointer',
        },
    },
});

let zoom;

class Streamgraph extends PureComponent {
    _isMounted = false;
    mouseIcon = '';
    centerIcon = '';

    constructor(props) {
        super(props);
        this.state = {
            width: 800,
            height: this.props.height || defaultArgs.height,
            margin: { top: 60, right: 40, bottom: 50, left: 60 },
        };
        this.centerGraphClick = this.centerGraphClick.bind(this);
        this.divContainer = React.createRef();
        this.svgContainer = React.createRef();
        this.graphZone = React.createRef();
        this.anchor = React.createRef();

        this.mouseIsOverStream = false;
        this.zoomFunction = zoomFunction.bind(this);
        this.uniqueId = generateUniqueId();
    }

    static defaultProps = {
        args: defaultArgs,
    };

    centerGraphClick() {
        d3.select(this.graphZone.current).call(zoom.transform, d3.zoomIdentity);
        this.updateDimensions();
    }

    initTheGraphBasicsElements(width, height, margin, svgViewport) {
        zoom = d3
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
                colorList = defaultArgs.colors;
            }
            let z = colorList.split(' ');
            while (z.length < layersNumber) {
                z = [...z, ...z];
            }
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
            .attr('class', `remove ${css(styles.graphItemTooltip)}`)
            .attr('id', 'tooltip')
            .style('z-index', '2')
            .style('visibility', 'hidden');

        return { tooltip, vertical };
    }

    createAndSetTheLegend(d3DivContainer, colorNameList, width) {
        const legendView = d3DivContainer
            .append('div')
            .attr('id', 'legend')
            .attr('class', `${css(styles.legend)}`)
            .style('column-count', width > 500 ? 3 : 2);

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
                .text(
                    cutStr(
                        element.name,
                        this.props.maxLegendLength ||
                            defaultArgs.maxLegendLength,
                    ),
                );

            const legendItemTooltip = legendItemContainer
                .append('span')
                .attr('class', `${css(styles.legendItemTooltip)}`)
                .text(element.name)

                .html(
                    '<p>' +
                        '<svg width="15" height="15" style="vertical-align: middle; background-color: ' +
                        element.color +
                        '"></svg> ' +
                        element.name +
                        '</p>',
                );

            legendItemContainer
                .on('mouseover', () => {
                    legendItemTooltip.style('visibility', 'visible');

                    this.streams
                        .transition()
                        .duration(25)
                        .attr('opacity', (d, j) => {
                            return j != colorNameList.length - index - 1
                                ? 0.3
                                : 1;
                        });
                })
                .on('mousemove', () => {
                    legendItemTooltip.style('visibility', 'visible');
                })
                .on('mouseout', () => {
                    legendItemTooltip.style('visibility', 'hidden');

                    this.streams
                        .transition()
                        .duration(25)
                        .attr('opacity', () => 1);
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

                    this.hoveredColor = colorNameList.find(
                        elem => elem.name === this.hoveredKey,
                    ).color;

                    d3.select(nodes[i]).classed('hover', true);
                    tooltip
                        .html(
                            '<p>' +
                                '<svg width="15" height="15" style="vertical-align: middle; background-color: ' +
                                this.hoveredColor +
                                '"></svg>' +
                                '<ul style="list-style: none;text-indent:-35px">' +
                                '<li>' +
                                this.hoveredKey +
                                '</li>' +
                                '<li>' +
                                date +
                                ' : ' +
                                this.hoveredValue +
                                '</li></ul></p>',
                        )
                        .style('visibility', 'visible');
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
            this.streams.on('mouseout', function() {
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

        // if the icon content is available before componentDidMount, the content prints weirdly in a corner of the page
        this.mouseIcon = <MouseIcon polyglot={this.props.p} />;
        this.centerIcon = <CenterIcon polyglot={this.props.p} />;
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
        const { width } = this.state;
        const height = this.props.height || defaultArgs.height;

        // since the data comes in the form of an Array, we wait for that to hide the loading label
        let loading = <LoadingGraph polyglot={this.props.p} />;
        if (Array.isArray(this.props.formatData)) {
            loading = '';
        }

        return (
            <div
                ref={this.divContainer}
                style={styles.divContainer}
                id={`divContainer${this.uniqueId}`}
            >
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '24px',
                        paddingTop: '5px',
                    }}
                >
                    {loading}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: 150 + (height - defaultArgs.height) + 'px',
                        left: '5px',
                    }}
                >
                    {this.mouseIcon}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: 210 + (height - defaultArgs.height) + 'px',
                        left: '12px',
                    }}
                    onClick={this.centerGraphClick}
                    className={stylesWithClassnames.icon}
                >
                    {this.centerIcon}
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
    colors: PropTypes.string.isRequired,
    formatData: PropTypes.array.isRequired,
    maxLegendLength: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export default compose(
    injectData(),
    exportableToPng,
)(Streamgraph);
