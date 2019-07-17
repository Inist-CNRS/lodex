import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
import { StyleSheet, css } from 'aphrodite/no-important';
import * as d3 from 'd3';
import {
    zoomFunction,
    transformDataIntoMapArray,
    getMinMaxValue,
    cutStr,
    /*findFirstTickPosition,*/
    findNearestTickPosition,
    generateUniqueId,
} from './utils';
import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import moment from 'moment';

import * as colorUtils from '../colorUtils';
import ReactTooltip from 'react-tooltip';

import PropTypes from 'prop-types';
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
        'white-space': 'nowrap',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
    },
    legendItemTooltip: {
        visibility: 'hidden',
        backgroundColor: '#4e4e4e',
        color: '#fff',
        borderRadius: '6px',
        padding: '5px 10px',
        position: 'absolute',
        left: '0px',
        right: '15px',
        top: '-66px',
        zIndex: 10,
        'white-space': 'pre-wrap',
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
};

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

        this.mouseIsOverStream = false;
        this.zoomFunction = zoomFunction.bind(this);
        this.uniqueId = generateUniqueId();
    }

    static defaultProps = {
        args: defaultArgs,
    };

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

        let column_number; // TODO : make it an admin parameter
        width > 500 ? (column_number = 3) : (column_number = 2);
        legendView.style('column-count', column_number);

        const colorNameTmpList = colorNameList;
        colorNameTmpList.reverse();

        colorNameList.forEach((item, index) => {
            const element = colorNameList[index];
            const legendItemContainer = legendView
                .append('div')
                .attr('class', `${css(styles.legendItem)}`)
                .style('padding', '5px')
                .style('margin', '-5px');

            legendItemContainer
                .append('svg')
                .attr('width', 15)
                .attr('height', 15)
                .style('vertical-align', 'middle')
                .style('background-color', element.color);

            legendItemContainer
                .append('text')
                .attr('class', `${css(styles.legendItemText)}`)
                .text(cutStr(element.name, column_number));

            const legendItemTooltip = legendItemContainer
                .append('span')
                .attr('class', `${css(styles.legendItemTooltip)}`)
                .text(element.name);

            legendItemContainer
                .on('mouseover', d => {
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
                .on('mousemove', (d, i) => {
                    legendItemTooltip.style('visibility', 'visible');
                })
                .on('mouseout', d => {
                    legendItemTooltip.style('visibility', 'hidden');

                    this.streams
                        .transition()
                        .duration(25)
                        .attr('opacity', d => {
                            return 1;
                        });
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
            this.streams.on('mouseout', function(d) {
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
        const { width, height /*, margin*/ } = this.state;
        const { p: polyglot } = this.props;

        if (!this._isMounted) {
            var loadingMessage = polyglot.t('loading_resource');
            var loadingHourglass = (
                <svg
                    id="Capa1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 347.337 347.337"
                >
                    <g id="Layer_5_73_">
                        <path d="M324.658,20.572v-2.938C324.658,7.935,316.724,0,307.025,0H40.313c-9.699,0-17.635,7.935-17.635,17.634v2.938 c0,9.699,7.935,17.634,17.635,17.634h6.814c3.5,0,3.223,3.267,3.223,4.937c0,19.588,8.031,42.231,14.186,56.698 c12.344,29.012,40.447,52.813,63.516,69.619c4.211,3.068,3.201,5.916,0.756,7.875c-22.375,17.924-51.793,40.832-64.271,70.16 c-6.059,14.239-13.934,36.4-14.18,55.772c-0.025,1.987,0.771,5.862-3.979,5.862h-6.064c-9.699,0-17.635,7.936-17.635,17.634v2.94 c0,9.698,7.935,17.634,17.635,17.634h266.713c9.699,0,17.633-7.936,17.633-17.634v-2.94c0-9.698-7.934-17.634-17.633-17.634 h-3.816c-7,0-6.326-5.241-6.254-7.958c0.488-18.094-4.832-38.673-12.617-54.135c-17.318-34.389-44.629-56.261-61.449-68.915 c-3.65-2.745-4.018-6.143,0-8.906c17.342-11.929,44.131-34.526,61.449-68.916c8.289-16.464,13.785-38.732,12.447-57.621 c-0.105-1.514-0.211-4.472,3.758-4.472h6.482C316.725,38.206,324.658,30.272,324.658,20.572z M270.271,93.216 c-16.113,31.998-41.967,54.881-64.455,68.67c-1.354,0.831-3.936,2.881-3.936,8.602v6.838c0,6.066,2.752,7.397,4.199,8.286 c22.486,13.806,48.143,36.636,64.191,68.508c7.414,14.727,11.266,32.532,10.885,46.702c-0.078,2.947,1.053,8.308-6.613,8.308 H72.627c-6.75,0-6.475-3.37-6.459-5.213c0.117-12.895,4.563-30.757,12.859-50.255c14.404-33.854,44.629-54.988,64.75-67.577 c0.896-0.561,2.629-1.567,2.629-6.922v-10.236c0-5.534-2.656-7.688-4.057-8.57c-20.098-12.688-49.256-33.618-63.322-66.681 c-8.383-19.702-12.834-37.732-12.861-50.657c-0.002-1.694,0.211-4.812,3.961-4.812h206.582c4.168,0,4.127,3.15,4.264,4.829 C282.156,57.681,278.307,77.257,270.271,93.216z" />
                        <path d="M169.541,196.2l-68.748,86.03c-2.27,2.842-1.152,5.166,2.484,5.166h140.781c3.637,0,4.756-2.324,2.484-5.166 l-68.746-86.03C175.525,193.358,171.811,193.358,169.541,196.2z" />
                        <path d="M168.986,156.219c2.576,2.568,6.789,2.568,9.363,0l34.576-34.489c2.574-2.568,1.707-4.67-1.932-4.67H136.34 c-3.637,0-4.506,2.102-1.932,4.67L168.986,156.219z" />
                    </g>
                </svg>
            );
        }

        return (
            <div
                ref={this.divContainer}
                style={styles.divContainer}
                id={`divContainer${this.uniqueId}`}
            >
                <div>
                    {loadingMessage}
                    {loadingHourglass}
                </div>

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
    colors: PropTypes.string,
    formatData: PropTypes.any,
};

export default compose(
    injectData(),
    exportableToPng,
)(Streamgraph);
