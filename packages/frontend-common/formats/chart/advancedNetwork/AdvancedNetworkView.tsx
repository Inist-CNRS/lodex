import type { Field } from '../../../fields/types';
import {
    useFormatAdvancedNetworkData,
    type AdvancedNetworkData,
} from './useFormatAdvancedNetworkData';
import { NetworkBase } from '../network/NetworkView';
import jsonFormatData from './dataGraphGexf.json';

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

    return (
        <NetworkBase
            colorSet={colorSet}
            nodes={nodes}
            links={links}
            forcePosition
            linkCurvature={0.25}
            directed
        />
    );
};

// export default compose(injectData())(AdvancedNetwork);

export default AdvancedNetwork;
