import { compose } from 'recompose';
import type { Field } from '../../../fields/types';
import injectData from '../../injectData';
import { NetworkBase } from '../network/NetworkBase';
import jsonFormatData from './dataGraphGexf.json';
import {
    useFormatAdvancedNetworkData,
    type AdvancedNetworkData,
} from './useFormatAdvancedNetworkData';

interface NetworkProps {
    colorSet?: string[];
    formatData?: AdvancedNetworkData[];
    field: Field;
}

const AdvancedNetwork = ({ formatData: _, colorSet, field }: NetworkProps) => {
    const { nodes, links } = useFormatAdvancedNetworkData({
        // @TODO replace with real formatData when available
        formatData: jsonFormatData as AdvancedNetworkData[],
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
    });

    const fieldToFilter =
        typeof field.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
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
        />
    );
};

export default compose<NetworkProps, NetworkProps>(injectData())(
    AdvancedNetwork,
);
