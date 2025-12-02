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

function bindAttributes(
    datum: Datum,
    node: RawNodeDatum,
    kind: 'source' | 'target',
) {
    for (const key of ALLOWED_ATTRIBUTE_KEYS) {
        const datumKey = `${kind}_${key}` as keyof Datum;
        if (
            typeof datum[datumKey] === 'string' ||
            typeof datum[datumKey] === 'number'
        ) {
            node.attributes = node.attributes || {};
            node.attributes![key] = datum[datumKey];
        }
    }
}

export function useFormatTreeData({ data }: UseFormatTreeDataParams) {
    const tree = useMemo(() => {
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

            bindAttributes(datum, sourceNode, 'source');
            bindAttributes(datum, targetNode, 'target');
            targetNode.attributes!.hasParent = true;

            sourceNode.children!.push(targetNode);
        }

        return Array.from(map.values()).filter(
            (node) => node.attributes!.hasParent === false,
        );
    }, [data]);

    return useMemo<UseFormatTreeDataResult>(
        () => ({
            tree,
        }),
        [tree],
    );
}

export type UseFormatTreeDataParams = {
    data: Datum[];
};

export type UseFormatTreeDataResult = {
    tree: RawNodeDatum[];
};
