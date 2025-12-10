import { scaleLinear } from 'd3-scale';
import { get } from 'lodash';
import { useMemo } from 'react';
import type {
    ForceGraphProps,
    LinkObject,
    NodeObject,
} from 'react-force-graph-2d';

export type NodeType = {
    id: string;
    label: string;
    radius: number;
    color?: string;
};

export type LinkType = {
    value: number;
};

export type Node = NodeObject<NodeType>;
export type Link = LinkObject<NodeType, LinkType>;

export type NetworkData = {
    source: string;
    source_title?: string;
    target: string;
    target_title?: string;
    weight: number;
};

export type UseFormatNetworkDataParams = {
    formatData?: NetworkData[];
    displayWeighted: boolean;
    minRadius?: number;
    maxRadius?: number;
    colorOverrides: (content: string) => string;
};

export function useFormatNetworkData({
    formatData,
    displayWeighted = true,
    minRadius = 1,
    maxRadius = 20,
    colorOverrides,
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
        const sanitizedFormatData = formatData.filter(
            ({ source, target }) => source && target,
        );

        const nodesDic = sanitizedFormatData.reduce<Record<string, Node>>(
            (acc, { source, source_title, target, target_title }) => ({
                ...acc,
                [source]: {
                    id: source,
                    label: source_title ?? source,
                    radius: get(acc, [source, 'radius'], 0) + 1,
                    isLeaf: false,
                },
                [target]: {
                    id: target,
                    label: target_title ?? target,
                    radius: get(acc, [target, 'radius'], 0) + 1,
                    isLeaf: acc['source'] ? false : true,
                },
            }),
            {},
        );

        const nodes = Object.values(nodesDic);
        const radiusList = nodes.map(({ radius }) => radius);
        const max = Math.max(...radiusList);
        const min = Math.min(...radiusList);

        const nodeScale = scaleLinear()
            .domain([min, max])
            .range([minRadius, maxRadius]);

        const weightList = sanitizedFormatData.map(({ weight }) => weight);

        const maxWeight = Math.max(...weightList);
        const minWeight = Math.min(...weightList);

        const linkScale = scaleLinear()
            .domain([minWeight, maxWeight])
            .range([1, 20]);

        const links = sanitizedFormatData.map<Link>(
            ({ source, target, weight }) => ({
                source,
                target,
                value: displayWeighted ? linkScale(weight) : 1,
                label: weight,
            }),
        );

        return {
            nodes: nodes.map((node) => ({
                ...node,
                radius: displayWeighted ? nodeScale(node.radius) : 1,
                color: colorOverrides(node.id) ?? undefined,
            })),
            links,
        };
    }, [formatData, minRadius, maxRadius, displayWeighted, colorOverrides]);
}

export type UseFormatNetworkDataReturn = ForceGraphProps['graphData'];
