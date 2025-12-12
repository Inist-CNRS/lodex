import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type {
    ForceGraphMethods,
    LinkObject,
    NodeObject,
} from 'react-force-graph-3d';
import {
    BoxGeometry,
    Group,
    Mesh,
    MeshLambertMaterial,
    SphereGeometry,
    Vector3,
} from 'three';
import Loading from '../../../components/Loading';
import { AutoComplete } from '../../../form-fields/AutoCompleteField';
import { useTranslate } from '../../../i18n/I18NContext';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import type { Link, Node } from '../network/useFormatNetworkData';

import {
    Box,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from '@mui/material';
import SpriteText from 'three-spritetext';
import { GraphAction } from '../../../../public-app/src/graph/GraphAction';
import { useSearchPaneContextOrDefault } from '../../../search/useSearchPaneContext';
import { compareNodes, isLinkVisible } from '../network/NetworkBase';
import { NetworkCaption } from '../network/NetworkCaption';
import { useLinkColor } from '../network/useLinkColor';

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

type NetworkBaseProps = {
    colorSet?: string[];
    nodes: Node[];
    links: Link[];
    forcePosition?: boolean;
    linkCurvature?: number;
    highlightMode?: 'ingoing' | 'outgoing' | 'all';
    showArrows?: boolean;
    fieldToFilter?: string | null;
    secondFieldToFilter?: string | null;
    captions?: {
        label: string;
        color: string;
    }[];
    captionTitle?: string;
    displayDifferentShape?: boolean;
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
    secondFieldToFilter,
    captions,
    captionTitle,
    displayDifferentShape = false,
}: NetworkBaseProps) => {
    const fgRef = useRef<ForceGraphMethods>();
    const nodeObjectsRef = useRef<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Map<string, { group: Group; sprite: any; node: Node }>
    >(new Map());
    const [mode, setMode] = useState<'arrow' | 'animated'>('animated');
    const animationFrameRef = useRef<number>();
    const { translate } = useTranslate();
    const { selectOne, clearFilters } = useSearchPaneContextOrDefault();
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
                    height: node.clientHeight - 51, // 51 is the height of the mouseIcon
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

    const handleNodeHover = useCallback((node: NodeObject | null) => {
        // freeze the chart so that it does not rearrange itself every time we interact with it
        setCooldownTime(0);
        setHoveredNode(node);
    }, []);

    const handleNodeClick = useCallback(
        (node: NodeObject | null) => {
            // freeze the chart so that it does not rearrange itself every time we interact with it
            setCooldownTime(0);

            if (!node || selectedNode?.id === node?.id) {
                setSelectedNode(null);
                clearFilters();
                return;
            }
            setSelectedNode(node);

            const nodeId = node.id?.toString();
            const label =
                node.label !== nodeId ? `${node.label} (${nodeId})` : nodeId;

            if (secondFieldToFilter && fieldToFilter && nodeId) {
                selectOne(
                    node.isLeaf
                        ? {
                              fieldName: secondFieldToFilter,
                              value: nodeId,
                              label,
                          }
                        : {
                              fieldName: fieldToFilter,
                              value: nodeId,
                              label,
                          },
                );
                return;
            }

            if (fieldToFilter && nodeId) {
                selectOne({
                    fieldName: fieldToFilter,
                    value: nodeId,
                    label,
                });
            }

            if (!fgRef.current) {
                return;
            }
            const distance = 80;
            const distRatio =
                1 + distance / Math.hypot(node.x!, node.y!, node.z!);

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
        },
        [
            clearFilters,
            fieldToFilter,
            secondFieldToFilter,
            selectOne,
            selectedNode,
        ],
    );

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

    const [minLinkSize, maxLinkSize] = useMemo(() => {
        const sizes = links
            .map((l) => l.value)
            .filter((v): v is number => typeof v === 'number');
        return [Math.min(...sizes), Math.max(...sizes)];
    }, [links]);

    const linkColor = useLinkColor({
        mode,
        minLinkSize,
        maxLinkSize,
    });

    const handleResetZoom = () => {
        if (!fgRef.current) {
            return;
        }

        fgRef.current.zoomToFit(250);
    };

    const sortedGraphData = useMemo(() => {
        return {
            nodes: sortedNodes,
            links,
        };
    }, [links, sortedNodes]);

    const nodeLabelFn = useCallback((node: NodeObject) => {
        return node.label;
    }, []);
    const nodeValFn = useCallback((n: NodeObject) => n.radius, []);
    const nodeColorFn = useCallback(() => colorSet![0], [colorSet]);
    const nodeThreeObjectFn = useCallback(
        (node: NodeObject) => {
            // Create a group to hold both sphere and text
            const group = new Group();

            // Determine if this node should be dimmed
            const isHighlighted =
                highlightedNodeIds.length === 0 ||
                highlightedNodeIds.includes(node.id as string);
            const opacity = isHighlighted ? 1.0 : 0.1;

            // Create the sphere
            const radius = Math.max(node.radius, 0.5);
            const geometry =
                displayDifferentShape && node.isLeaf
                    ? new BoxGeometry(radius, radius, radius)
                    : new SphereGeometry(radius);
            const geometryMesh = new Mesh(
                geometry,
                new MeshLambertMaterial({
                    color: node.color ?? colorSet?.[0] ?? '#ffffff',
                    opacity: opacity,
                    transparent: true,
                }),
            );

            // Create the text sprite
            const sprite = new SpriteText(node.label ?? node.id);
            sprite.color = 'black';
            sprite.textHeight = node.radius;
            sprite.strokeColor = 'white';
            sprite.strokeWidth = 0.5;
            sprite.material.opacity = opacity;
            sprite.material.transparent = true;

            // Add both to the group
            group.add(geometryMesh);
            group.add(sprite);

            // Store reference for dynamic positioning
            nodeObjectsRef.current.set(node.id as string, {
                group,
                sprite,
                node: node as Node,
            });

            return group;
        },
        [colorSet, highlightedNodeIds, displayDifferentShape],
    );

    const linkColorFn = useCallback(
        (link: LinkObject) => linkColor(link as Link),
        [linkColor],
    );

    const linkVisibilityFn = useCallback(
        (link: LinkObject) =>
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
            }),
        [highlightMode, hoveredNode, selectedNode],
    );

    const linkWidthFn = useCallback(
        (link: LinkObject) =>
            showArrows && mode === 'arrow' ? 1 : (link as Link).value ?? 1,
        [mode, showArrows],
    );

    const linkLabelFn = useCallback(
        (link: LinkObject) => (link as Link).label ?? '',
        [],
    );

    return (
        <div style={{ height: `500px` }}>
            <FormatFullScreenMode>
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container} ref={containerRef}>
                    <GraphAction>
                        {showArrows && (
                            <ToggleButtonGroup
                                value={mode}
                                exclusive
                                onChange={(_, value) =>
                                    setMode(value as 'arrow' | 'animated')
                                }
                                aria-label={translate('network_mode')}
                                sx={{
                                    height: '56px',
                                }}
                            >
                                <ToggleButton value="arrow">
                                    {translate('network_mode_arrow')}
                                </ToggleButton>
                                <ToggleButton value="animated">
                                    {translate('network_mode_animated')}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        )}
                        <AutoComplete
                            label={translate('select_node')}
                            value={selectedNode?.id || null}
                            onChange={(_event, value) =>
                                handleNodeClick(
                                    nodes.find((node) => node.id === value) ||
                                        null,
                                )
                            }
                            getOptionLabel={(option: string) => option}
                            options={nodes
                                .map((node) => node.id as string)
                                .sort((a, b) => a.localeCompare(b))}
                            name="search"
                            sx={{
                                maxWidth: '384px',
                            }}
                        />
                    </GraphAction>
                    <Suspense
                        fallback={<Loading>{translate('loading')}</Loading>}
                    >
                        <ForceGraph3D
                            ref={fgRef}
                            backgroundColor="#ffffff00"
                            nodeVal={nodeValFn}
                            nodeColor={nodeColorFn}
                            nodeThreeObject={nodeThreeObjectFn}
                            width={width}
                            height={height}
                            graphData={sortedGraphData}
                            nodeLabel={nodeLabelFn}
                            linkColor={linkColorFn}
                            linkVisibility={linkVisibilityFn}
                            onNodeClick={handleNodeClick}
                            onNodeHover={handleNodeHover}
                            enableNodeDrag={false}
                            linkWidth={linkWidthFn}
                            linkLabel={linkLabelFn}
                            cooldownTime={forcePosition ? 0 : cooldownTime}
                            cooldownTicks={forcePosition ? 0 : undefined}
                            linkCurvature={linkCurvature}
                            linkDirectionalParticleWidth={
                                showArrows && mode === 'animated' ? 4 : 0
                            }
                            linkDirectionalParticles={
                                showArrows && mode === 'animated' ? 2 : 0
                            }
                            linkDirectionalParticleSpeed={
                                showArrows && mode === 'animated' ? 0.005 : 0
                            }
                            linkDirectionalArrowLength={
                                showArrows && mode === 'arrow' ? 3 : 0
                            }
                            linkDirectionalArrowRelPos={
                                showArrows && mode === 'arrow' ? 1 : 0
                            }
                        />
                    </Suspense>

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            '& svg': {
                                width: '32px',
                                height: '32px',
                            },
                        }}
                    >
                        <MouseIcon />
                    </Box>

                    <Tooltip title={translate('recenter_graph')}>
                        <IconButton
                            onClick={handleResetZoom}
                            sx={{
                                position: 'absolute',
                                left: '48px',
                                bottom: '8px',
                            }}
                        >
                            <FilterCenterFocusIcon />
                        </IconButton>
                    </Tooltip>
                    <NetworkCaption
                        captions={captions}
                        captionTitle={captionTitle}
                    />
                </div>
            </FormatFullScreenMode>
        </div>
    );
};
