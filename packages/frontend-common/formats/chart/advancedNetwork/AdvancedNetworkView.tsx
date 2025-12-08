import type { Field } from '../../../fields/types';
import {
    useFormatAdvancedNetworkData,
    type AdvancedNetworkData,
} from './useFormatAdvancedNetworkData';
import { compose } from 'recompose';
import injectData from '../../injectData';
import { NetworkBase } from '../network/NetworkBase';

interface NetworkProps {
    colorSet?: string[];
    formatData?: AdvancedNetworkData[];
    field: Field;
}

const AdvancedNetwork = ({ formatData, colorSet, field }: NetworkProps) => {
    const {
        zoomAdjustNodeSize,
        minRadius,
        maxRadius,
    }: {
        zoomAdjustNodeSize?: boolean;
        minRadius?: number;
        maxRadius?: number;
    } = field?.format?.args ?? {};
    const { nodes, links } = useFormatAdvancedNetworkData({
        formatData,
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
        minRadius,
        maxRadius,
    });

    const fieldToFilter =
        typeof field.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
            : null;

    const secondFieldToFilter =
        typeof field.format?.args?.secondFieldToFilter === 'string'
            ? field.format.args.secondFieldToFilter
            : null;
    return (
        <NetworkBase
            colorSet={colorSet}
            nodes={nodes}
            links={links}
            forcePosition
            linkCurvature={0.25}
            highlightMode="outgoing"
            fieldToFilter={fieldToFilter}
            secondFieldToFilter={secondFieldToFilter}
            zoomAdjustNodeSize={zoomAdjustNodeSize}
        />
    );
};

export default compose<NetworkProps, NetworkProps>(injectData())(
    AdvancedNetwork,
);
