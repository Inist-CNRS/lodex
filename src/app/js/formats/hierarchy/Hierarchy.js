import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
import { StyleSheet, css } from 'aphrodite/no-important';
import * as d3 from 'd3';
import { zoomFunction, generateUniqueId } from './utils';
import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import ZoomIcon from './zoomIcon';
import CenterGraph from './centerGraph';
import cliTruncate from 'cli-truncate';

const styles = StyleSheet.create({
    divContainer: {
        overflow: 'hidden',
        position: 'relative',
    },
    link: {
        fill: 'none',
        stroke: '#555',
        strokeOpacity: 0.4,
        strokeWidth: '1px',
    },

    text: {
        fill: 'black',
        fontWeight: 'bold',
        fontSize: '12px',
    },

    node: {
        cursor: 'pointer',
    },

    nodeCircle: {
        fill: '#999',
    },

    nodeInternalCircle: {
        fill: '#555',
    },

    nodeInternalText: {
        fontSize: '12px',
    },

    nodeLeafText: {
        fill: '#000000',
    },

    nodeCollapsedText: {
        fill: '#000',
    },

    nodeCollapsedCircle: {
        fill: '#555',
    },

    shadow: {
        webkitFilter: 'drop-shadow(-1.5px -1.5px 1.5px #000)',
        filter: 'drop-shadow(-1.5px -1.5px 1.5px #000)',
    },

    svg: {
        border: 'black solid 1px',
    },

    tooltip: {
        position: 'absolute',
        textAlign: 'center',
        padding: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        background: '#ebebeb',
        border: 'solid 1px black',
        borderRadius: '8px',
        pointerEvents: 'none',
    },
});

class Hierarchy extends PureComponent {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            width: 900,
            height: 600,
            margin: { top: 60, right: 40, bottom: 50, left: 60 },
        };
        this.zoomIconEnter = this.zoomIconEnter.bind(this);
        this.zoomIconLeave = this.zoomIconLeave.bind(this);
        this.centerGraphClick = this.centerGraphClick.bind(this);

        this.divContainer = React.createRef();
        this.svgContainer = React.createRef();
        this.tooltipContainer = React.createRef();
        this.anchor = React.createRef();
        this.zoomIndicator = React.createRef();
        this.zoomIndicatorBackground = React.createRef();

        this.mouseIsOverStream = false;
        this.zoomFunction = zoomFunction.bind(this);
        this.uniqueId = generateUniqueId();
        this.collapse = this.collapse.bind(this);
        this.initialPosition = {
            x: 20,
            y: 20,
            scale: 0,
        };
    }

    svg() {
        return d3.select(this.svgContainer.current);
    }

    g() {
        return d3.select(this.anchor.current);
    }

    tooltip() {
        return d3.select(this.tooltipContainer.current);
    }

    setGraph() {
        if (this.props.formatData) {
            this.g().attr('transform', 'translate(20,20)'); // move right 20px.

            // Setting up a way to handle the data
            let tree = d3
                .cluster() // This D3 API method setup the Dendrogram elements position.
                .separation(function(a, b) {
                    return a.parent == b.parent ? 3 : 4;
                }); // define separation ratio between siblings

            let stratify = d3
                .stratify() // This D3 API method gives cvs file flat data array dimensions.
                .id(function(d) {
                    return d.target;
                })
                .parentId(function(d) {
                    return d.source;
                });

            let myData;

            let treeData = this.props.formatData;

            try {
                if (treeData) {
                    myData = this.addRootElements(treeData);
                    this.root = stratify(myData);
                    // collpsed all nodes
                    this.root.children.forEach(d =>
                        d.children.forEach(this.collapse),
                    );

                    this.update(tree);
                }
            } catch (error) {
                const { p: polyglot } = this.props;
                this.tooltip()
                    .style('background-color', 'red')
                    .style('color', 'white')
                    .style('border-color', 'red')
                    .style('opacity', 1)
                    .style('top', `${+this.svg().attr('height') / 2}px`)
                    .style('left', `${+this.svg().attr('width') / 2 - 140}px`)
                    .html(
                        `${polyglot.t('error_rendering_chart')}:<br>${error}`,
                    );
            }

            let current = this.divContainer.current;
            let gBbox = this.g()
                .node()
                .getBBox();

            if (
                current.clientWidth - gBbox.width <
                current.clientHeight - gBbox.height
            ) {
                this.initialPosition.scale = current.clientWidth / gBbox.width;
            } else {
                this.initialPosition.scale =
                    current.clientHeight / gBbox.height;
            }

            this.initialPosition.scale = this.initialPosition.scale * 0.8;
            this.centerGraphClick();
        }
    }

    update(tree) {
        // update tree size
        if (this.root && tree) {
            const height = (this.root.leaves().length + 1) * 50;
            const width = (this.root.depth + this.root.height) * 200;
            tree.size([height, width]);

            // update axis
            const maxWeight = d3.max(
                this.root
                    .descendants()
                    .filter(d => !d.children && !d._children),
                function(d) {
                    return d.data.weight;
                },
            );

            let xScale = d3
                .scaleLinear()
                .domain([0, maxWeight > 5 ? maxWeight : 5])
                .range([0, 500]);

            tree(this.root); // d3.cluster()
            let maxHeightInTree = 0;
            this.root.descendants().forEach(d => {
                if (maxHeightInTree < d.height) {
                    maxHeightInTree = d.height;
                }
            });

            this.root.descendants().forEach(d => {
                d.y = d.x;
                if (d.height > 0) {
                    d.x = (d.depth / maxHeightInTree) * width;
                } else {
                    d.x = ((d.depth - 1) / (d.depth + d.height - 1)) * width; // origin
                }
            });

            // Draw every datum a line connecting to its parent.
            let link = this.g()
                .selectAll(`.${css(styles.link)}`)
                // remove links from fakeRootNode
                .data(
                    this.root
                        .descendants()
                        .slice(1)
                        .filter(
                            d =>
                                !d.parent.data.isFakeNode &&
                                !d.parent.isCollapsedNode,
                        ),
                    function(d) {
                        return d.id;
                    },
                );

            //remove old links
            link.exit().remove();

            // update remaining link
            link.attr('d', function(d) {
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

            // add new one
            link.enter()
                .append('path')
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
            let node = this.g()
                .selectAll(`.${css(styles.node)}`)
                .data(
                    this.root.descendants().filter(d => {
                        return !d.data.isFakeNode; // remove fake node (ie: fakeRoot and fake children when collapsed)
                    }),
                    function(d) {
                        return d.id;
                    },
                );

            // remove old nodes
            node.exit().remove();

            //udpate remaining nodes
            node.attr('transform', function(d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

            let nodeLeafG = node
                .filter(function(d) {
                    return !d.children && !d._children;
                })
                .selectAll('g');
            nodeLeafG.select('rect').attr('width', function(d) {
                return xScale(d.data.weight);
            });
            nodeLeafG
                .select('text')
                .attr('width', function(d) {
                    return xScale(d.data.weight) - 8;
                })
                .text(function(d) {
                    return d.id;
                });

            // add new nodes
            let nodeEnter = node
                .enter()
                .append('g')
                .attr('class', function(d) {
                    return (
                        `${css(styles.node)}` +
                        (d.children || d._children
                            ? ' node--internal'
                            : ' node--leaf') +
                        (d._children ? ' node--collapsed' : '')
                    );
                })
                .on('click', d => {
                    this.click(d, tree);
                })
                .attr('transform', function(d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });
            nodeEnter
                .append('circle')
                .attr('class', `${css(styles.nodeInternalCircle)}`)
                .attr('r', 4);

            let nodeInternal = nodeEnter.filter(function(d) {
                return d.children || d._children;
            });
            nodeInternal
                .append('text')
                .style('text-anchor', 'start')
                .text(d => {
                    return cliTruncate(d.id, this.props.params.maxLabelLength);
                })
                .attr('y', -10);

            // Setup G for every leaf datum. (rectangle)
            let leafNodeGEnter = nodeEnter
                .filter(function(d) {
                    return !d.children && !d._children;
                })
                .append('g')
                .attr('class', 'node--leaf-g')
                .attr('transform', 'translate(' + 8 + ',' + 0 + ')'); // move rectangle to be centered to the node
            leafNodeGEnter
                .append('rect')
                .attr('class', '')
                .style('fill', function(d) {
                    return '#555';
                })
                .attr('width', 2)
                .attr('height', 10)
                .attr('rx', 2)
                .attr('ry', 2)
                .transition()
                .duration(500)
                .attr('width', function(d) {
                    return xScale(d.data.weight);
                });
            leafNodeGEnter
                .append('text')
                .style('text-anchor', 'start')
                .text(function(d) {
                    return d.id;
                })
                .attr('dy', -5)
                .attr('x', 8)
                .attr('width', function(d) {
                    return xScale(d.data.weight) - 8;
                });

            // Animation functions for mouse on and off events.
            this.g()
                .selectAll('.node--leaf-g')
                .on('mouseover', (d, i, nodes) => {
                    this.handleMouseOver(d, i, nodes);
                })
                .on('mouseout', (d, i, nodes) => {
                    this.handleMouseOut(d, i, nodes);
                });

            this.g()
                .selectAll('.node--internal')
                .on('mouseover', (d, i, nodes) => {
                    this.handleMouseOverInternalNode(d, i, nodes);
                })
                .on('mouseout', (d, i, nodes) => {
                    this.handleMouseOutInternalNode(d, i, nodes);
                });
        }
    }

    handleMouseOver(d, i, nodes) {
        let leafG = d3.select(nodes[i]);

        leafG
            .select('rect')
            .attr('stroke', '#4D4D4D')
            .attr('stroke-width', '2');
        this.tooltip().style('opacity', 1);

        this.tooltip()
            .html(`${d.id} : ${d.data.weight.toFixed(0)} document(s)`)
            .style('left', d3.event.layerX + 'px')
            .style('top', d3.event.layerY - 28 + 'px');
    }

    handleMouseOut(d, i, nodes) {
        let leafG = d3.select(nodes[i]);

        leafG.select('rect').attr('stroke-width', '0');
        this.tooltip().style('opacity', 0);
    }

    handleMouseOverInternalNode(d, i, nodes) {
        let nodeG = d3.select(nodes[i]);
        let text = nodeG.select('text');
        this.tooltip().style('opacity', 1);
        this.tooltip()
            .html(
                `${d.id}, ${this.props.p.t('poids')} : ${d.data.weight.toFixed(
                    0,
                )}`,
            )
            .style(
                'left',
                d3.event.layerX -
                    text.node().getComputedTextLength() * 0.5 +
                    'px',
            )
            .style('top', d3.event.layerY - 28 + 'px');
        nodeG.select('circle').attr('r', 8);
    }

    handleMouseOutInternalNode(d, i, nodes) {
        this.tooltip().style('opacity', 0);
        d3.select(nodes[i])
            .select('circle')
            .attr('r', 4);
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

    click(d, tree) {
        if (d.children) {
            this.collapse(d);
        } else {
            this.expand(d);
        }
        this.update(tree, this.root);
        this.centerNode(d);
    }

    centerNode(source) {
        let scale = d3.zoomTransform(this).k;
        let x = -source.x;
        let y = -source.y;
        x = x * scale + this.svg().attr('width') / 2;
        y = y * scale + this.svg().attr('height') / 2;
        this.svg().call(d3.zoom().transform, d3.zoomIdentity.translate(x, y));
        if ((x, y)) {
            this.g()
                .transition()
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
        newData = this.setRootNodeWeight(newData, parentsAdded);
        return newData;
    }

    setRootNodeWeight(data, rootNodesList) {
        if (data) {
            for (let rootName of rootNodesList) {
                const rootNodePos = data
                    .map(e => {
                        return e.target;
                    })
                    .indexOf(rootName);
                for (let elem of data) {
                    if (rootName === elem.source) {
                        data[rootNodePos].weight =
                            data[rootNodePos].weight + elem.weight;
                    }
                }
            }
        }
        return data;
    }

    zoom() {
        this.g().attr('transform', d3.event.transform);
    }

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
        this.removeGraph();
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

    centerGraphClick() {
        this.g().attr(
            'transform',
            'translate(' +
                this.initialPosition.x +
                ',' +
                this.initialPosition.y +
                ')scale(' +
                this.initialPosition.scale +
                ')',
        );

        let transform = d3.zoomIdentity
            .translate(this.initialPosition.x, this.initialPosition.y)
            .scale(this.initialPosition.scale);

        let zoomListener = d3.zoom().on('zoom', () => {
            this.zoom();
        });

        this.svg()
            .call(zoomListener)
            .call(zoomListener.transform, transform);
    }

    render() {
        const { width, height, margin } = this.state;
        const { p: polyglot } = this.props;

        return (
            <div
                ref={this.divContainer}
                style={{
                    overflow: 'hidden',
                    position: 'relative',
                }}
                id={`divContainer${this.uniqueId}`}
            >
                <div
                    id="zoomIndicatorBackground"
                    ref={this.zoomIndicatorBackground}
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                        width: `${width}px`,
                        height: `${height}px`,
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
                        left: 'calc(50% - 150px)',
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
                    style={{
                        position: 'absolute',
                        bottom: '32px',
                        left: '16px',
                    }}
                >
                    <ZoomIcon width={35} />
                </div>
                <div
                    id={`centerGraph${this.uniqueId}`}
                    onClick={this.centerGraphClick}
                    style={{
                        position: 'absolute',
                        bottom: '19px',
                        right: '56px',
                    }}
                >
                    <CenterGraph width={48} />
                </div>
                <svg
                    id={`svgContainer${this.uniqueId}`}
                    ref={this.svgContainer}
                    width={width + margin.left + margin.right}
                    height={height}
                >
                    <g id="anchor" ref={this.anchor} />
                </svg>
                <div
                    id={`tooltipContainer${this.uniqueId}`}
                    className={`${css(styles.tooltip)}`}
                    ref={this.tooltipContainer}
                />
            </div>
        );
    }
}

export default compose(
    injectData(),
    exportableToPng,
)(Hierarchy);
