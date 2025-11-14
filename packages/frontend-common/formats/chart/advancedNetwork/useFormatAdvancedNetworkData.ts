import { useMemo } from 'react';
import type {
    ForceGraphProps,
    LinkObject,
    NodeObject,
} from 'react-force-graph-2d';

export type AdvancedNetworkData = {
    id: string;
    value: {
        label: string;
        viz$color: {
            r: string;
            g: string;
            b: string;
            a: string;
        };
        viz$size: {
            value: string;
        };
        viz$position: {
            x: string;
            y: string;
            z: string;
        };
        targets: {
            id: string;
        }[];
    };

    attributes: {
        alpha: string;
        zorder: string;
    };
};

export type UseFormatNetworkDataParams = {
    formatData?: AdvancedNetworkData[];
    displayWeighted: boolean;
};

export function useFormatAdvancedNetworkData({
    formatData,
    displayWeighted,
}: UseFormatNetworkDataParams): {
    nodes: Node[];
    links: Link[];
} {
    return useMemo(() => {
        if (!formatData) {
            return {
                nodes: [],
                links: [],
            };
        }

        const nodesDic = formatData.reduce<
            Record<
                string,
                Node & {
                    targets: AdvancedNetworkData['value']['targets'];
                }
            >
        >(
            (
                acc,
                {
                    id,
                    value: {
                        label,
                        targets,
                        viz$position,
                        viz$color,
                        viz$size,
                    },
                },
            ) => ({
                ...acc,
                [id]: {
                    id,
                    label,
                    radius:
                        viz$size.value && displayWeighted
                            ? parseFloat(viz$size.value) * 1000
                            : 100,
                    targets,
                    x: viz$position.x
                        ? parseFloat(viz$position.x) * 1000
                        : undefined,
                    y: viz$position.y
                        ? parseFloat(viz$position.y) * 1000
                        : undefined,
                    z: viz$position.z
                        ? parseFloat(viz$position.z) * 1000
                        : undefined,
                    color: viz$color
                        ? {
                              r: parseInt(viz$color.r, 10),
                              g: parseInt(viz$color.g, 10),
                              b: parseInt(viz$color.b, 10),
                          }
                        : undefined,
                },
            }),
            {},
        );

        const nodes = Object.values(nodesDic).map(({ targets, ...node }) => ({
            ...node,
            radius: node.radius / 2,
            color: node.color,
            neighbors: targets
                ? targets.map(({ id: targetId }) => nodesDic[targetId])
                : [],
            links: targets
                ? targets.map(({ id: targetId }) => ({
                      source: node.id,
                      target: targetId,
                      value: 1,
                      color: node.color,
                  }))
                : [],
        }));

        const links = nodes.flatMap<Link>(({ links }) => links);

        return {
            nodes: nodes.map((node) => ({
                ...node,
                radius: node.radius,
            })),
            links,
        };
    }, [displayWeighted, formatData]);
}

export type UseFormatNetworkDataReturn = ForceGraphProps['graphData'];

export type NodeType = {
    neighbors?: Node[];
    links?: Link[];
    radius: number;
};

export type LinkType = {
    value: number;
};

export type Node = NodeObject<NodeType>;
export type Link = LinkObject<NodeType, LinkType>;
