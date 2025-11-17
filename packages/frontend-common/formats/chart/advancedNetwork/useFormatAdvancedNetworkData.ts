import { useMemo } from 'react';
import type { ForceGraphProps } from 'react-force-graph-2d';
import type { Link, Node } from '../network/useFormatNetworkData';
import { rgbToHex } from '../../utils/colorHelpers';

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

        const fullNodes = formatData.map<
            Node & {
                targets: AdvancedNetworkData['value']['targets'];
            }
        >(
            ({
                id,
                value: { label, targets, viz$position, viz$color, viz$size },
            }) => ({
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
                    ? rgbToHex({
                          r: parseInt(viz$color.r, 10),
                          g: parseInt(viz$color.g, 10),
                          b: parseInt(viz$color.b, 10),
                      })
                    : undefined,
            }),
        );

        const nodes = fullNodes.map(({ targets, ...node }) => ({
            ...node,
            radius: node.radius / 2,
            color: node.color,
        }));

        const links = fullNodes.flatMap(({ id: sourceId, targets, color }) =>
            targets
                ? targets.map(({ id: targetId }) => ({
                      source: sourceId,
                      target: targetId,
                      value: 1,
                      color,
                  }))
                : [],
        );

        return {
            nodes,
            links,
        };
    }, [displayWeighted, formatData]);
}

export type UseFormatNetworkDataReturn = ForceGraphProps['graphData'];
