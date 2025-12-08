import { useMemo } from 'react';
import type { RawNodeDatum } from 'react-d3-tree';
import { useTranslate } from '../../../i18n/I18NContext';
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

export function useFormatTreeData({ rootName, data }: UseFormatTreeDataParams) {
    const { translate } = useTranslate();
    return useMemo(() => {
        const map = new Map<string, RawNodeDatum>();

        const { minWeight = 1, maxWeight = 1 } = data.length
            ? data.reduce(
                  (acc, datum) => {
                      const weight = datum.weight ?? 1;
                      return {
                          minWeight: Math.min(acc.minWeight ?? weight, weight),
                          maxWeight: Math.max(acc.maxWeight ?? weight, weight),
                      };
                  },
                  { minWeight: undefined, maxWeight: undefined } as {
                      minWeight: number | undefined;
                      maxWeight: number | undefined;
                  },
              )
            : { minWeight: 1, maxWeight: 1 };

        function createNode(
            name: string,
            weight: number | undefined,
            hasParent: boolean,
        ): RawNodeDatum {
            return {
                name,
                children: [],
                attributes: {
                    hasParent,
                    weight: weight ?? 1,
                    weightPercent:
                        maxWeight !== minWeight
                            ? ((weight ?? 1) - minWeight) /
                              (maxWeight - minWeight)
                            : 100,
                },
            };
        }

        for (const datum of data) {
            if (!map.has(datum.source)) {
                map.set(
                    datum.source,
                    createNode(datum.source, datum.weight, false),
                );
            }

            if (!map.has(datum.target)) {
                map.set(
                    datum.target,
                    createNode(datum.target, datum.weight, true),
                );
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

        // We need to have a fake root node to accommodate multiple roots in the data
        return {
            name: rootName ?? translate('root'),
            children: Array.from(map.values()).filter(
                (node) => node.attributes!.hasParent === false,
            ),
        };
    }, [translate, rootName, data]);
}

export type UseFormatTreeDataParams = {
    rootName?: string;
    data: Datum[];
};

export type UseFormatTreeDataResult = {
    tree: RawNodeDatum[];
};
