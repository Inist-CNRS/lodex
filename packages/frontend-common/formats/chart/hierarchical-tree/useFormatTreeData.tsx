import { useMemo } from 'react';
import type { RawNodeDatum } from 'react-d3-tree';
import type { Datum } from './type';

const ALLOWED_ATTRIBUTE_KEYS = [
    'title',
    'description',
    'detail1',
    'detail2',
    'detail3',
] as const;

export function bindAttributes(
    datum: Datum,
    attributes: Record<string, string | number | boolean> | undefined,
    kind: 'source' | 'target',
): Record<string, string | number | boolean> {
    return ALLOWED_ATTRIBUTE_KEYS.reduce(
        (acc, key) => {
            const datumKey = `${kind}_${key}` as keyof Datum;
            const value = datum[datumKey];

            if (typeof value === 'string' || typeof value === 'number') {
                acc[key] = value;
            }

            return acc;
        },
        { ...attributes } as Record<string, string | number | boolean>,
    );
}

export function createTree(
    nodeMap: Map<string, RawNodeDatum>,
    childrenByParent: Record<string, RawNodeDatum[]>,
): RawNodeDatum[] {
    const buildNode = (nodeDatum: RawNodeDatum): RawNodeDatum => {
        const children = childrenByParent[nodeDatum.name]?.filter(
            (child) => child.name !== nodeDatum.name,
        );

        if (children && children.length > 0) {
            nodeDatum.children = children.map(buildNode);
        }

        return nodeDatum;
    };

    const hasParent = (nodeName: string): boolean =>
        Array.from(nodeMap.values()).some((datum) =>
            childrenByParent[datum.name]?.some(
                (child) => child.name === nodeName,
            ),
        );

    return Array.from(nodeMap.values())
        .filter((node) => !hasParent(node.name))
        .map(buildNode);
}

export function useFormatTreeData({ data }: UseFormatTreeDataParams) {
    return useMemo(() => {
        const map = new Map<string, RawNodeDatum>();

        for (const datum of data) {
            if (!map.has(datum.source)) {
                map.set(datum.source, {
                    name: datum.source,
                    children: [],
                    attributes: {
                        hasParent: false,
                    },
                });
            }

            if (!map.has(datum.target)) {
                map.set(datum.target, {
                    name: datum.target,
                    children: [],
                    attributes: {
                        hasParent: true,
                    },
                });
            }

            const sourceNode = map.get(datum.source)!;
            const targetNode = map.get(datum.target)!;

            sourceNode.attributes = bindAttributes(
                datum,
                sourceNode.attributes,
                'source',
            );
            targetNode.attributes = bindAttributes(
                datum,
                targetNode.attributes,
                'target',
            );
            targetNode.attributes!.hasParent = true;

            sourceNode.children!.push(targetNode);
        }

        return Array.from(map.values()).filter(
            (node) => node.attributes!.hasParent === false,
        );
    }, [data]);
}

export type UseFormatTreeDataParams = {
    data: Datum[];
};

export type UseFormatTreeDataResult = {
    tree: RawNodeDatum[];
};
