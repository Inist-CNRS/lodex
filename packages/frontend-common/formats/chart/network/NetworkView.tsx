import { compose } from 'recompose';
import type { Field } from '../../../fields/types';
import injectData from '../../injectData';
import { NetworkBase } from './NetworkBase';
import { useColorOverrides, type ColorScaleItem } from './useColorOverrides';
import { useFormatNetworkData, type NetworkData } from './useFormatNetworkData';

interface NetworkProps {
    colorSet?: string[];
    formatData?: NetworkData[];
    field: Field<{
        isAdvancedColorMode?: boolean;
        colorScale?: ColorScaleItem[];
        captionTitle?: string;
        displayWeighted?: boolean;
        displayDifferentShape?: boolean;
        fieldToFilter?: string;
        secondFieldToFilter?: string;
        zoomAdjustNodeSize?: boolean;
        minRadius?: number;
        maxRadius?: number;
    }>;
}

const Network = ({ formatData, colorSet, field }: NetworkProps) => {
    const { zoomAdjustNodeSize, minRadius, maxRadius } =
        field?.format?.args ?? {};

    const fieldToFilter =
        typeof field.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
            : null;

    const secondFieldToFilter =
        typeof field.format?.args?.secondFieldToFilter === 'string'
            ? field.format.args.secondFieldToFilter
            : null;

    const { colorOverrides, captions } = useColorOverrides(
        field?.format?.args?.isAdvancedColorMode,
        field?.format?.args?.colorScale,
        colorSet?.at(0),
    );

    const { nodes, links } = useFormatNetworkData({
        formatData,
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
        minRadius,
        maxRadius,
        colorOverrides,
    });

    return (
        <NetworkBase
            colorSet={colorSet}
            nodes={nodes}
            links={links}
            fieldToFilter={fieldToFilter}
            secondFieldToFilter={secondFieldToFilter}
            zoomAdjustNodeSize={zoomAdjustNodeSize}
            captions={captions}
            captionTitle={field.format?.args?.captionTitle}
            displayDifferentShape={field?.format?.args?.displayDifferentShape}
        />
    );
};

// @ts-expect-error TS2345
export default compose(injectData(null, null, true))(Network);
