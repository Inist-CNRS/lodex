import { useMemo } from 'react';
import type { ForceGraphProps } from 'react-force-graph-2d';
import type { Link, Node } from '../network/useFormatNetworkData';
import { rgbToHex } from '../../utils/colorHelpers';
import { scaleLinear } from 'd3-scale';

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
        viz$position?: {
            x: string;
            y: string;
            z: string;
        };
        targets?: {
            id: string;
        }[];
    };

    attributes: {
        alpha?: string;
        zorder?: string;
        count?: string;
        status?: string;
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

        const fullNodes = formatData.map<
            Node & {
                targets: AdvancedNetworkData['value']['targets'];
            }
        >(
            ({
                id,
                value: {
                    label,
                    targets,
                    viz$position,
                    viz$color,
                    viz$size = {},
                },
            }) => ({
                id,
                label,
                radius:
                    viz$size.value && displayWeighted
                        ? parseFloat(viz$size.value)
                        : 100,
                targets,
                x: viz$position?.x ? parseFloat(viz$position.x) : undefined,
                y: viz$position?.y ? parseFloat(viz$position.y) : undefined,
                z: viz$position?.z ? parseFloat(viz$position.z) : undefined,
                color: viz$color
                    ? rgbToHex({
                          r: parseInt(viz$color.r, 10),
                          g: parseInt(viz$color.g, 10),
                          b: parseInt(viz$color.b, 10),
                      })
                    : undefined,
            }),
        );
        const maxRadius = Math.max(
            ...fullNodes.map((node) => node.radius ?? 0),
        );
        const minRadius = Math.min(
            ...fullNodes.map((node) => node.radius ?? 0),
        );

        const scaleRadius = scaleLinear()
            .domain([minRadius, maxRadius])
            .range([1, 20]);

        const maxX = Math.max(
            ...fullNodes.map((node) => (node.x !== undefined ? node.x : 0)),
        );
        const minX = Math.min(
            ...fullNodes.map((node) => (node.x !== undefined ? node.x : 0)),
        );
        const maxY = Math.max(
            ...fullNodes.map((node) => (node.y !== undefined ? node.y : 0)),
        );
        const minY = Math.min(
            ...fullNodes.map((node) => (node.y !== undefined ? node.y : 0)),
        );

        const scalePositionX = scaleLinear()
            .domain([minX, maxX])
            .range([-900, 900]);
        const scalePositionY = scaleLinear()
            .domain([minY, maxY])
            .range([-500, 500]);

        const nodes = fullNodes.map(
            ({ targets, radius, x, y, z, ...node }) => ({
                ...node,
                radius: scaleRadius(radius),
                x: x !== undefined ? scalePositionX(x) : undefined,
                y: y !== undefined ? scalePositionY(y) : undefined,
                z,
                color: node.color,
            }),
        );

        const nodesById = nodes.reduce<Record<string, Node>>((acc, node) => {
            acc[node.id] = node;
            return acc;
        }, {});

        const links = fullNodes.flatMap(({ id: sourceId, targets, color }) =>
            targets
                ? targets
                      .map(({ id: targetId }) => ({
                          source: sourceId,
                          target: targetId,
                          value: 1,
                          color,
                      }))
                      // remove orphan link when retrieving only a subset of nodes
                      .filter((link) => nodesById[link.target] !== undefined)
                : [],
        );

        return {
            nodes,
            links,
        };
    }, [displayWeighted, formatData]);
}

export type UseFormatNetworkDataReturn = ForceGraphProps['graphData'];
