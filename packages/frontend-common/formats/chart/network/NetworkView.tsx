import { compose } from 'recompose';
import type { Field } from '../../../fields/types';
import injectData from '../../injectData';
import { NetworkBase } from './NetworkBase';
import { useFormatNetworkData, type NetworkData } from './useFormatNetworkData';

interface NetworkProps {
    colorSet?: string[];
    formatData?: NetworkData[];
    field: Field;
}

const Network = ({ formatData, colorSet, field }: NetworkProps) => {
    const {
        zoomAdjustNodeSize,
        minRadius,
        maxRadius,
    }: {
        zoomAdjustNodeSize?: boolean;
        minRadius?: number;
        maxRadius?: number;
    } = field?.format?.args ?? {};

    const fieldToFilter =
        typeof field.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
            : null;

    const { nodes, links } = useFormatNetworkData({
        formatData,
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
        minRadius,
        maxRadius,
    });

    return (
        <NetworkBase
            colorSet={colorSet}
            nodes={nodes}
            links={links}
            fieldToFilter={fieldToFilter}
            zoomAdjustNodeSize={zoomAdjustNodeSize}
        />
    );
};

// @ts-expect-error TS2345
export default compose(injectData())(Network);
