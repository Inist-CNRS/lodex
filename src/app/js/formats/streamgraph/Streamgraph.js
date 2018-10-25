import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import * as d3 from 'd3';

const styles = {
    tooltip: {
        marginTop: 900,
    },
    vertical: {
        marginTop: 60,
        height: 190,
        pointerEvents: 'none',
    },
    legend: {
        position: 'relative',
    },
    legendItem: {
        marginTop: 2,
    },
    legentItemText: {
        marginLeft: 5,
    },
    legendButton: {
        height:15,
        width: 15,
    },
};

let xAxisScale;
let yAxisScale;
let xAxis;
let yAxisL;
let yAxisR;
let gx;
let gyr;
let gyl;
let streams;

// ===========================================================================================
// getCssToString get the css js object and return it as string
// ===========================================================================================

function getCssToString(cssToChange) {
    const cssString = Object.keys(styles.legend).map(key => {
        return `${key}: ${styles.legend[key]};`
    }).join(" ");
    return (cssString);
}

// ===========================================================================================
// zoomFunction will update the zoom on the graph
// ===========================================================================================

function zoomFunction() {
    // create new scale ojects based on event
    let new_xScale = d3.event.transform.rescaleX(xAxisScale);
    let new_yScale = d3.event.transform.rescaleY(yAxisScale);

    // update axes
    gx.call(xAxis.scale(new_xScale));
    gyr.call(yAxisR.scale(new_yScale));
    gyl.call(yAxisL.scale(new_yScale));

    // update streams
    streams.attr("transform", d3.event.transform);
};

// ===========================================================================================
// stackMax and stackMin functions returns the max and the min value of a @layer
// ===========================================================================================

function stackMax(layer) {
    return d3.max(layer, function (d) { return d[1]; });
}

function stackMin(layer) {
    return d3.min(layer, function (d) { return d[1]; });
}

// ===========================================================================================
// Test data generator
// Inspired by Lee Byron’s test data generator.
// ===========================================================================================

function bumps(n, m) {
    let a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < m; ++i) bump(a, n);
    return a;
}

function bump(a, n) {
    let x = 1 / (0.1 + Math.random()),
        y = 2 * Math.random() - 0.5,
        z = 10 / (0.1 + Math.random());
    for (let i = 0; i < n; i++) {
        let w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
    }
}

// ===========================================================================================
// distinctColors : return a list of @count different and distinct colors in hsl hexa
// ===========================================================================================

function distinctColors(count) {
    let colors = [];
    for (let hue = 0; hue < 360; hue += 360 / count) {
        colors.push(hslToHex(hue, 90, 50));
    }
    return colors;
}

// ===========================================================================================
// hslToHex : Convert hsl values color to hex color
// ===========================================================================================

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ===========================================================================================
// transformDataIntoMap : convert all the data into a map
// ===========================================================================================

function transformDataIntoMap(formatData) {
    var valuesMap = new Map();

    if (formatData != undefined) {
        for (let i = 0; i < formatData.length; i++) {
            let elem = formatData[i];
            if (elem != undefined) {
                // source: "2010"
                // target: "Pétrogenèse de roches basaltiques"
                // weight: 0.9013102637325718

                let currentItem;

                if (valuesMap.get(elem.target)) {
                    currentItem = valuesMap.get(elem.target);
                } else {
                    currentItem = {
                        // name: elem.target, // useless, just to be sure
                        // [[date, value], [date, value]]
                        valuesList: []
                    }
                }
                if (elem.source !== undefined && elem.weight !== undefined) {
                    currentItem.valuesList.push([elem.source, elem.weight]);
                    valuesMap.set(elem.target, currentItem);
                }
            }
        }
    }
    // order all the values by date
    let maxLenArray = 0;
    for (let elem of valuesMap) {
        if (elem) {
            if (elem[1].valuesList.length > maxLenArray){
                maxLenArray = elem[1].valuesList.length;
            }
            elem[1].valuesList.sort((a, b) => {
                return (parseInt(a[0]) - parseInt(b[0]));
            });
        }
    }

    let layersValues = [];
    for (let i = 0; i < maxLenArray; i++) {
        let tmpList = [];
        for (let elem of valuesMap) {
            if (i < elem[1].valuesList.length) {
                tmpList.push(elem[1].valuesList[i][1]);
            } else {
                tmpList.push(0); // TODO : you're creating data, that's bad
            }
        }
        layersValues.push(tmpList);
    }
    return ([valuesMap, layersValues]);
}

class Streamgraph extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            width: 800,
            height: 300
        }
    }

    setGraph() {
        let [valuesMap, layersValues] = transformDataIntoMap(this.props.formatData);

        let { width, height } = this.state;
        const svgWidth = width;
        const svgHeight = height;

        const divContainer = d3.select(this.refs.divContainer)
        const svgViewport = d3.select(this.refs.anchor);

        // ===========================================================================================
        // Set all the variables (to move in states)
        // ===========================================================================================

        let n = 9,  // number of layers
            maxElementsNumber = 100,// number of samples per layer
            k = 50; // number of bumps per layer

        // stack the datas
        let stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle),
            layers0 = stack(d3.transpose(d3.range(n).map(function () { return bumps(maxElementsNumber, k); }))),
            layers1 = stack(d3.transpose(d3.range(n).map(function () { return bumps(maxElementsNumber, k); }))),
            layers = layers0.concat(layers1);

        layersValues = stack(layersValues);

        // go through map and set values in a list
        maxElementsNumber = 0;
        let realLayers = [];
        for (let element of valuesMap) {
            realLayers.push(element[1].valuesList);
            if (maxElementsNumber < element[1].valuesList.length) {
                maxElementsNumber = element[1].valuesList.length;
            }
        }

        layers = realLayers;

        const tmpNames = [
            "Toxicologie et écotoxicologie des polluants & Études de taxonomie",
            "Épidémiologie des cancers",
            "Dynamique des glaciers",
            "Expédition historiques aux pôles & Anthropologie des populations natives",
            "Droits des peuples autochtones et géopolitique",
            "Bio géochimie marine et dulçaquicole",
            "Palynologie de sédiments marinset lacustres et étude de carottes de glace pour reconstitutions paléoclimatiques du Quaternaire",
            "Activités sismique et magmatique des dorsales océaniques arctiques",
            "Pétrogenèse de roches basaltiques"
        ]

        let colorNameList = []; // e.g.: [Thematique,#FFFFFF]

        const margin = { top: 60, right: 40, bottom: 50, left: 60 };
        width = svgWidth - margin.left - margin.right;
        height = svgHeight - margin.top - margin.bottom;

        // ===========================================================================================
        // Set the bases of the elements
        // ===========================================================================================

        // Zoom Function
        const zoom = d3.zoom()
            .scaleExtent([1, 32])
            .on("zoom", zoomFunction);

        svgViewport.append("defs")
            .append("clipPath")
            .attr("id", "mask")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // Inner Drawing Space
        const innerSpace = svgViewport.append("g")
            .attr("class", "inner_space")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // graphZone where the area will be append
        const graphZone = innerSpace.append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("clip-path", "url(#mask)")
            .call(zoom);

        // set a background with rect to catch the zoom 
        graphZone.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("opacity", 0);

        // ===========================================================================================
        // Create and set axis
        // ===========================================================================================

        // create scale objects
        xAxisScale = d3.scaleLinear()
            .domain([0, maxElementsNumber - 1])
            .range([0, width]);

        //console.log("yaxis min : " + d3.min(layers, stackMin) + " max : "+d3.max(layers, stackMax));
        yAxisScale = d3.scaleLinear()
            //.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
            .domain([-3, 3])
            .range([height, 0]);

        // create axis objects
        xAxis = d3.axisBottom(xAxisScale);
        yAxisL = d3.axisLeft(yAxisScale);
        yAxisR = d3.axisRight(yAxisScale);

        // append x axis
        gx = innerSpace.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // append y axis to the right of the chart
        gyr = innerSpace.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ", 0)")
            .call(yAxisR);

        // append y axis to the left of the chart
        gyl = innerSpace.append("g")
            .attr("class", "y axis")
            .call(yAxisL);

        // color set
        const z = distinctColors(n);
        //var z = d3.interpolateRainbow;
        //var z = d3.interpolateCool; 

        // ===========================================================================================
        // Create and set the streams
        // ===========================================================================================

        const area = d3.area()
            .x(function (d, i) { return xAxisScale(i); })
            .y0(function (d) { return yAxisScale(d[0]); })
            .y1(function (d) { return yAxisScale(d[1]); });

        streams = graphZone.selectAll("path")
            .data(layersValues)// tata
            //.data(layers0)
            .enter().append("path") // append all paths (area streams)
            .attr("d", area)
            //.attr("d", function(d) {return area(d.values);})
            .attr("name", function (d, i) {
                let name = tmpNames[i];
                let color = z[i];
                colorNameList.push([name, color]);
                return (name);
            })
            .attr("opacity", 1)
            .attr("fill", function (d, i) { return (z[i]); });

        // ===========================================================================================
        // Set tooltip
        // ===========================================================================================

        //const tooltip = svgViewport.append("div")
        const tooltip = divContainer.append("div")
            .attr("class", "remove")
            .attr("id", "tooltip")
            .attr("style", getCssToString(styles.tooltip))
            .style("position", "absolute")
            .style("z-index", "2")
            .style("visibility", "hidden")
            .style("top", "4px")
            .style("left", "12px");

        let hoveredKey;
        let hoveredValue;

        // ===========================================================================================
        // Set vertical line
        // ===========================================================================================

        let mouseIsOverStream = false;

        // vertical line
        const vertical = divContainer.append("div")
            //.attr("class", {style.vertical})
            .style("position", "absolute")
            .style("z-index", "19")
            .style("width", "1px")
            .style("height", `${height}px`)
            .style("top", "10px")
            .style("bottom", "30px")
            .style("left", "0px")
            .style("margin-top", `${margin.top - 10}px`)
            .style("pointer-events", "none")
            .style("background", "#000");

        // ===========================================================================================
        // Set legend
        // ===========================================================================================

        const legendView = divContainer
            .attr("id", "legend")
            .attr("style", getCssToString(styles.legend))
            .append('div');

        for (let index = colorNameList.length - 1; index > 0; index--) {
            let element = colorNameList[index];
            let legendItemContainer = legendView.append("div")
                .attr("style", getCssToString(styles.legendItem))
                .attr("class", "legendItem");

            legendItemContainer.append("svg")
                .attr("width", 15)
                .attr("height", 15)
                .style("background-color", element[1]);

            legendItemContainer.append("text")
                .attr("style", getCssToString(styles.legentItemText))
                .attr("class", "legentItemText")
                .text(element[0]);
        }

        // ===========================================================================================
        // Mouse events - svgViewport events
        // 
        // Can't split in different blocks because .on("") events 
        // definition erase the previous ones
        // ===========================================================================================

        svgViewport.on("mouseover", function (d, i) {

            // *******************************************************
            // update the status (hidden or visible) and the position
            // of the vertical bar
            // *******************************************************

            if (mouseIsOverStream) {
                let mousex = d3.mouse(this);
                //mousex = mousex[0] + 28;
                mousex = mousex[0];
                vertical.style("visibility", "visible")
                vertical.style("left", mousex + "px");
            } else {
                vertical.style("visibility", "hidden");
            }
        }).on("mousemove", function (d, i) {
            if (mouseIsOverStream) {
                let mousex = d3.mouse(this);
                mousex = mousex[0]; // + 6
                vertical.style("visibility", "visible")
                vertical.style("left", mousex + "px");
            } else {
                vertical.style("visibility", "hidden");
            }
        });



        // ===========================================================================================
        // Mouse events - streams events
        // ===========================================================================================

        streams.on("mousemove", function (d, i) {

            // *******************************************************
            // Get the hovered values for tooltip
            // set hover and display tooltip
            // *******************************************************

            let mousex = d3.mouse(this)[0];
            var invertedx = xAxisScale.invert(mousex);

            hoveredKey = d3.select(this).attr("name");
            hoveredValue = d[Math.floor(invertedx)][1] - d[Math.floor(invertedx)][0];

            d3.select(this)
                .classed("hover", true)
                .attr("stroke", "#000")
                .attr("stroke-width", "0.5px"),
                tooltip.html("<p>" + hoveredKey + "<br>" + hoveredValue + "</p>").style("visibility", "visible");
        }).on("mouseover", function (d, i) {

            // *******************************************************
            // set the hover opacity
            // *******************************************************

            mouseIsOverStream = true;
            streams.transition()
                .duration(25)
                .attr("opacity", function (d, j) {
                    return j != i ? 0.3 : 1;
                })
        })
            .on("mouseout", function (d, i) {

                // *******************************************************
                // unset hover and hide tooltip
                // *******************************************************

                mouseIsOverStream = false;
                streams.transition()
                    .duration(25)
                    .attr("opacity", "1");
                d3.select(this)
                    .classed("hover", false)
                    .attr("stroke-width", "0px"),
                    tooltip.html("<p>" + hoveredKey + "<br>" + hoveredValue + "</p>").style("visibility", "hidden");
            });
    }

    componentDidMount() {
        this.setGraph();
    }
    
    render() {
        const { width, height } = this.state;
        return (
            <div ref="divContainer">
                <svg width={width} height={height}>
                    <g ref="anchor" />
                </svg>
            </div>
        );
    }
};

const mapStateToProps = (state, { formatData }) => {
    //console.log("mapStateToProps - state:");
    //console.log(state);
    return ({});
};

export default compose(injectData(), connect(mapStateToProps), exportableToPng)(
    Streamgraph,
);