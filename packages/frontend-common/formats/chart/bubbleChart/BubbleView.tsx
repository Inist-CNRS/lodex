import { hierarchy, pack } from 'd3-hierarchy';
import memoize from 'lodash/memoize';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { useCallback } from 'react';
import type { Field } from '../../../fields/types';
import { useSearchPaneContextOrDefault } from '../../../search/useSearchPaneContext';

import injectData from '../../injectData';
import { getColor } from '../../utils/colorUtils';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import Bubble from './Bubble';

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

    const { filters, selectOne } = useSearchPaneContextOrDefault();

    const handleClick = useCallback(
        (name: string) => {
            if (!fieldToFilter) {
                return;
            }
            selectOne({ fieldName: fieldToFilter, value: name });
        },
        [fieldToFilter, selectOne],
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
                        isSelected={key === filters?.at(0)?.value}
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

    const root = hierarchy<Datum>({
        name: 'root',
        children: formatData,
    } as Datum)
        .sum((d) => d.value)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
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

type Datum = {
    _id: string;
    name?: string;
    value: number;
    children?: Datum[];
};
