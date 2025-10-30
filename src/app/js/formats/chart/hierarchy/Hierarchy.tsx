import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import { StyleSheet, css } from 'aphrodite/no-important';
// @ts-expect-error TS7016
import * as d3 from 'd3';
import { zoomFunction, generateUniqueId } from './utils';
import injectData from '../../injectData';
// @ts-expect-error TS7016
import cliTruncate from 'cli-truncate';

import { isValidColor } from '../../utils/colorUtils';
import MouseIcon from '../../utils/components/MouseIcon';

import CenterIcon from '../../utils/components/CenterIcon';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';

const styles = StyleSheet.create({
    divContainer: {
        overflow: 'hidden',
        position: 'relative',
    },
    link: {
        fill: 'none',
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

    nodeInternalText: {
        fontSize: '12px',
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

interface HierarchyProps {
    params?: unknown;
    formatData: unknown[];
    colors: string;
    p: unknown;
    anchor: any;
}

class Hierarchy extends PureComponent<HierarchyProps> {
    _isMounted = false;
    mouseIcon = '';
    centerIcon = '';

    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.state = {
            width: 900,
            height: 600,
            margin: { top: 60, right: 40, bottom: 50, left: 60 },
        };
        this.centerGraphClick = this.centerGraphClick.bind(this);
        // @ts-expect-error TS2339
        this.divContainer = React.createRef();
        // @ts-expect-error TS2339
        this.svgContainer = React.createRef();
        // @ts-expect-error TS2339
        this.tooltipContainer = React.createRef();
        // @ts-expect-error TS2339
        this.anchor = React.createRef();

        // @ts-expect-error TS2339
        this.mouseIsOverStream = false;
        // @ts-expect-error TS2339
        this.zoomFunction = zoomFunction.bind(this);
        // @ts-expect-error TS2339
        this.uniqueId = generateUniqueId();
        this.collapse = this.collapse.bind(this);
        // @ts-expect-error TS2339
        this.initialPosition = {
            x: 0,
            y: 0,
            scale: 0,
        };
    }

    svg() {
        // @ts-expect-error TS2339
        return d3.select(this.svgContainer.current);
    }

    g() {
        // @ts-expect-error TS2339
        return d3.select(this.anchor.current);
    }

    tooltip() {
        // @ts-expect-error TS2339
        return d3.select(this.tooltipContainer.current);
    }

    setGraph() {
        if (this.props.formatData) {
            // @ts-expect-error TS2339
            this.setState({ width: this.divContainer.current.clientWidth });
            this.g().attr('transform', 'translate(20,20)'); // move right 20px.

            // Setting up a way to handle the data
            // @ts-expect-error TS2339
            this.tree = d3
                .cluster() // This D3 API method setup the Dendrogram elements position.
                // @ts-expect-error TS7006
                .separation(function (a, b) {
                    return a.parent == b.parent ? 3 : 4;
                }); // define separation ratio between siblings

            const stratify = d3
                .stratify() // This D3 API method gives cvs file flat data array dimensions.
                // @ts-expect-error TS7006
                .id(function (d) {
                    return d.target;
                })
                // @ts-expect-error TS7006
                .parentId(function (d) {
                    return d.source;
                });

            let myData;

            const treeData = this.props.formatData;

            try {
                if (treeData) {
                    myData = this.addRootElements(treeData);
                    // @ts-expect-error TS2339
                    this.root = stratify(myData);
                    // collpsed all nodes
                    // @ts-expect-error TS2339
                    this.root.children.forEach((d) =>
                        d.children.forEach(this.collapse),
                    );

                    this.update();
                }
                // @ts-expect-error TS2339
                const current = this.divContainer.current;
                const gBbox = this.g().node().getBBox();

                if (
                    current.clientWidth / gBbox.width <
                    current.clientHeight / gBbox.height
                ) {
                    // @ts-expect-error TS2339
                    this.initialPosition.scale =
                        current.clientWidth / gBbox.width;
                } else {
                    // @ts-expect-error TS2339
                    this.initialPosition.scale =
                        current.clientHeight / gBbox.height;
                }

                // @ts-expect-error TS2339
                this.initialPosition.scale = this.initialPosition.scale * 0.8;
                this.centerGraphClick();
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
                        // @ts-expect-error TS18046
                        `${polyglot.t('error_rendering_chart')}:<br>${error}`,
                    );
            }
        }
    }

    update() {
        const color = this.props.colors;
        // update tree size
        // @ts-expect-error TS2339
        if (this.root && this.tree) {
            // @ts-expect-error TS2339
            const height = (this.root.leaves().length + 1) * 50;
            // @ts-expect-error TS2339
            const width = (this.root.depth + this.root.height) * 200;
            // @ts-expect-error TS2339
            this.tree.size([height, width]);

            // update axis
            const maxWeight = d3.max(
                // @ts-expect-error TS2339
                this.root
                    .descendants()
                    // @ts-expect-error TS7006
                    .filter((d) => !d.children && !d._children),
                // @ts-expect-error TS7006
                function (d) {
                    return d.data.weight;
                },
            );

            const xScale = d3
                .scaleLinear()
                .domain([
                    0,
                    // @ts-expect-error TS2339
                    maxWeight > this.props.params.minimumScaleValue
                        ? maxWeight
                        : // @ts-expect-error TS2339
                          this.props.params.minimumScaleValue,
                ])
                .range([0, 500]);

            // @ts-expect-error TS2339
            this.tree(this.root); // d3.cluster()
            let maxHeightInTree = 0;
            // @ts-expect-error TS2339
            this.root.descendants().forEach((d) => {
                if (maxHeightInTree < d.height) {
                    maxHeightInTree = d.height;
                }
            });

            // @ts-expect-error TS2339
            this.root.descendants().forEach((d) => {
                d.y = d.x;
                if (d.height > 0) {
                    d.x = (d.depth / maxHeightInTree) * width;
                } else {
                    d.x = ((d.depth - 1) / (d.depth + d.height - 1)) * width; // origin
                }
            });

            // Draw every datum a line connecting to its parent.
            const link = this.g()
                .selectAll(`.${css(styles.link)}`)
                // remove links from fakeRootNode
                .data(
                    // @ts-expect-error TS2339
                    this.root
                        .descendants()
                        .slice(1)
                        .filter(
                            // @ts-expect-error TS7006
                            (d) =>
                                !d.parent.data.isFakeNode &&
                                !d.parent.isCollapsedNode,
                        ),
                    // @ts-expect-error TS7006
                    function (d) {
                        return d.id;
                    },
                );

            // remove old links
            link.exit().remove();

            // update remaining link
            // @ts-expect-error TS7006
            link.attr('d', function (d) {
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
                // @ts-expect-error TS7006
                .attr('d', function (d) {
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
                })
                .attr('stroke', isValidColor(color) ? color : 'black');

            // Setup position for every datum; Applying different css classes to parents and leafs.
            const node = this.g()
                .selectAll(`.${css(styles.node)}`)
                .data(
                    // @ts-expect-error TS2339
                    this.root.descendants().filter((d) => {
                        return !d.data.isFakeNode; // remove fake node (ie: fakeRoot and fake children when collapsed)
                    }),
                    // @ts-expect-error TS7006
                    function (d) {
                        return d.id;
                    },
                );

            // remove old nodes
            node.exit().remove();

            // udpate remaining nodes
            // @ts-expect-error TS7006
            node.attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

            const nodeLeafG = node
                // @ts-expect-error TS7006
                .filter(function (d) {
                    return !d.children && !d._children;
                })
                .selectAll('g');
            // @ts-expect-error TS7006
            nodeLeafG.select('rect').attr('width', function (d) {
                return xScale(d.data.weight);
            });
            nodeLeafG
                .select('text')
                // @ts-expect-error TS7006
                .attr('width', function (d) {
                    return xScale(d.data.weight) - 8;
                })
                // @ts-expect-error TS7006
                .text(function (d) {
                    return d.id;
                });

            // add new nodes
            const nodeEnter = node
                .enter()
                .append('g')
                // @ts-expect-error TS7006
                .attr('class', function (d) {
                    return (
                        `${css(styles.node)}` +
                        (d.children || d._children
                            ? ' node--internal'
                            : ' node--leaf') +
                        (d._children ? ' node--collapsed' : '')
                    );
                })
                // @ts-expect-error TS7006
                .on('click', (_event, d) => {
                    // @ts-expect-error TS2554
                    this.click(d, this.tree);
                })
                // @ts-expect-error TS7006
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });
            nodeEnter
                .append('circle')
                .attr('class', `${css(styles.nodeInternalCircle)}`)
                .attr('r', 4)
                .attr('fill', color);

            // @ts-expect-error TS7006
            const nodeInternal = nodeEnter.filter(function (d) {
                return d.children || d._children;
            });
            let currentId = '';

            nodeInternal
                .append('rect')
                // @ts-expect-error TS2339
                .attr('x', -5 - this.props.params.labelOffset)
                .attr('y', -22)
                // @ts-expect-error TS7006
                .attr('width', (d) => {
                    const label = this.getLabelAccordingChildren(d);
                    return label.length * 8;
                })
                // @ts-expect-error TS7006
                .attr('id', (d) => {
                    return `id_${d.id.split(' ').join('_')}_${
                        // @ts-expect-error TS2339
                        this.uniqueId
                    }_rect`;
                })
                .attr('height', 15)
                .attr('fill-opacity', '0.4')
                .attr('fill', '#FFFFFF');

            nodeInternal
                .append('text')
                .style('text-anchor', 'start')
                // @ts-expect-error TS7006
                .text((d) => {
                    return this.getLabelAccordingChildren(d);
                })
                // @ts-expect-error TS7006
                .attr('id', (d) => {
                    currentId = `id_${d.id.split(' ').join('_')}_${
                        // @ts-expect-error TS2339
                        this.uniqueId
                    }`;
                    return currentId;
                })
                // @ts-expect-error TS2339
                .attr('x', -this.props.params.labelOffset)
                .attr('y', -10);

            // Setup G for every leaf datum. (rectangle)
            const leafNodeGEnter = nodeEnter
                // @ts-expect-error TS7006
                .filter(function (d) {
                    return !d.children && !d._children;
                })
                .append('g')
                .attr('class', 'node--leaf-g')
                .attr('transform', 'translate(' + 8 + ',' + 0 + ')'); // move rectangle to be centered to the node
            leafNodeGEnter
                .append('rect')
                .attr('class', '')
                .style('fill', function () {
                    return color;
                })
                .attr('width', 2)
                .attr('height', 10)
                .attr('rx', 2)
                .attr('ry', 2)
                .transition()
                .duration(500)
                // @ts-expect-error TS7006
                .attr('width', function (d) {
                    return xScale(d.data.weight);
                });
            leafNodeGEnter
                .append('text')
                .style('text-anchor', 'start')
                // @ts-expect-error TS7006
                .text(function (d) {
                    return d.id;
                })
                .attr('dy', -5)
                .attr('x', 8)
                // @ts-expect-error TS7006
                .attr('width', function (d) {
                    return xScale(d.data.weight) - 8;
                });

            // Animation functions for mouse on and off events.
            this.g()
                .selectAll('.node--leaf-g')
                // @ts-expect-error TS7006
                .on('mouseover', (event, node) => {
                    this.handleMouseOver(event, node);
                })
                // @ts-expect-error TS7006
                .on('mouseout', (event, node) => {
                    this.handleMouseOut(event, node);
                });

            this.g()
                .selectAll('.node--internal')
                // @ts-expect-error TS7006
                .on('mouseover', (event, node) => {
                    this.handleMouseOverInternalNode(event, node);
                })
                // @ts-expect-error TS7006
                .on('mouseout', (event, node) => {
                    // @ts-expect-error TS2554
                    this.handleMouseOutInternalNode(event, node);
                });
        }
    }

    // @ts-expect-error TS7006
    handleMouseOver(event, node) {
        const leafG = d3.select(event.target);

        leafG.select('rect').attr('stroke-width', '2');
        this.tooltip().style('opacity', 1);

        this.tooltip()
            .html(`${node.id} : ${node.data.weight.toFixed(0)} document(s)`)
            .style('left', event.layerX + 'px')
            .style('top', event.layerY - 28 + 'px');
    }

    // @ts-expect-error TS7006
    handleMouseOut(_event, _node) {
        // @ts-expect-error TS18048
        const leafG = d3.select(event.target);

        leafG.select('rect').attr('stroke-width', '0');
        this.tooltip().style('opacity', 0);
    }

    // @ts-expect-error TS7006
    handleMouseOverInternalNode(event, node) {
        const nodeG = d3.select(event.target);
        this.tooltip().style('opacity', 1);
        this.tooltip()
            .html(
                // @ts-expect-error TS2339
                `${node.id}, ${this.props.p.t('poids')} : ${node.data.weight.toFixed(
                    0,
                )}`,
            )
            .style(
                'left',
                event.layerX - nodeG.node()
                    ? nodeG.node().getComputedTextLength() * 0.5
                    : 0 + 'px',
            )
            .style('top', event.layerY - 28 + 'px');
        nodeG.select('circle').attr('r', 8);
    }

    // @ts-expect-error TS7006
    handleMouseOutInternalNode(event) {
        this.tooltip().style('opacity', 0);
        d3.select(event.target).select('circle').attr('r', 4);
    }

    // @ts-expect-error TS7006
    collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(this.collapse);
            d.children = null;
        }
    }

    // @ts-expect-error TS7006
    expand(d) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
    }

    // @ts-expect-error TS7006
    click(d) {
        if (d.children) {
            this.collapse(d);
        } else {
            this.expand(d);
        }
        d3.select(
            // @ts-expect-error TS2339
            `[id="id_${d.id.split(' ').join('_')}_${this.uniqueId}"]`,
            // @ts-expect-error TS7006
        ).text((d) => {
            return this.getLabelAccordingChildren(d);
        });

        d3.select(
            // @ts-expect-error TS2339
            `[id="id_${d.id.split(' ').join('_')}_${this.uniqueId}_rect"]`,
            // @ts-expect-error TS7006
        ).attr('width', (d) => {
            const label = this.getLabelAccordingChildren(d);
            return label.length * 8;
        });

        this.update();
        this.centerNode(d);
    }

    // @ts-expect-error TS7006
    centerNode(source) {
        const scale = d3.zoomTransform(this).k;
        let x = -source.x;
        let y = -source.y;

        const divContainerBoundingRect = d3
            // @ts-expect-error TS2339
            .select(this.divContainer.current)
            .node()
            .getBoundingClientRect();
        x = x * scale + divContainerBoundingRect.width / 2;
        y = y * scale + divContainerBoundingRect.height / 2;

        this.svg().call(d3.zoom().transform, d3.zoomIdentity.translate(x, y));
        this.svg().on('dblclick.zoom', null);

        // @ts-expect-error TS2695
        if ((x, y)) {
            this.g()
                .transition()
                .duration(1000)
                .attr('transform', 'translate(' + x + ',' + y + ')');
        }
    }

    // @ts-expect-error TS7006
    addRootElements(data) {
        let newData = [];
        const elementsDone = [];
        const parentsAdded = [];

        if (data) {
            for (const elem of data) {
                if (elementsDone.indexOf(elem.target) < 0) {
                    let parentExist = false;
                    elementsDone.push(elem.target);

                    for (const comparedElem of data) {
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

            newData.push(...data);
        }
        newData = this.setRootNodeWeight(newData, parentsAdded);
        return newData;
    }

    // @ts-expect-error TS7006
    setRootNodeWeight(data, rootNodesList) {
        if (data) {
            for (const rootName of rootNodesList) {
                const rootNodePos = data
                    // @ts-expect-error TS7006
                    .map((e) => {
                        return e.target;
                    })
                    .indexOf(rootName);
                for (const elem of data) {
                    if (rootName === elem.source) {
                        data[rootNodePos].weight =
                            data[rootNodePos].weight + elem.weight;
                    }
                }
            }
        }
        return data;
    }

    // @ts-expect-error TS7006
    zoom(event) {
        this.g().attr('transform', event.transform);
    }

    updateDimensions() {
        this.removeGraph();
        this.setGraph();
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

        // if the tooltip content is available before componentDidMount, the content prints weirdly in a corner of the page
        // @ts-expect-error TS2322
        this.mouseIcon = <MouseIcon polyglot={this.props.p} />;
        // @ts-expect-error TS2322
        this.centerIcon = <CenterIcon polyglot={this.props.p} />;
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('resize', this.updateDimensions.bind(this));
        this.removeGraph();
    }

    // @ts-expect-error TS7006
    getLabelAccordingChildren(d) {
        if (d.children != null) {
            // @ts-expect-error TS2339
            return cliTruncate(d.id, this.props.params.maxLabelLength);
        } else {
            return d.id;
        }
    }

    centerGraphClick() {
        this.g().attr(
            'transform',
            'translate(' +
                // @ts-expect-error TS2339
                this.initialPosition.x +
                ',' +
                // @ts-expect-error TS2339
                this.initialPosition.y +
                ')scale(' +
                // @ts-expect-error TS2339
                this.initialPosition.scale +
                ')',
        );

        const transform = d3.zoomIdentity
            // @ts-expect-error TS2339
            .translate(this.initialPosition.x, this.initialPosition.y)
            // @ts-expect-error TS2339
            .scale(this.initialPosition.scale);

        // @ts-expect-error TS7006
        const zoomListener = d3.zoom().on('zoom', (event) => {
            this.zoom(event);
        });

        this.svg().call(zoomListener).call(zoomListener.transform, transform);

        // @ts-expect-error TS2339
        this.root.children.forEach((d) => {
            d.children.forEach(this.collapse);
        });
        this.update();
    }

    render() {
        // @ts-expect-error TS2339
        const { width, height } = this.state;
        const { p: polyglot } = this.props;

        return (
            <div
                // @ts-expect-error TS2339
                ref={this.divContainer}
                style={{
                    overflow: 'hidden',
                    position: 'relative',
                }}
                // @ts-expect-error TS2339
                id={`divContainer${this.uniqueId}`}
            >
                <div
                    style={{
                        position: 'absolute',
                        bottom: '0px',
                        left: '5px',
                    }}
                >
                    {this.mouseIcon}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: '1px',
                        left: '57px',
                    }}
                    onClick={this.centerGraphClick}
                    // @ts-expect-error TS2339
                    className={stylesWithClassnames.icon}
                >
                    {this.centerIcon}
                </div>

                <div
                    // @ts-expect-error TS2339
                    id={`centerGraphText${this.uniqueId}`}
                    // @ts-expect-error TS2339
                    ref={this.centerIndicator}
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                        bottom: '19px',
                        left: '50px',
                        color: 'black',
                    }}
                >
                    {/*
                     // @ts-expect-error TS18046 */}
                    {polyglot.t('graph_reinit')}
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
                <div
                    // @ts-expect-error TS2339
                    id={`tooltipContainer${this.uniqueId}`}
                    className={`${css(styles.tooltip)}`}
                    // @ts-expect-error TS2339
                    ref={this.tooltipContainer}
                />
            </div>
        );
    }
}

export default compose(injectData())(Hierarchy);
