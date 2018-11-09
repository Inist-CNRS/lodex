import React, { PureComponent } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { StyleSheet, css } from "aphrodite/no-important";
import * as d3 from "d3";
import {
  zoomFunction,
  distinctColors,
  transformDataIntoMapArray,
  getMinMaxValue
} from "./utils";
import injectData from "../injectData";
import exportableToPng from "../exportableToPng";

const styles = StyleSheet.create({
  divContainer: {
    overflow: "hidden",
    position: "relative"
  },
  tooltip: {
    position: 'absolute'
  },
  vertical: {
    marginTop: 60,
    height: 190,
    pointerEvents: "none"
  },
  legend: {
    position: "relative"
  },
  legendItem: {
    marginTop: 2
  },
  legendItemText: {
    marginLeft: 5
  },
  legendButton: {
    height: 15,
    width: 15
  }
});

class Streamgraph extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 800,
      height: 300
    };

    this.refs = React.createRef();
    this.xAxisScale;
    this.yAxisScale;
    this.xAxis;
    this.yAxisL;
    this.yAxisR;
    this.gx;
    this.gyr;
    this.gyl;
    this.streams;

    this.hoveredKey;
    this.hoveredValue;
    this.mouseIsOverStream = false;

    this.zoomFunction = zoomFunction.bind(this);
  }

  initTheGraphBasicsElements(width, height, margin, svgViewport) {
    const zoom = d3
      .zoom()
      .scaleExtent([1, 32])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", this.zoomFunction);

    const innerSpace = svgViewport
      .append("g")
      .attr("width", width)
      .attr("class", "inner_space")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    innerSpace
      .append("defs")
      .append("clipPath")
      .attr("id", "mask")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    const graphZone = innerSpace
      .append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("clip-path", "url(#mask)")
      .call(zoom);

    graphZone
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("opacity", 0);

    return [innerSpace, graphZone];
  }

  stackDatas(nameList, valuesArray) {
    let stackMethod = d3
      .stack()
      .keys(nameList)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetWiggle);

    let stackedData;
    if (valuesArray.length > 0) {
      stackedData = stackMethod(valuesArray);
    }
    return stackedData;
  }

  createAndSetAxis(
    minDate,
    maxDate,
    minValue,
    maxValue,
    width,
    height,
    innerSpace
  ) {
    minDate = new Date(String(minDate));
    maxDate = new Date(String(maxDate));

    this.xAxisScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, width]);

    this.xAxis = d3
      .axisBottom(this.xAxisScale)
      .tickFormat(d3.timeFormat("%Y"))
      .ticks(d3.timeYear, 1);

    this.gx = innerSpace
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(this.xAxis);

    this.yAxisScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range([height, 0]);

    this.yAxisL = d3.axisLeft(this.yAxisScale);
    this.yAxisR = d3.axisRight(this.yAxisScale);

    this.gyr = innerSpace
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(this.yAxisR);

    this.gyl = innerSpace
      .append("g")
      .attr("class", "y axis")
      .call(this.yAxisL);
  }

  createAndSetStreams(layersNumber, graphZone, stackedData, nameList) {
    let colorNameList = []; // e.g.: [Thematique,#FFFFFF]
    const z = distinctColors(layersNumber);
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
      .selectAll("path")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("d", d => {
        if (d) {
          return area(d);
        } else {
          return [];
        }
      })
      .attr("name", (d, i) => {
        let name = nameList[i];
        let color = z[i];
        colorNameList.push([name, color]);
        return name;
      })
      .attr("opacity", 1)
      .attr("fill", (d, i) => {
        return z[i];
      });
    return colorNameList;
  }

  createAndSetDataReader(divContainer, height, margin) {

    const vertical = divContainer
      .insert("div", "#svgContainer")
      .attr("id", "vertical")
      .style("position", "absolute") // need relative in parent
      .style("z-index", "19")
      .style("width", "1px")
      .style("height", `${height}px`)
      .style("top", "10px")
      .style("bottom", "30px")
      .style("left", "0px")
      .style("margin-top", `${margin.top - 10}px`)
      .style("pointer-events", "none")
      .style("background", "#000");

    const tooltip = divContainer
      .insert("div", "#svgContainer")
      .attr("class", `remove ${css(styles.tooltip)}`)
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("z-index", "2")
      .style("visibility", "hidden")
      .style("top", "4px")
      .style("left", "12px");

    return [tooltip, vertical];
  }

  createAndSetTheLegend(d3DivContainer, colorNameList) {
    const legendView = d3DivContainer
      .append("div")
      .attr("id", "legend")
      .attr("class", `${css(styles.legend)}`);

    for (let index = colorNameList.length - 1; index > 0; index--) {
      let element = colorNameList[index];
      let legendItemContainer = legendView
        .append("div")
        .attr("class", `${css(styles.legendItem)}`);

      legendItemContainer
        .append("svg")
        .attr("width", 15)
        .attr("height", 15)
        .style("background-color", element[1]);

      legendItemContainer
        .append("text")
        .attr("class", `${styles.legendItemText}`)
        .text(element[0]);
    }
  }

  setViewportEvents(svgViewport, vertical) {
    let componentContext = this;
    svgViewport
      .on("mouseover", function(d, i) {
        if (componentContext.mouseIsOverStream) {
          let mousex = d3.mouse(this);
          mousex = mousex[0];
          vertical.style("visibility", "visible");
          vertical.style("left", mousex + "px");
        } else {
          vertical.style("visibility", "hidden");
        }
      })
      .on("mousemove", function(d, i) {
        if (componentContext.mouseIsOverStream) {
          let mousex = d3.mouse(this);
          mousex = mousex[0];
          vertical.style("visibility", "visible");
          vertical.style("left", mousex + "px");
        } else {
          vertical.style("visibility", "hidden");
        }
      });
  }

  setMouseMoveAndOverStreams(tooltip) {
    let componentContext = this;

    this.streams
      .on("mousemove", function(d, i) {
        let mousex = d3.mouse(this)[0];
        let date = componentContext.xAxisScale.invert(mousex);
        componentContext.mouseIsOverStream = true;
        this.hoveredKey = d3.select(this).attr("name");

        for (let elem of d) {
          if (elem.data.date.getFullYear() == date.getFullYear()) {
            this.hoveredValue = elem.data[this.hoveredKey];
            break;
          }
        }

        d3
          .select(this)
          .classed("hover", true)
          .attr("stroke", "#000")
          .attr("stroke-width", "0.5px"),
          tooltip
            .html("<p>" + this.hoveredKey + "<br>" + this.hoveredValue + "</p>")
            .style("visibility", "visible");
      })
      .on("mouseover", (d, i) => {
        componentContext.mouseIsOverStream = true;
        this.streams
          .transition()
          .duration(25)
          .attr("opacity", (d, j) => {
            return j != i ? 0.3 : 1;
          });
      });
  }

  setMouseOutStreams(tooltip) {
    let componentContext = this;

    this.streams.on("mouseout", function(d, i) {
      componentContext.mouseIsOverStream = false;
      componentContext.streams
        .transition()
        .duration(25)
        .attr("opacity", "1");
      d3
        .select(this)
        .classed("hover", false)
        .attr("stroke-width", "0px"),
        tooltip
          .html("<p>" + this.hoveredKey + "<br>" + this.hoveredValue + "</p>")
          .style("visibility", "hidden");
    });
  }

  setTheEventsActions(svgViewport, vertical, tooltip) {
    // Can't split events in different blocks because .on("") events
    // definition erase the previous ones
    this.setViewportEvents(svgViewport, vertical);
    this.setMouseMoveAndOverStreams(tooltip);
    this.setMouseOutStreams(tooltip);
  }

  setGraph() {
    let [
      valuesObjectsArray,
      valuesArray,
      minDate,
      maxDate,
      nameList
    ] = transformDataIntoMapArray(this.props.formatData);

    let svgWidth = this.refs.divContainer.clientWidth;

    let { height } = this.state;
    let svgHeight = height;
    const margin = { top: 60, right: 40, bottom: 50, left: 60 };
    let width = svgWidth - margin.left - margin.right;
    height = svgHeight - margin.top - margin.bottom;

    const divContainer = d3.select(this.refs.divContainer);

    const d3DivContainer = divContainer
      .attr("class", `${css(styles.divContainer)}`)
      .append("div")
      .attr("id", "d3DivContainer");

    const svgViewport = d3.select(this.refs.anchor);

    d3.select(this.refs.svgContainer).attr("width", svgWidth);

    let layersNumber = valuesObjectsArray.length;

    let stackedData = this.stackDatas(nameList, valuesArray);
    let [minValue, maxValue] = getMinMaxValue(stackedData);

    let [innerSpace, graphZone] = this.initTheGraphBasicsElements(
      width,
      height,
      margin,
      svgViewport
    );

    let [tooltip, vertical] = this.createAndSetDataReader(
      divContainer,
      height,
      margin
    );

    this.createAndSetAxis(
      minDate,
      maxDate,
      minValue,
      maxValue,
      width,
      height,
      innerSpace
    );

    let colorNameList = this.createAndSetStreams(
      layersNumber,
      graphZone,
      stackedData,
      nameList
    );

    this.createAndSetTheLegend(d3DivContainer, colorNameList);
    this.setTheEventsActions(svgViewport, vertical, tooltip);
  }

  componentDidMount() {
    this.setGraph();
  }

  componentWillUpdate() {
    d3.select(this.refs.divContainer)
      .selectAll("#d3DivContainer")
      .selectAll("div")
      .remove();

    d3.select(this.refs.divContainer)
      .selectAll("#d3DivContainer")
      .remove();

    d3.select(this.refs.divContainer)
      .selectAll("#vertical")
      .remove();

    d3.select(this.refs.anchor)
      .selectAll("g")
      .remove();

    d3.select(this.refs.anchor)
      .selectAll("defs")
      .remove();
  }

  componentDidUpdate() {
    this.setGraph();
  }

  render() {
    const { width, height } = this.state;

    return (
      <div id="divContainer" ref="divContainer" style={styles.divContainer}>
        <svg id="svgContainer" ref="svgContainer" width={width} height={height}>
          <g id="anchor" ref="anchor" />
        </svg>
      </div>
    );
  }
}

export default compose(
  injectData(),
  exportableToPng
)(Streamgraph);
