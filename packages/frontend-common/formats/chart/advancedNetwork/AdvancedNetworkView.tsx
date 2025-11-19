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
    const { nodes, links } = useFormatAdvancedNetworkData({
        formatData,
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
