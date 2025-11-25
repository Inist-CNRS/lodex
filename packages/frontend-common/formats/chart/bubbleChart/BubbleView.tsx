import { connect } from 'react-redux';
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import { pack, hierarchy } from 'd3-hierarchy';
import memoize from 'lodash/memoize';

import injectData from '../../injectData';
import Bubble from './Bubble';
import { getColor } from '../../utils/colorUtils';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import type { Field } from '../../../fields/types';
import { useCallback, useContext } from 'react';
import { SearchPaneContext } from '../../../search/SearchPaneContext';

const styles: {
    container: (args: { diameter: number | string }) => React.CSSProperties;
} = {
    container: memoize(({ diameter }) => ({
        position: 'relative',
        width: diameter,
        height: diameter,
        overflow: 'hidden',
    })),
};

interface BubbleViewProps {
    data: {
        data: { _id: string };
        r: number;
        x: number;
        y: number;
        value: number;
    }[];
    diameter: number | string;
    colorSet?: string[];
    field?: Field;
}

export const BubbleView = ({
    data,
    diameter,
    colorSet,
    field,
}: BubbleViewProps) => {
    const fieldToFilter =
        typeof field?.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
            : null;

    const { setFilter, filter } = useContext(SearchPaneContext) ?? {
        setFilter: () => {},
    };

    const handleClick = useCallback(
        (name: string) => {
            if (fieldToFilter) {
                setFilter({
                    field: fieldToFilter,
                    value: name !== filter?.value ? name ?? null : null,
                });
            }
        },
        [fieldToFilter, setFilter, filter?.value],
    );

    return (
        <FormatFullScreenMode>
            <div style={styles.container({ diameter })}>
                {data.map(({ data: { _id: key }, r, x, y, value }, index) => (
                    <Bubble
                        key={key}
                        r={r}
                        x={x}
                        y={y}
                        name={key}
                        value={value}
                        color={getColor(colorSet, index)}
                        onClick={fieldToFilter ? handleClick : undefined}
                        isSelected={key === filter?.value}
                    />
                ))}
            </div>
        </FormatFullScreenMode>
    );
};

BubbleView.displayName = 'BubbleView';

const mapStateToProps = (
    _: unknown,
    {
        formatData,
        diameter: stringDiameter,
    }: {
        formatData: Array<{ _id: string; value: number }>;
        diameter: string;
    },
) => {
    const diameter = parseInt(stringDiameter, 10);
    if (!formatData) {
        return {
            data: [],
            diameter,
        };
    }

    const packingFunction = pack().size([diameter, diameter]).padding(5);

    const root = hierarchy({ name: 'root', children: formatData })
        .sum((d: { value: number }) => d.value)
        .sort(
            (
                a: {
                    value: number;
                },
                b: {
                    value: number;
                },
            ) => b.value - a.value,
        );
    const data = packingFunction(root).leaves();

    return {
        data,
        diameter,
    };
};

export default compose<
    BubbleViewProps,
    Omit<BubbleViewProps, 'data' | 'diameter'>
>(
    injectData(),
    connect(mapStateToProps),
)(BubbleView);
