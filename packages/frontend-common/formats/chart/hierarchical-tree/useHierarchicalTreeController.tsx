import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Tree, TreeNodeDatum, TreeProps } from 'react-d3-tree';

export async function walkNodes(
    tree: TreeNodeDatum[],
    action: (node: TreeNodeDatum) => void,
) {
    for (const node of tree) {
        action(node);
        await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const allChildren = tree.flatMap((node) => node.children ?? []);
    if (allChildren.length > 0) {
        await walkNodes(allChildren, action);
    }
}

export function getNodeAncestorById(
    tree: TreeNodeDatum[],
    id: string,
): TreeNodeDatum[] {
    const root = tree.at(0);
    if (!root) {
        return [];
    }

    function getNodeAncestorByIdInternal(
        node: TreeNodeDatum,
        id: string,
        path: TreeNodeDatum[],
    ): TreeNodeDatum[] {
        if (node.__rd3t.id === id) {
            return path;
        }

        if (node.children) {
            for (const child of node.children) {
                const result = getNodeAncestorByIdInternal(child, id, [
                    ...path,
                    node,
                ]);
                if (result.length > 0) {
                    return result;
                }
            }
        }

        return [];
    }

    return getNodeAncestorByIdInternal(root, id, []);
}

export const openPath = async (
    path: TreeNodeDatum[],
    handleNodeToggle: Tree['handleNodeToggle'],
) => {
    if (!path.length) {
        return;
    }

    const [currentNode, ...remainingPath] = path;

    if (currentNode.__rd3t.collapsed) {
        handleNodeToggle(currentNode.__rd3t.id);
        // Wait a bit for the animation to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await openPath(remainingPath, handleNodeToggle);
};

const getTreeNodeOptions = (
    tree: TreeNodeDatum,
    result: {
        value: string;
        label: string;
    }[] = [],
): {
    value: string;
    label: string;
}[] => {
    return [
        {
            value: tree.__rd3t.id,
            label: tree.name,
        },
        ...(tree.children ?? []).flatMap((child) =>
            getTreeNodeOptions(child, result),
        ),
    ];
};

export const getNodeOptions = (
    tree: TreeNodeDatum[],
    result: {
        value: string;
        label: string;
    }[] = [],
): {
    value: string;
    label: string;
}[] => {
    return tree
        .flatMap((node) => getTreeNodeOptions(node, result))
        .toSorted((a, b) => a.label.localeCompare(b.label));
};

export function useHierarchicalTreeController({
    orientation,
    nodeSize,
    spaceBetweenNodes,
    initialZoom,
    initialDepth,
    tree,
}: HierarchicalTreeControllerParams) {
    const parentRef = useRef<HTMLDivElement>(null);
    const treeRef = useRef<Tree>(null);

    const [nodeOptions, setNodeOptions] = useState<
        {
            value: string;
            label: string;
        }[]
    >([]);

    const [selectedNodeOption, setSelectedNodeOption] = useState<{
        value: string;
        label: string;
    } | null>(null);

    const [treeTranslate, setTreeTranslate] = useState<TreeProps['translate']>({
        x: 0,
        y: 0,
    });

    const [dimensions, setDimensions] = useState<TreeProps['dimensions']>({
        width: 0,
        height: 0,
    });

    const handleResize = useCallback(() => {
        if (!parentRef.current) {
            return;
        }

        const dimensions = parentRef.current.getBoundingClientRect();

        setDimensions({ width: dimensions.width, height: dimensions.height });

        if (orientation === 'horizontal') {
            const estimatedTreeWidth =
                initialDepth * (nodeSize.x + spaceBetweenNodes) * initialZoom;
            const horizontalOffset = estimatedTreeWidth * 0.5;

            setTreeTranslate({
                x: dimensions.width / 2 - horizontalOffset,
                y: dimensions.height / 2,
            });
        } else {
            setTreeTranslate({
                x: dimensions.width / 2,
                y: dimensions.height / 2,
            });
        }
    }, [orientation, nodeSize.x, spaceBetweenNodes, initialZoom, initialDepth]);

    useEffect(() => {
        let current: HTMLDivElement | null = null;
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        const timer = setTimeout(() => {
            if (!parentRef.current) {
                return;
            }
            handleResize();
            current = parentRef.current;
            resizeObserver.observe(current);
        }, 100);

        window.addEventListener('resize', handleResize);
        return () => {
            if (current) {
                resizeObserver.unobserve(current);
            }

            clearTimeout(timer);
        };
    }, [handleResize]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!treeRef.current) {
                return;
            }
            const options = getNodeOptions(treeRef.current.state.data);
            setNodeOptions(options);
            clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
        // recompute when tree changes
    }, [tree]);

    const selectNode = useCallback((node?: any) => {
        setSelectedNodeOption(
            node
                ? {
                      value: node?.data.__rd3t.id,
                      label: node?.data.name,
                  }
                : null,
        );
        if (!node || !treeRef.current) {
            return;
        }

        treeRef.current.centerNode(node);
    }, []);

    const selectNodeById = useCallback(
        async (nodeId?: string) => {
            if (!treeRef.current || nodeId == null) {
                return;
            }

            const ancestors = getNodeAncestorById(
                treeRef.current.state.data,
                nodeId,
            );

            await openPath(ancestors, treeRef.current.handleNodeToggle);

            const tree = treeRef.current.generateTree();

            const targetNode = tree.nodes.find(
                (node) => node.data.__rd3t.id === nodeId,
            );
            if (targetNode) {
                selectNode(targetNode);
            }
        },
        [selectNode],
    );

    const openAll = useCallback(() => {
        // We need to walk the nodes in order to open them one by one
        // This requires async execution otherwise this won't work properly
        walkNodes(treeRef.current?.state.data ?? [], (node) => {
            if (!node.__rd3t.collapsed) {
                return;
            }

            treeRef.current!.handleNodeToggle(node.__rd3t.id);
        });
    }, []);

    const closeAll = useCallback(() => {
        // We need to walk the nodes in order to close them
        // This requires async execution otherwise this won't work properly
        walkNodes(treeRef.current?.state.data ?? [], (node) => {
            if (node.__rd3t.collapsed || node.attributes?.hasParent === true) {
                return;
            }

            treeRef.current!.handleNodeToggle(node.__rd3t.id);
        });
    }, []);

    const resetZoom = useCallback(() => {
        selectNodeById(
            selectedNodeOption
                ? selectedNodeOption.value
                : treeRef.current?.state.data.at(0)?.__rd3t.id,
        );
    }, [selectNodeById, selectedNodeOption]);

    return useMemo(
        () => ({
            parentRef,
            treeRef,
            dimensions,
            treeTranslate,
            selectNode,
            openAll,
            closeAll,
            resetZoom,
            selectedNodeOption,
            selectNodeById,
            nodeOptions,
        }),
        [
            dimensions,
            treeTranslate,
            selectNode,
            openAll,
            closeAll,
            resetZoom,
            selectedNodeOption,
            selectNodeById,
            nodeOptions,
        ],
    );
}

export type HierarchicalTreeControllerParams = {
    orientation: 'vertical' | 'horizontal';
    nodeSize: { x: number; y: number };
    spaceBetweenNodes: number;
    initialZoom: number;
    initialDepth: number;
    tree: unknown;
};
