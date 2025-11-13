import { scaleLinear } from 'd3-scale';
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

export function useFormatNetworkData({
    formatData,
    displayWeighted = true,
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
            (acc, { id, value: { label, targets } }) => ({
                ...acc,
                [id]: {
                    id,
                    label,
                    radius: targets?.length + 1 || 1,
                    targets,
                },
            }),
            {},
        );

        const nodes = Object.values(nodesDic).map(({ targets, ...node }) => ({
            ...node,
            neighbors: targets
                ? targets.map(({ id: targetId }) => nodesDic[targetId])
                : [],
            links: targets
                ? targets.map(({ id: targetId }) => ({
                      source: node.id,
                      target: targetId,
                      value: 1,
                  }))
                : [],
        }));

        const radiusList = nodes.map(({ radius }) => radius);
        const max = Math.max(...radiusList);
        const min = Math.min(...radiusList);

        const nodeScale = scaleLinear().domain([min, max]).range([1, 10]);

        const links = nodes.flatMap<Link>(({ links }) => links);

        return {
            nodes: nodes.map((node) => ({
                ...node,
                radius: displayWeighted ? nodeScale(node.radius) : 1,
            })),
            links,
        };
    }, [formatData, displayWeighted]);
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
