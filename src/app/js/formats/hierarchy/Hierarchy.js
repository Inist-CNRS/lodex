import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
import { StyleSheet, css } from 'aphrodite/no-important';
import * as d3 from 'd3';
import { zoomFunction, generateUniqueId } from './utils';
import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import ZoomIcon from './zoomIcon';

const styles = StyleSheet.create({
    divContainer: {
        overflow: 'hidden',
        position: 'relative',
    },
    link : {
        fill: 'none',
        stroke: '#555',
        strokeOpacity: 0.4,
        strokeWidth: '1px',
    },

    text : {
        fill: 'black',
        fontWeight: 'bold',
        fontSize: '12px'
    },


    node : {
        cursor: 'pointer',
    },

    nodeCircle : {
        fill: '#999',
    },

    nodeInternalCircle : {
        fill: '#555',
    },

    nodeInternalText : {
        fontSize: '12px',
    },

    nodeLeafText : {
        fill: '#000000',
    },

    nodeCollapsedText : {
        fill: '#000',
    },

    nodeCollapsedCircle : {
        fill: '#555',
    },

    shadow : {
        webkitFilter: 'drop-shadow(-1.5px -1.5px 1.5px #000)',
        filter: 'drop-shadow(-1.5px -1.5px 1.5px #000)',
    },

    svg : {
        border: 'black solid 1px',
    },

    divTooltip : {	
        position: 'absolute',			
        textAlign: 'center',													
        padding: '4px',				
        fontSize: '12px',
        fontWeight: 'bold',
        background: '#ebebeb',	
        border:  'solid 1px black',		
        borderRadius: '8px',			
        pointerEvents: 'none',			
    },
});

class Hierarchy extends PureComponent {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            width: 800,
            height: 300,
            margin: { top: 60, right: 40, bottom: 50, left: 60 },
        };
        this.zoomIconEnter = this.zoomIconEnter.bind(this);
        this.zoomIconLeave = this.zoomIconLeave.bind(this);

        this.divContainer = React.createRef();
        this.svgContainer = React.createRef();
        this.anchor = React.createRef();
        this.zoomIndicator = React.createRef();
        this.zoomIndicatorBackground = React.createRef();

        this.mouseIsOverStream = false;
        this.zoomFunction = zoomFunction.bind(this);
        this.uniqueId = generateUniqueId();
        this.collapse = this.collapse.bind(this);
        // this.click = this.click.bind(this)
    }

    setGraph() {

        if (this.props.formatData) {
            // tata code base

            //var svg = d3.select('svg'),
            console.log(`#svgContainer${this.uniqueId}`)
            console.log(this.svgContainer.current);
            let svg = d3.select(this.svgContainer.current);
            //let width = +svg.attr('width');
        
            let g = d3.select(this.anchor.current).attr('transform', 'translate(20,20)'); // move right 20px.

            // define the zoomListener which calls the zoom function on the "zoom" event
            var zoomListener = d3.zoom().on('zoom', () => { this.zoom(g) } );
            svg.call(zoomListener);

            // .tickFormat(formatSkillPoints);

            // Setting up a way to handle the data
            var tree = d3
                .cluster() // This D3 API method setup the Dendrogram elements position.
                .separation(function(a, b) {
                    return a.parent == b.parent ? 3 : 4;
                }) // define separation ratio between siblings

            //.size([height, width - 460]);    // Total width - bar chart width = Dendrogram chart width

            //var stratify = d3.stratify()            // This D3 API method gives cvs file flat data array dimensions.
            //    .parentId(function (d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

            var stratify = d3
                .stratify() // This D3 API method gives cvs file flat data array dimensions.
                .id(function(d) {
                    return d.target;
                })
                .parentId(function(d) {
                    return d.source;
                });

            let myData;
            let root;

            let treeData = this.props.formatData;
            if (treeData) {

                myData = this.addRootElements(treeData);
                root = stratify(myData);
                if (!root) {
                    debugger;
                }
                // collpsed all nodes
                root.children.forEach(d => d.children.forEach(this.collapse));

                this.update(
                    svg,
                    tree,
                    root,
                    g,
                );
            } 
        }
    }

    update(
        svg,
        tree,
        root,
        g,
    ) {
        // update tree size
        if (root && tree) {
            const height = (root.leaves().length + 1) * 50;
            const width = (root.depth + root.height) * 200;
            // d3.select("svg").attr("height", height)
            tree.size([height, width]);
            // tree.nodeSize([40, 200])

            // update axis
            const maxWeight =d3.max(root.descendants().filter(d => !d.children && !d._children), function(d) {
                return d.data.weight;
            })
            let xScale = d3
                .scaleLinear()
                .domain([0, maxWeight])
                .range([0, 500]);
            let xAxis = d3
                .axisTop()
                .scale(xScale)
                .ticks(5);
            // generate a new hierarchy from the specified tabular data
            // root object example
            // children: Array(6) [ {…}, {…}, {…}, … ]
            // data: Object { id: "Tom", value: 0, color: undefined }
            // depth: 0
            // height: 3
            // id: "Tom"
            // parent: null
            // x: 657.7932098765434
            // y: 0
            tree(root); // d3.cluster()
            root.descendants().forEach(d => {
                d.y = d.x;
                d.x =
                    ((d.depth - 1) / (d.depth + d.height - 1)) *
                    width;
            });

            // Draw every datum a line connecting to its parent.
            let link = g.selectAll(".link")
            .data(root.descendants().slice(1).filter(d => !d.parent.data.isFakeNode && !d.parent.isCollapsedNode), function (d) {
                return d.id;
            }); // remove links from fakeRootNode
            //remove old links
            link.exit().remove()
            // update remaining link
            link.attr("d", function (d) {
                    return "M" + d.x + "," + d.y
                        + "C" + (d.parent.x + 100) + "," + d.y
                        + " " + (d.parent.x + 100) + "," + d.parent.y
                        + " " + d.parent.x + "," + d.parent.y;
                });
            // add new one
            link.enter().append("path")
                .attr('class', `${css(styles.link)}`)
                .attr('d', function(d) {
                    return (
                        'M' +
                        d.x +
                        ',' +
                        d.y +
                        'C' +
                        (d.parent.x + 100) +
                        ',' +
                        d.y +
                        ' ' +
                        (d.parent.x + 100) +
                        ',' +
                        d.parent.y +
                        ' ' +
                        d.parent.x +
                        ',' +
                        d.parent.y
                    );
                });

            // Setup position for every datum; Applying different css classes to parents and leafs.
            // Setup position for every datum; Applying different css classes to parents and leafs.
        var node = g.selectAll(".node")
        .data(root.descendants().filter(d => {
            return !d.data.isFakeNode; // remove fake node (ie: fakeRoot and fake children when collapsed)
        }), function(d) {
            return d.id;
        });
        
        // remove old nodes
        node.exit().remove()
        //udpate remaining nodes
        node.attr("transform", function (d) { 
                return "translate(" + d.x + "," + d.y + ")";
            });
        var nodeLeafG = node.filter(function(d) {
                return !d.children && !d._children;
            }).selectAll("g");
        nodeLeafG.select("rect")
            .attr("width", function (d) { return xScale(d.data.weight); });
        nodeLeafG.select("text")
            .attr("width", function (d) { return xScale(d.data.weight) - 8; })
            .text(function(d) {
                return d.id;
            });
            // .call(dotme);

        // add new nodes
        var nodeEnter = node.enter().append("g")
            .attr("class", function (d) { return `${css(styles.node)}` + ((d.children || d._children) ? " node--internal" : " node--leaf") + (d._children ? ' node--collapsed' : ''); })
            .on("click", (d) => {
                this.click(
                    d,
                    svg,
                    tree,
                    root,
                    g,
                )
            })
            .attr("transform", function (d) { 
                return "translate(" + d.x + "," + d.y + ")"; 
            })
        nodeEnter.append("circle")
            .attr("class", `${css(styles.nodeInternalCircle)}`)
            .attr("r", 4);
        
        var nodeInternal = nodeEnter.filter(function(d) {
            return (d.children || d._children);
        });
        nodeInternal.append("text")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.id;
            })
            .attr("y", -10);

        // Setup G for every leaf datum. (rectangle)
        var leafNodeGEnter = nodeEnter.filter(function(d) {
                return !d.children && !d._children;
            }).append("g")
            .attr("class", "node--leaf-g")
            .attr("transform", "translate(" + 8 + "," + 0 + ")"); // move rectangle to be centered to the node

        leafNodeGEnter.append("rect")
            .attr("class", "")
            .style("fill", function (d) { return "#555"; })
            .attr("width", 2)
            .attr("height", 10)
            .attr("rx", 2)
            .attr("ry", 2)
            .transition().duration(500)
            // .attr("width", function (d) { 
            //     let text = Number(d.data.weight).toFixed(1) + ` - ${d.id}`;
            //     return (9 * text.length  + 20); 
            // }); 
            .attr("width", function (d) { return xScale(d.data.weight); });

        leafNodeGEnter.append("text")
            .style("text-anchor", "start")
            .text(function(d) {
                return d.id;
            })
            .attr("dy", -5)
            .attr("x", 8)
            .attr("width", function (d) { return xScale(d.data.weight) - 8; });
            // .call(dotme);
    

            // Attach the xAxis a the top of the document
            g.insert('g')
                .attr('class', 'xAxis')
                .attr(
                    'transform',
                    'translate(' + (7 + width) + ',' + 0 + ')',
                )
                .call(xAxis);

            // tick mark for x-axis
            g.insert('g')
                .attr('class', 'grid')
                .attr(
                    'transform',
                    'translate(' +
                        (7 + width) +
                        ',' +
                        height +
                        ')',
                )
                .call(
                    d3
                        .axisBottom()
                        .scale(xScale)
                        .ticks(5)
                        .tickSize(-height, 0, 0)
                        .tickFormat(''),
                );

            // Write down text for every collapsed datum
            //var leafNodeGCollapsed = g.selectAll(".node--leaf")
            //leafNodeGCollapsed.append("text")
            //    .attr("y", -10)
            //    .style("text-anchor", "middle")
            //    .text(function (d) {
            //        return ((d.isCollapsedNode === true) ? d.data.id.substring(d.data.id.lastIndexOf(".") + 1 ) : '');
            //    });
            //var internalNodeCollapsed = g.selectAll(".node--internal");
            //internalNodeCollapsed.append("text")
            //    .attr("y", -10)
            //    .style("text-anchor", "middle")
            //    .text(function (d) {
            //        return ((d.isCollapsedNode === true) ? d.data.id.substring(d.data.id.lastIndexOf(".") + 1 ) : '');
            //    });

            // Emphasize the y-axis baseline.
            svg.selectAll('.grid')
                .select('line')
                .style('stroke-dasharray', '20,1')
                .style('stroke', 'black');

            
            //// Animation functions for mouse on and off events.
            d3.selectAll('.node--leaf-g')
                .on('mouseover', handleMouseOver)
                .on('mouseout', handleMouseOut);

            d3.selectAll('.node--internal')
                .on('mouseover', handleMouseOverInternalNode)
                .on('mouseout', handleMouseOutInternalNode);
            // tata
        } else {
        }

        function handleMouseOver(d) {
            var leafG = d3.select(this);

            leafG.select("rect")
                    .attr("stroke","#4D4D4D")
                    .attr("stroke-width","2");

            let textSize = leafG.select("text").node().getComputedTextLength(); //get text length
            
            // tooltip.style("opacity", 1);		
            // tooltip.html(`${d.id} - ${d.data.weight.toFixed(1)}`)
            //     .style("left", d3.event.pageX + "px")		
            //     .style("top", (d3.event.pageY - 28) + "px");
        }
        function handleMouseOut() {
            var leafG = d3.select(this);

            leafG.select("rect")
                    .attr("stroke-width","0");
            // tooltip.style("opacity", 0);
        }

        function handleMouseOverInternalNode(d) {
            var nodeG = d3.select(this);
            var text = nodeG.select("text");
            // tooltip.style("opacity", 1);		
            // tooltip.html(`${d.id} - ${d.data.weight.toFixed(1)}`)
            //     .style("left", (d3.event.pageX - text.node().getComputedTextLength() *0.5) + "px")		
            //     .style("top", (d3.event.pageY - 28) + "px");
            nodeG.select("circle")
                .attr("r", 8)
        }
        
        function handleMouseOutInternalNode(d) {
            // tooltip.style("opacity", 0);
            d3.select(this).select("circle")
                .attr("r", 4)
        }
    }

    collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(this.collapse);
            d.children = null;
        }
    }

    expand(d) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
    }

    removeCurrentGraph(svg) {
        svg.selectAll('path.link').remove();
        svg.selectAll('g.node').remove();
        svg.selectAll('g.ballG').remove();
        svg.selectAll('.grid').remove();
    }

    click(
        d,
        svg,
        tree,
        root,
        g,
    ) {
        let saveD = d;
        if(d.children) {
            this.collapse(d)
        } else {
            this.expand(d)
        }
        this.removeCurrentGraph(svg);
        this.update(
            svg,
            tree,
            root,
            g,
        );
        this.centerNode(saveD, svg, g);
    }
    centerNode(source, svg, g) {
        let scale = d3.zoomTransform(this).k;
        let x = -source.x;
        let y = -source.y;
        x = x * scale + d3.select('svg').attr('width') / 2;
        y = y * scale + d3.select('svg').attr('height') / 2;
        svg.call(d3.zoom().transform, d3.zoomIdentity.translate(x, y));
        if ((x, y)) {
            g.transition()
                .duration(1000)
                .attr('transform', 'translate(' + x + ',' + y + ')');
        }  
    }

    addRootElements(data) {
        let newData = [];
        let elementsDone = [];
        let parentsAdded = [];

        if (data) {
            for (let elem of data) {
                if (elementsDone.indexOf(elem.target) < 0) {
                    let parentExist = false;
                    elementsDone.push(elem.target);

                    for (let comparedElem of data) {
                        if (comparedElem.target == elem.source) {
                            parentExist = true;
                        }
                    }

                    if (!parentExist) {
                        if (parentsAdded.indexOf(elem.source) < 0) {
                            newData.push({
                                source: 'fakeRoot',
                                target: elem.source,
                                weight: 0,
                            });
                            parentsAdded.push(elem.source);
                        }
                    }
                }
            }

            newData.push({
                source: '',
                target: 'fakeRoot',
                weight: 0,
                isFakeNode: true,
            });

            newData.push.apply(newData, data);
        }
        return newData;
    }

    zoom(g) {
        g.attr('transform', d3.event.transform);
    }
    // tata code base

    updateDimensions() {
        this.removeGraph();
        this.setGraph();
    }

    removeGraph() {
        d3.select(this.divContainer.current)
            .selectAll('#d3DivContainer')
            .selectAll('div')
            .remove();

        d3.select(this.divContainer.current)
            .selectAll('#d3DivContainer')
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

    zoomIconEnter() {
        this.zoomIndicator.current.style.visibility = 'visible';
        this.zoomIndicatorBackground.current.style.visibility = 'visible';
    }

    zoomIconLeave() {
        this.zoomIndicator.current.style.visibility = 'hidden';
        this.zoomIndicatorBackground.current.style.visibility = 'hidden';
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
                    id="zoomIndicatorBackground"
                    ref={this.zoomIndicatorBackground}
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                        top: `${margin.top}px`,
                        left: `${margin.left}px`,
                        width: `${width}px`,
                        height: `${height - margin.top - margin.bottom}px`,
                        backgroundColor: '#0000006b',
                    }}
                />
                <div
                    id={`zoomIndicator${this.uniqueId}`}
                    ref={this.zoomIndicator}
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                        top: `${height / 2 - 30}px`,
                        left: `${margin.left + width / 2 - 275}px`,
                        color: 'white',
                    }}
                >
                    <h4>
                        {polyglot.t('user_can_interact_with_mouse_1')}
                        <br />
                        {polyglot.t('user_can_interact_with_mouse_2')}
                    </h4>
                </div>
                <div
                    id={`zoomIconContainer${this.uniqueId}`}
                    onMouseEnter={this.zoomIconEnter}
                    onMouseLeave={this.zoomIconLeave}
                    style={{ position: 'absolute', top: '210px', left: '55px' }}
                >
                    <ZoomIcon width={35} />
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

export default compose(
    injectData(),
    exportableToPng,
)(Hierarchy);
