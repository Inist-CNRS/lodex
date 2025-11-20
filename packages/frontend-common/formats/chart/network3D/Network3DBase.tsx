import {
    lazy,
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import type { NodeObject, ForceGraphMethods } from 'react-force-graph-3d';
import Loading from '../../../components/Loading';
import { AutoComplete } from '../../../form-fields/AutoCompleteField';
import { useTranslate } from '../../../i18n/I18NContext';
import { SearchPaneContext } from '../../../search/SearchPaneContext';
import { addTransparency } from '../../utils/colorHelpers';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import type { Link, Node } from '../network/useFormatNetworkData';
import {
    SphereGeometry,
    Mesh,
    MeshLambertMaterial,
    Group,
    Vector3,
    // @ts-expect-error TS7016
} from 'three';

import SpriteText from 'three-spritetext';

const ForceGraph3D = lazy(() => import('react-force-graph-3d'));

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
        width: '100%',
        height: '100%',
        maxHeight: typeof window !== 'undefined' ? window.innerHeight - 96 : 0,
    },
};

export const compareNodes = ({
    a,
    b,
    selectedNode,
    hoveredNode,
    highlightedNodeIds,
}: {
    a: Node;
    b: Node;
    selectedNode: NodeObject | null;
    hoveredNode: NodeObject | null;
    highlightedNodeIds: string[];
}) => {
    if (!selectedNode && !hoveredNode) {
        return a.radius - b.radius;
    }
    if (a.id === hoveredNode?.id) {
        return 1;
    }
    if (b.id === hoveredNode?.id) {
        return -1;
    }
    if (a.id === selectedNode?.id) {
        return 1;
    }
    if (b.id === selectedNode?.id) {
        return -1;
    }
    const isAHighlighted = highlightedNodeIds.some(
        (highlightNodeId) => highlightNodeId === a.id,
    );
    const isBHighlighted = highlightedNodeIds.some(
        (highlightNodeId) => highlightNodeId === b.id,
    );
    if (isAHighlighted && !isBHighlighted) {
        return 1;
    }
    if (!isAHighlighted && isBHighlighted) {
        return -1;
    }
    return a.radius - b.radius;
};

export const isLinkVisible = ({
    link,
    highlightMode,
    selectedNode,
    hoveredNode,
}: {
    link: {
        source: {
            id: string;
        };
        target: {
            id: string;
        };
    };
    highlightMode?: 'ingoing' | 'outgoing' | 'all';
    selectedNode: { id: string } | null;
    hoveredNode: { id: string } | null;
}) => {
    if (!selectedNode && !hoveredNode) {
        return true;
    }

    if (highlightMode === 'all') {
        return (
            selectedNode?.id === (link.source! as NodeObject).id ||
            selectedNode?.id === (link.target! as NodeObject).id ||
            hoveredNode?.id === (link.target! as NodeObject).id ||
            hoveredNode?.id === (link.source! as NodeObject).id
        );
    }
    if (highlightMode === 'ingoing') {
        return (
            selectedNode?.id === (link.target! as NodeObject).id ||
            hoveredNode?.id === (link.target! as NodeObject).id
        );
    }

    return (
        selectedNode?.id === (link.source! as NodeObject).id ||
        hoveredNode?.id === (link.source! as NodeObject).id
    );
};

type NetworkBaseProps = {
    colorSet?: string[];
    nodes: Node[];
    links: Link[];
    forcePosition?: boolean;
    linkCurvature?: number;
    highlightMode?: 'ingoing' | 'outgoing' | 'all';
    showArrows?: boolean;
    fieldToFilter?: string | null;
};

export const Network3DBase = ({
    colorSet,
    nodes,
    links,
    forcePosition,
    linkCurvature,
    highlightMode = 'all',
    showArrows = false,
    fieldToFilter,
}: NetworkBaseProps) => {
    const fgRef = useRef<ForceGraphMethods>();
    const nodeObjectsRef = useRef<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Map<string, { group: Group; sprite: any; node: Node }>
    >(new Map());
    const animationFrameRef = useRef<number>();
    const { translate } = useTranslate();
    const searchPane = useContext(SearchPaneContext);
    const [{ width, height }, setDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [cooldownTime, setCooldownTime] = useState(10000);
    const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
    const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);

    // Function to get camera coordinates
    const getCameraPosition = () => {
        if (!fgRef.current) return null;

        const camera = fgRef.current.camera();
        return {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
        };
    };

    // Function to update all sprite positions based on current camera position
    const updateSpritePositions = useCallback(() => {
        const cameraPosition = getCameraPosition();
        if (!cameraPosition) return;

        nodeObjectsRef.current.forEach(({ sprite, node, group }) => {
            const sphereRadius = Math.max(node.radius, 0.5);

            // Get the world position of the node (group)
            const nodeWorldPos = new Vector3();
            group.getWorldPosition(nodeWorldPos);

            // Calculate direction from node position to camera
            const cameraVector = new Vector3(
                cameraPosition.x - nodeWorldPos.x,
                cameraPosition.y - nodeWorldPos.y,
                cameraPosition.z - nodeWorldPos.z,
            );

            // Normalize and scale by radius + 1
            const direction = cameraVector.normalize();
            const offset = direction.multiplyScalar(sphereRadius + 1);

            // Set sprite position relative to the group (node center)
            sprite.position.set(offset.x, offset.y, offset.z);
        });
    }, []);

    // Animation loop to continuously update sprite positions
    const animate = useCallback(() => {
        updateSpritePositions();
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [updateSpritePositions]);

    const linksBySourceId = useMemo(() => {
        return links.reduce<Record<string, Link[]>>(
            (acc, link) => ({
                ...acc,
                [link.source as string]: [
                    ...(acc[link.source as string] || []),
                    link,
                ],
            }),
            {},
        );
    }, [links]);

    const linksByTargetId = useMemo(() => {
        return links.reduce<Record<string, Link[]>>(
            (acc, link) => ({
                ...acc,
                [link.target as string]: [
                    ...(acc[link.target as string] || []),
                    link,
                ],
            }),
            {},
        );
    }, [links]);

    const highlightedNodeIds = useMemo(() => {
        return [
            selectedNode?.id,
            hoveredNode?.id,
            ...(['all', 'outgoing'].includes(highlightMode)
                ? linksBySourceId[selectedNode?.id as string]?.map(
                      (l) => (l.target! as NodeObject).id,
                  ) || []
                : []),

            ...(['all', 'ingoing'].includes(highlightMode)
                ? linksByTargetId[selectedNode?.id as string]?.map(
                      (l) => (l.source! as NodeObject).id,
                  ) || []
                : []),

            ...(['all', 'outgoing'].includes(highlightMode)
                ? linksBySourceId[hoveredNode?.id as string]?.map(
                      (l) => (l.target! as NodeObject).id,
                  ) || []
                : []),

            ...(['all', 'ingoing'].includes(highlightMode)
                ? linksByTargetId[hoveredNode?.id as string]?.map(
                      (l) => (l.source! as NodeObject).id,
                  ) || []
                : []),
        ].filter((id): id is string => !!id);
    }, [
        hoveredNode?.id,
        linksBySourceId,
        selectedNode?.id,
        linksByTargetId,
        highlightMode,
    ]);

    // @ts-expect-error TS7006
    const containerRef = useCallback((node) => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(() => {
            if (node)
                setDimensions({
                    width: node.clientWidth,
                    height: node.clientHeight - 91, // 91 is the height of the autocomplete + margins
                });
        });
        resizeObserver.observe(node);
    }, []);

    useEffect(() => {
        setCooldownTime(10000);
        setSelectedNode(null);
        setHoveredNode(null);
        // Clear node objects map when nodes change
        nodeObjectsRef.current.clear();
    }, [nodes, links]);

    // Start animation loop when component mounts, cleanup on unmount
    useEffect(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [animate]);

    // @ts-expect-error TS7006
    const handleNodeHover = (node) => {
        // freeze the chart so that it does not rearrange itself every time we interact with it
        setCooldownTime(0);
        setHoveredNode(node);
    };

    const handleNodeClick = (node: NodeObject | null) => {
        // freeze the chart so that it does not rearrange itself every time we interact with it
        setCooldownTime(0);

        if (!node || selectedNode?.id === node?.id) {
            setSelectedNode(null);
            searchPane?.setFilter(null);
            return;
        }
        setSelectedNode(node);

        const nodeId = node.id?.toString();
        if (fieldToFilter && nodeId) {
            searchPane?.setFilter({
                field: fieldToFilter,
                value: nodeId,
            });
        }

        if (!fgRef.current) {
            return;
        }
        const distance = 80;
        const distRatio = 1 + distance / Math.hypot(node.x!, node.y!, node.z!);

        fgRef.current.cameraPosition(
            {
                x: (node.x ?? 0) * distRatio,
                y: (node.y ?? 0) * distRatio,
                z: (node.z ?? 0) * distRatio,
            },
            {
                x: node.x ?? 0,
                y: node.y ?? 0,
                z: node.z ?? 0,
            },
            1000,
        );
    };

    const sortedNodes = useMemo(() => {
        return nodes.sort((a, b) =>
            compareNodes({
                a,
                b,
                selectedNode,
                hoveredNode,
                highlightedNodeIds,
            }),
        );
    }, [nodes, highlightedNodeIds, selectedNode, hoveredNode]);

    return (
        <div style={{ height: `500px`, position: 'relative' }}>
            <FormatFullScreenMode>
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container} ref={containerRef}>
                    <AutoComplete
                        style={{ margin: '1rem' }}
                        label={translate('select_node')}
                        value={selectedNode?.id || null}
                        onChange={(_event, value) =>
                            handleNodeClick(
                                nodes.find((node) => node.id === value) || null,
                            )
                        }
                        getOptionLabel={(option: string) => option}
                        options={nodes
                            .map((node) => node.id as string)
                            .sort((a, b) => a.localeCompare(b))}
                        name="search"
                    />
                    <Suspense
                        fallback={<Loading>{translate('loading')}</Loading>}
                    >
                        <ForceGraph3D
                            ref={fgRef}
                            nodeVal={(n) => n.radius}
                            nodeColor={() => colorSet![0]}
                            nodeThreeObject={(node: Node) => {
                                // Create a group to hold both sphere and text
                                const group = new Group();

                                // Create the sphere
                                const sphere = new SphereGeometry(
                                    Math.max(node.radius, 0.5),
                                );
                                const sphereMesh = new Mesh(
                                    sphere,
                                    new MeshLambertMaterial({
                                        color:
                                            node.color ??
                                            colorSet?.[0] ??
                                            '#ffffff',
                                    }),
                                );

                                // Create the text sprite
                                const sprite = new SpriteText(
                                    node.label ?? node.id,
                                );
                                sprite.color = 'white';
                                sprite.textHeight = node.radius;
                                sprite.strokeColor = 'black';
                                sprite.strokeWidth = 0.5;

                                // Disable depth writing so text appears on top of sphere
                                // but still respects depth testing for other objects
                                // @ts-expect-error SpriteText material property
                                sprite.material.depthWrite = false;
                                // @ts-expect-error SpriteText renderOrder property
                                sprite.renderOrder = 999;

                                // Add both to the group
                                group.add(sphereMesh);
                                group.add(sprite);

                                // Store reference for dynamic positioning
                                nodeObjectsRef.current.set(node.id as string, {
                                    group,
                                    sprite,
                                    node,
                                });

                                return group;
                            }}
                            width={width}
                            height={height}
                            graphData={{
                                nodes: sortedNodes,
                                links,
                            }}
                            nodeLabel={(node) => {
                                return node.label;
                            }}
                            linkColor={(link) =>
                                link.color
                                    ? addTransparency(link.color, 0.25)
                                    : '#99999999'
                            }
                            linkVisibility={(link) =>
                                isLinkVisible({
                                    link: link as {
                                        source: { id: string };
                                        target: { id: string };
                                    },
                                    highlightMode,
                                    selectedNode: selectedNode as {
                                        id: string;
                                    } | null,
                                    hoveredNode: hoveredNode as {
                                        id: string;
                                    } | null,
                                })
                            }
                            onNodeClick={handleNodeClick}
                            onNodeHover={handleNodeHover}
                            enableNodeDrag={false}
                            linkWidth={(l) => l.value ?? 1}
                            linkLabel={(l) => l.label ?? ''}
                            cooldownTime={forcePosition ? 0 : cooldownTime}
                            cooldownTicks={forcePosition ? 0 : undefined}
                            linkCurvature={linkCurvature}
                            linkDirectionalParticleWidth={showArrows ? 4 : 0}
                            linkDirectionalParticles={showArrows ? 4 : 0}
                        />
                    </Suspense>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                        }}
                    >
                        {<MouseIcon />}
                    </div>
                </div>
            </FormatFullScreenMode>
        </div>
    );
};
