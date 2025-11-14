import { scaleLinear } from 'd3-scale';
import { get } from 'lodash';
import { useMemo } from 'react';
import type {
    ForceGraphProps,
    LinkObject,
    NodeObject,
} from 'react-force-graph-2d';

export function useFormatNetworkData({
    formatData,
    displayWeighted = true,
}: UseFormatNetworkDataParams) {
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
            (acc, { source, target }) => ({
                ...acc,
                [source]: {
                    id: source,
                    label: source,
                    radius: get(acc, [source, 'radius'], 0) + 1,
                },
                [target]: {
                    id: target,
                    label: target,
                    radius: get(acc, [target, 'radius'], 0) + 1,
                },
            }),
            {},
        );

        const nodes = Object.values(nodesDic);
        const radiusList = nodes.map(({ radius }) => radius);
        const max = Math.max(...radiusList);
        const min = Math.min(...radiusList);

        const nodeScale = scaleLinear().domain([min, max]).range([10, 100]);

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
                value: displayWeighted ? linkScale(weight) : 10,
            }),
        );

        links.forEach((link) => {
            const a = nodes.find((node) => node.id === link.source);
            const b = nodes.find((node) => node.id === link.target);
            if (!a || !b) {
                console.warn('Node not found for link', link);
                return;
            }

            if (!a.neighbors) {
                a.neighbors = [];
            }

            if (!b.neighbors) {
                b.neighbors = [];
            }

            a.neighbors.push(b);
            b.neighbors.push(a);

            if (!a.links) {
                a.links = [];
            }

            if (!b.links) {
                b.links = [];
            }
            a.links.push(link);
            b.links.push(link);
        });

        return {
            nodes: nodes.map((node) => ({
                ...node,
                radius: displayWeighted ? nodeScale(node.radius) : 1,
            })),
            links,
        };
    }, [formatData, displayWeighted]);
}

export type NetworkData = {
    source: string;
    target: string;
    weight: number;
};

export type UseFormatNetworkDataParams = {
    formatData?: NetworkData[];
    displayWeighted: boolean;
};

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
