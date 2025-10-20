import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import { StyleSheet, css } from 'aphrodite/no-important';
// @ts-expect-error TS7016
import * as d3 from 'd3';
import {
    zoomFunction,
    transformDataIntoMapArray,
    getMinMaxValue,
    findNearestTickPosition,
    generateUniqueId,
} from './utils';
import injectData from '../../injectData';
// @ts-expect-error TS7016
import cliTruncate from 'cli-truncate';
import moment from 'moment';

import { MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH } from '../../utils/colorUtils';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import LoadingGraph from '../../utils/components/LoadingGraph';
import MouseIcon from '../../utils/components/MouseIcon';

import CenterIcon from '../../utils/components/CenterIcon';
import stylesToClassname from '../../../lib/stylesToClassName';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';

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
    colors: MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH,
    maxLegendLength: 30,
    height: 300,
};

// @ts-expect-error TS2554
const stylesWithClassnames = stylesToClassname({
    icon: {
        color: 'var(--primary-main)',
        ':hover': {
            color: 'var(--info-main)',
            cursor: 'pointer',
        },
    },
});

interface StreamgraphProps {
    p: unknown;
    colors: string;
    formatData: unknown[];
    maxLegendLength: number;
    height: number;
}

class Streamgraph extends PureComponent<StreamgraphProps> {
    _isMounted = false;
    mouseIcon = '';
    centerIcon = '';

    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.state = {
            width: 800,
            height: this.props.height || defaultArgs.height,
            margin: { top: 60, right: 40, bottom: 50, left: 60 },
        };
        this.centerGraphClick = this.centerGraphClick.bind(this);
        // @ts-expect-error TS2339
        this.divContainer = React.createRef();
        // @ts-expect-error TS2339
        this.svgContainer = React.createRef();
        // @ts-expect-error TS2339
        this.anchor = React.createRef();

        // @ts-expect-error TS2339
        this.mouseIsOverStream = false;
        // @ts-expect-error TS2339
        this.zoomFunction = zoomFunction.bind(this);
        // @ts-expect-error TS2339
        this.uniqueId = generateUniqueId();
    }

    static defaultProps = {
        args: defaultArgs,
    };

    centerGraphClick() {
        this.updateDimensions();
    }

    // @ts-expect-error TS7006
    initTheGraphBasicsElements(width, height, margin, svgViewport) {
        const zoom = d3
            .zoom()
            .scaleExtent([1, 99999])
            .translateExtent([
                [0, 0],
                [width, height],
            ])
            .extent([
                [0, 0],
                [width, height],
            ])
            // @ts-expect-error TS2339
            .on('zoom', this.zoomFunction);

        const innerSpace = svgViewport
            .append('g')
            .attr('width', width)
            .attr('class', 'inner_space')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        innerSpace
            .append('defs')
            .append('clipPath')
            // @ts-expect-error TS2339
            .attr('id', `mask${this.uniqueId}`)
            .append('rect')
            .attr('width', width)
            .attr('height', height);

        const graphZone = innerSpace
            .append('g')
            .attr('width', width)
            .attr('height', height)
            // @ts-expect-error TS2339
            .attr('clip-path', `url(#mask${this.uniqueId})`)
            .call(zoom);

        graphZone
            .append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('opacity', 0);

        return { innerSpace, graphZone };
    }

    // @ts-expect-error TS7006
    stackData(nameList, valuesArray) {
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
        // @ts-expect-error TS7006
        minDate,
        // @ts-expect-error TS7006
        maxDate,
        // @ts-expect-error TS7006
        minValue,
        // @ts-expect-error TS7006
        maxValue,
        // @ts-expect-error TS7006
        width,
        // @ts-expect-error TS7006
        height,
        // @ts-expect-error TS7006
        innerSpace,
    ) {
        const minMoment = moment(`01/01/${minDate}`, 'DD/MM/YYYY', true);
        const maxMoment = moment(`01/01/${maxDate}`, 'DD/MM/YYYY', true);

        // @ts-expect-error TS2339
        this.xAxisScale = d3
            .scaleTime()
            .domain([minMoment.toDate(), maxMoment.toDate()])
            .range([0, width]);

        // @ts-expect-error TS2339
        this.xAxis = d3
            .axisBottom()
            .tickFormat(d3.timeFormat('%Y'))
            .tickPadding(5)
            .ticks(d3.timeYear)
            // @ts-expect-error TS2339
            .scale(this.xAxisScale);

        // @ts-expect-error TS2339
        this.gx = innerSpace
            .append('g')
            // @ts-expect-error TS2339
            .attr('class', `xAxis${this.uniqueId}`)
            .attr('transform', 'translate(0,' + height + ')')
            // @ts-expect-error TS2339
            .call(this.xAxis);

        // @ts-expect-error TS2339
        this.yAxisScale = d3
            .scaleLinear()
            .domain([minValue, maxValue])
            .range([height, 0]);

        // @ts-expect-error TS2339
        this.yAxisL = d3.axisLeft(this.yAxisScale);
        // @ts-expect-error TS2339
        this.yAxisR = d3.axisRight(this.yAxisScale);

        // @ts-expect-error TS2339
        this.gyr = innerSpace
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + width + ', 0)')
            .style('visibility', 'hidden')
            // @ts-expect-error TS2339
            .call(this.yAxisR);

        // @ts-expect-error TS2339
        this.gyl = innerSpace
            .append('g')
            .attr('class', 'y axis')
            .style('visibility', 'hidden')
            // @ts-expect-error TS2339
            .call(this.yAxisL);
    }

    // @ts-expect-error TS7006
    createAndSetStreams(layersNumber, graphZone, stackedData, nameList) {
        // @ts-expect-error TS7034
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
                // @ts-expect-error TS7006
                .x((d) => {
                    // @ts-expect-error TS2339
                    return this.xAxisScale(d.data.date);
                })
                // @ts-expect-error TS7006
                .y0((d) => {
                    // @ts-expect-error TS2339
                    return this.yAxisScale(d[0]);
                })
                // @ts-expect-error TS7006
                .y1((d) => {
                    // @ts-expect-error TS2339
                    return this.yAxisScale(d[1]);
                });

            // @ts-expect-error TS2339
            this.streams = graphZone
                .selectAll('path')
                .data(stackedData)
                .enter()
                .append('path')
                // @ts-expect-error TS7006
                .attr('d', (d) => (d ? area(d) : []))
                // @ts-expect-error TS7006
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
                // @ts-expect-error TS7006
                .attr('fill', (d, i) => z[i]);
        }
        // @ts-expect-error TS7005
        return colorNameList;
    }

    // @ts-expect-error TS7006
    createAndSetDataReader(divContainer, height, margin) {
        const vertical = divContainer
            // @ts-expect-error TS2339
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

    // @ts-expect-error TS7006
    createAndSetTheLegend(d3DivContainer, colorNameList, width) {
        const legendView = d3DivContainer
            .append('div')
            .attr('id', 'legend')
            .attr('class', `${css(styles.legend)}`)
            .style('column-count', width > 500 ? 3 : 2);

        const colorNameTmpList = colorNameList;
        colorNameTmpList.reverse();

        // @ts-expect-error TS7006
        colorNameList.forEach((_, index) => {
            const element = colorNameList[index];
            element.id = index;
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
                .attr('id', index++)
                .text(
                    cliTruncate(
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

                    // @ts-expect-error TS2339
                    this.streams
                        .transition()
                        .duration(25)
                        // @ts-expect-error TS7006
                        .attr('opacity', (d, j) => {
                            return j != colorNameList.length - index ? 0.3 : 1;
                        });

                    // @ts-expect-error TS7006
                    colorNameList.forEach((_, index) => {
                        const currentLegendItem = document.getElementById(
                            // @ts-expect-error TS2345
                            colorNameList.length - index - 1,
                        );

                        // @ts-expect-error TS18047
                        currentLegendItem.style.opacity =
                            // @ts-expect-error TS18047
                            currentLegendItem.id == element.id ? 1 : 0.3;
                    });
                })
                .on('mousemove', () => {
                    legendItemTooltip.style('visibility', 'visible');
                })
                .on('mouseout', () => {
                    legendItemTooltip.style('visibility', 'hidden');

                    // @ts-expect-error TS2339
                    this.streams
                        .transition()
                        .duration(25)
                        .attr('opacity', () => 1);

                    // @ts-expect-error TS7006
                    colorNameList.forEach((_, index) => {
                        // @ts-expect-error TS2531
                        document.getElementById(index).style.opacity = '1';
                    });
                });
        });
    }

    // @ts-expect-error TS7006
    setViewportEvents(svgViewport, vertical) {
        svgViewport
            // @ts-expect-error TS7006
            .on('mouseover', (event) => {
                // @ts-expect-error TS2339
                if (this.mouseIsOverStream) {
                    const mousex = d3.pointer(event)[0];
                    const { tickPosition, tickValue } = findNearestTickPosition(
                        mousex,
                        // @ts-expect-error TS2339
                        this.uniqueId,
                    );
                    // @ts-expect-error TS2339
                    this.nearestTickPosition = tickPosition;
                    // @ts-expect-error TS2339
                    this.nearestTickValue = tickValue;
                    vertical.style('visibility', 'visible');
                    // @ts-expect-error TS2339
                    vertical.style('left', this.nearestTickPosition + 'px');
                } else {
                    vertical.style('visibility', 'hidden');
                }
            })
            // @ts-expect-error TS7006
            .on('mousemove', (event) => {
                // @ts-expect-error TS2339
                if (this.mouseIsOverStream) {
                    const mousex = d3.pointer(event)[0];
                    const { tickPosition, tickValue } = findNearestTickPosition(
                        mousex,
                        // @ts-expect-error TS2339
                        this.uniqueId,
                    );
                    // @ts-expect-error TS2339
                    this.nearestTickPosition = tickPosition;
                    // @ts-expect-error TS2339
                    this.nearestTickValue = tickValue;
                    vertical.style('visibility', 'visible');
                    // @ts-expect-error TS2339
                    vertical.style('left', this.nearestTickPosition + 'px');
                } else {
                    vertical.style('visibility', 'hidden');
                }
            });
    }

    // @ts-expect-error TS7006
    setMouseMoveAndOverStreams(tooltip, colorNameList) {
        // @ts-expect-error TS2339
        if (this.streams) {
            // @ts-expect-error TS2339
            const streams = this.streams;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const componentContext = this;
            // @ts-expect-error TS2339
            this.streams
                // @ts-expect-error TS7006
                .on('mousemove', function (event, nodes) {
                    const e = streams.nodes();
                    // @ts-expect-error TS2683
                    const i = e.indexOf(this);
                    // @ts-expect-error TS2339
                    const date = componentContext.nearestTickValue;
                    // @ts-expect-error TS2339
                    componentContext.mouseIsOverStream = true;
                    // @ts-expect-error TS2339
                    componentContext.hoveredKey = d3
                        .select(event.target)
                        .attr('name');

                    // @ts-expect-error TS2339
                    componentContext.hoveredValue = nodes.find(
                        // @ts-expect-error TS7006
                        (elem) =>
                            elem.data.date.getFullYear() === parseInt(date),
                        // @ts-expect-error TS2339
                    ).data[componentContext.hoveredKey];

                    // @ts-expect-error TS2339
                    componentContext.hoveredColor = colorNameList.find(
                        // @ts-expect-error TS7006
                        (elem) => elem.name === componentContext.hoveredKey,
                    ).color;

                    d3.select(event.target).classed('hover', true);
                    tooltip
                        .html(
                            '<p>' +
                                '<svg width="15" height="15" style="vertical-align: middle; background-color: ' +
                                // @ts-expect-error TS2339
                                componentContext.hoveredColor +
                                '"></svg>' +
                                '<ul style="list-style: none;text-indent:-35px">' +
                                '<li>' +
                                // @ts-expect-error TS2339
                                componentContext.hoveredKey +
                                '</li>' +
                                '<li>' +
                                date +
                                ' : ' +
                                // @ts-expect-error TS2339
                                componentContext.hoveredValue +
                                '</li></ul></p>',
                        )
                        .style('visibility', 'visible');

                    // @ts-expect-error TS7006
                    colorNameList.forEach((_, index) => {
                        const currentLegendItem = document.getElementById(
                            // @ts-expect-error TS2345
                            colorNameList.length - index - 1,
                        );
                        // @ts-expect-error TS18047
                        currentLegendItem.style.opacity = index == i ? 1 : 0.3;
                    });
                })
                .on('mouseover', function () {
                    const e = streams.nodes();
                    // @ts-expect-error TS2683
                    const i = e.indexOf(this);
                    // @ts-expect-error TS2339
                    componentContext.mouseIsOverStream = true;
                    streams
                        .transition()
                        .duration(25)
                        // @ts-expect-error TS7006
                        .attr('opacity', (d, j) => {
                            return j != i ? 0.3 : 1;
                        });
                });
        }
    }

    // @ts-expect-error TS7006
    setMouseOutStreams(tooltip, colorNameList) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const componentContext = this;
        // @ts-expect-error TS2339
        if (this.streams) {
            // @ts-expect-error TS2339
            this.streams.on('mouseout', function () {
                // @ts-expect-error TS2339
                componentContext.mouseIsOverStream = false;
                // @ts-expect-error TS2339
                componentContext.streams
                    .transition()
                    .duration(25)
                    .attr('opacity', '1');
                // @ts-expect-error TS2683
                d3.select(this).classed('hover', false);
                tooltip
                    .html(
                        '<p>  ' +
                            // @ts-expect-error TS2683
                            this.hoveredKey +
                            '<br>' +
                            // @ts-expect-error TS2683
                            this.hoveredValue +
                            '</p>',
                    )
                    .style('visibility', 'hidden');

                // @ts-expect-error TS7006
                colorNameList.forEach((item, index) => {
                    // @ts-expect-error TS2531
                    document.getElementById(index).style.opacity = '1';
                });
            });
        }
    }

    // @ts-expect-error TS7006
    setTheEventsActions(svgViewport, vertical, tooltip, colorNameList) {
        // Can't split events in different blocks because .on("") events
        // definition erase the previous ones
        this.setViewportEvents(svgViewport, vertical);
        this.setMouseMoveAndOverStreams(tooltip, colorNameList);
        this.setMouseOutStreams(tooltip, colorNameList);
    }

    updateDimensions() {
        this.removeGraph();
        this.setGraph();
    }

    setGraph() {
        const { valuesObjectsArray, valuesArray, dateMin, dateMax, namesList } =
            transformDataIntoMapArray(this.props.formatData);

        // @ts-expect-error TS2339
        const svgWidth = this.divContainer.current.clientWidth;
        // @ts-expect-error TS2339
        const { margin, height: svgHeight } = this.state;
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
        if (this._isMounted) {
            this.setState({ width: width });
        }
        // @ts-expect-error TS2339
        const divContainer = d3.select(this.divContainer.current);

        const d3DivContainer = divContainer
            .attr('class', `${css(styles.divContainer)}`)
            .append('div')
            .attr('id', 'd3DivContainer');

        // @ts-expect-error TS2339
        const svgViewport = d3.select(this.anchor.current);

        // @ts-expect-error TS2339
        d3.select(this.svgContainer.current).attr('width', svgWidth);

        const layersNumber = valuesObjectsArray.length;

        const stackedData = this.stackData(namesList, valuesArray);
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
        // @ts-expect-error TS2339
        d3.select(this.divContainer.current)
            .selectAll('#d3DivContainer')
            .selectAll('div')
            .remove();

        // @ts-expect-error TS2339
        d3.select(this.divContainer.current)
            .selectAll('#d3DivContainer')
            .remove();

        // @ts-expect-error TS2339
        d3.select(this.divContainer.current).selectAll('#vertical').remove();

        // @ts-expect-error TS2339
        d3.select(this.divContainer.current).selectAll('#tooltip').remove();

        // @ts-expect-error TS2339
        d3.select(this.anchor.current).selectAll('g').remove();

        // @ts-expect-error TS2339
        d3.select(this.anchor.current).selectAll('defs').remove();
    }

    componentDidMount() {
        this._isMounted = true;
        window.addEventListener('resize', this.updateDimensions.bind(this));
        this.setGraph();

        // if the tooltip content is available before componentDidMount, the content prints weirdly in a corner of the page
        // @ts-expect-error TS2322
        this.mouseIcon = <MouseIcon polyglot={this.props.p} />;
        // @ts-expect-error TS2322
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
        // @ts-expect-error TS2339
        const { width } = this.state;
        const height = this.props.height || defaultArgs.height;

        // since the data comes in the form of an Array, we wait for that to hide the loading label
        let loading = <LoadingGraph polyglot={this.props.p} />;
        if (Array.isArray(this.props.formatData)) {
            // @ts-expect-error TS2322
            loading = '';
        }
        return (
            <FormatFullScreenMode>
                <div
                    // @ts-expect-error TS2339
                    ref={this.divContainer}
                    style={styles.divContainer}
                    // @ts-expect-error TS2339
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
                        // @ts-expect-error TS2339
                        className={stylesWithClassnames.icon}
                    >
                        {this.centerIcon}
                    </div>

                    <svg
                        // @ts-expect-error TS2339
                        id={`svgContainer${this.uniqueId}`}
                        // @ts-expect-error TS2339
                        ref={this.svgContainer}
                        width={width}
                        height={height}
                    >
                        {/*
                         // @ts-expect-error TS2339 */}
                        <g id="anchor" ref={this.anchor} />
                    </svg>
                </div>
            </FormatFullScreenMode>
        );
    }
}

export default compose(injectData())(Streamgraph);
