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
    }

    setGraph() {

        if (this.props.formatData) {
            // tata code base

            //var svg = d3.select('svg'),
            let svg = d3.select(this.anchor.current);
            //let width = +svg.attr('width');
            const width = this.divContainer.current.clientWidth;
            let height = 4500;
            let g = svg.append('g').attr('transform', 'translate(20,20)'); // move right 20px.
            let ratioGridTree = 0.7; // width of the tree/ width of the grid

            // define the zoomListener which calls the zoom function on the "zoom" event
            var zoomListener = d3.zoom().on('zoom', () => { this.zoom(g) } );
            svg.call(zoomListener);

            // x-scale and x-axis
            //var experienceName = [
            //    '',
            //    'Basic 1.0',
            //    'Alright 2.0',
            //    'Handy 3.0',
            //    'Expert 4.0',
            //    'Guru 5.0',
            //];
            //var formatSkillPoints = function(d) {
            //    return experienceName[d % 6];
            //};
            var xScale = d3
                .scaleLinear()
                .domain([0, 5]) // the values // tata
                .range([0, width * (1 - ratioGridTree)]);
            let maxWeight = 0;
            var xAxis = d3
                .axisTop()
                .scale(xScale)
                .ticks(5);
            // .tickFormat(formatSkillPoints);

            // Setting up a way to handle the data
            var tree = d3
                .cluster() // This D3 API method setup the Dendrogram elements position.
                .separation(function(a, b) {
                    return a.parent == b.parent ? 3 : 4;
                }) // define separation ratio between siblings
                .size([height, width * ratioGridTree]); // Total width - bar chart width = Dendrogram chart width

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
                maxWeight = d3.max(root.leaves(), function(d) {
                    return d.data.weight;
                });
                xScale.domain([0, maxWeight]);
                xAxis.scale(xScale);

                this.update(
                    svg,
                    width,
                    height,
                    tree,
                    xScale,
                    maxWeight,
                    root,
                    ratioGridTree,
                    xAxis,
                    g,
                );
            } 
        }
    }

    update(
        svg,
        width,
        height,
        tree,
        xScale,
        maxWeight,
        root,
        ratioGridTree,
        xAxis,
        g,
    ) {
        // update tree size
        if (root && tree) {
            height = (root.leaves().length + 1) * 50;
            // d3.select("svg").attr("height", height)
            tree.size([height, width * ratioGridTree]);
            // tree.nodeSize([40, 200])

            // update axis
            maxWeight = d3.max(root.leaves(), function(d) {
                return d.data.weight;
            });
            xScale.domain([0, maxWeight]);
            xAxis.scale(xScale);
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
                    width *
                    ratioGridTree;
            });

            // Draw every datum a line connecting to its parent.
            g.selectAll('.link')
                .data(
                    root
                        .descendants()
                        .slice(1)
                        .filter(d => !d.parent.data.isFakeNode),
                ) // remove links from fakeRootNode
                .enter()
                .append('path')
                .attr('class', function(d) {
                    return d.parent.isCollapsedNode ? '' : 'link';
                })
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
            var node = g
                .selectAll('.node')
                .data(
                    root.descendants().filter(d => {
                        return !d.data.isFakeNode; // remove fake node (ie: fakeRoot and fake children when collapsed)
                    }),
                )
                .enter()
                .append('g')
                .attr('class', function(d) {
                    return (
                        'node' +
                        (d.children ? ' node--internal' : ' node--leaf') +
                        (d.isCollapsedNode ? ' node--collapsed' : '')
                    );
                })
                .attr('transform', function(d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

            // Draw every datum a small circle.
            node.append('circle').attr('r', 4);

            node.on('click', () => {
                this.click(
                    this,
                    svg,
                    width,
                    height,
                    tree,
                    xScale,
                    maxWeight,
                    root,
                    ratioGridTree,
                    xAxis,
                    g,
                );
            });

            // Setup G for every leaf datum. (rectangle)
            var leafNodeG = g
                .selectAll('.node--leaf')
                .append('g')
                .attr('class', 'node--leaf-g')
                .attr('transform', 'translate(' + 8 + ',' + -13 + ')'); // move rectangle to be centered to the node

            leafNodeG
                .append('rect')
                .attr('class', 'shadow')
                .style('fill', function(d) {
                    return '#ebebeb';
                })
                .attr('width', 2)
                .attr('height', 30)
                .attr('rx', 2)
                .attr('ry', 2)
                .transition()
                .duration(800)
                // .attr("width", function (d) {
                //     let text = Number(d.data.weight).toFixed(1) + ` - ${d.id}`;
                //     return (9 * text.length  + 20);
                // });
                .attr('width', function(d) {
                    return xScale(d.data.weight);
                });

            leafNodeG
                .append('text')
                .attr('dy', 19.5)
                .attr('x', 8)
                .style('text-anchor', 'start')
                .text(function(d) {
                    // let text = d.id ? Number(d.data.weight).toFixed(1) + ` - ${d.id}` : '';
                    // return text;
                    return d.id;
                });

            // Write down text for every parent datum
            var internalNode = g.selectAll('.node--internal');
            internalNode
                .append('text')
                .attr('y', -10)
                .style('text-anchor', 'middle')
                .text(function(d) {
                    // let text = Number(d.data.weight).toFixed(1) + ` - ${d.id}`;
                    // return text;
                    return d.id;
                });

            // Attach the xAxis a the top of the document
            g.insert('g')
                .attr('class', 'xAxis')
                .attr(
                    'transform',
                    'translate(' + (7 + width * ratioGridTree) + ',' + 0 + ')',
                )
                .call(xAxis);

            // tick mark for x-axis
            g.insert('g')
                .attr('class', 'grid')
                .attr(
                    'transform',
                    'translate(' +
                        (7 + width * ratioGridTree) +
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

            // The moving ball
            // tata
            var ballG = g
                .insert('g')
                .attr('class', 'ballG')
                .attr('stroke-width', '5')
                .attr(
                    'transform',
                    'translate(' + (width + 1000) + ',' + height / 2 + ')',
                );
            ballG
                .insert('circle')
                .attr('class', 'shadow')
                .style('fill', 'steelblue')
                .attr('r', 5);
            ballG
                .insert('text')
                .style('text-anchor', 'middle')
                .attr('dy', 5)
                .text('0.0');

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

            leafG
                .select('rect')
                .attr('stroke', '#4D4D4D')
                .attr('stroke-width', '2');

            let textSize = leafG
                .select('text')
                .node()
                .getComputedTextLength(); //get text length
            var ballGMovement = ballG
                .transition()
                .duration(400)
                .attr(
                    'transform',
                    'translate(' + (d.x + textSize + 90) + ',' + d.y + ')',
                );

            ballGMovement
                .select('circle')
                .style('fill', '#454545')
                .attr('r', 18);

            let text = Number(d.data.weight).toFixed(1);
            ballGMovement
                .select('text')
                .delay(300)
                .text(text);
        }
        function handleMouseOut() {
            var leafG = d3.select(this);

            leafG.select('rect').attr('stroke-width', '0');
        }
        function handleMouseOverInternalNode(d) {
            var text = d3.select(this).select('text');
            text.text(function(d) {
                return d.id + ' - ' + d.data.weight.toFixed(1);
            });
            d3.select(this)
                .select('circle')
                .attr('r', 8);
        }
        function handleMouseOutInternalNode(d) {
            var text = d3.select(this).select('text');
            text.text(function(d) {
                return d.id;
            });
            d3.select(this)
                .select('circle')
                .attr('r', 4);
        }
    }

    collapse(d) {
        if (d.children != null && !d.isCollapsedNode) {
            d.isCollapsedNode = true;
            d.children.forEach(this.collapse);
            d._children = d.children;
            // d.children = null;
            d.children = [
                {
                    children: null,
                    parent: d,
                    depth: d.depth + 1,
                    height: 1,
                    id: '',
                    data: {
                        isFakeNode: true, // flag to mark built node
                        weight: 0,
                        target: null,
                        source: d.id,
                    },
                },
            ];
        } else {
            d.children = d._children;
            d._children = null;
            d.isCollapsedNode = false;
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
        width,
        height,
        tree,
        xScale,
        maxWeight,
        root,
        ratioGridTree,
        xAxis,
        g,
    ) {
        let saveD = d;
        this.collapse(d);
        this.removeCurrentGraph(svg);
        this.update(
            svg,
            width,
            height,
            tree,
            xScale,
            maxWeight,
            root,
            ratioGridTree,
            xAxis,
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
