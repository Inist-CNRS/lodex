import type { Field } from '../../../fields/types';
import { NetworkBase } from '../network/NetworkBase';
import {
    useFormatAdvancedNetworkData,
    type AdvancedNetworkData,
} from '../advancedNetwork/useFormatAdvancedNetworkData';
import jsonFormatData from './topRefExtract.json';

interface DirectedNetworkProps {
    colorSet?: string[];
    formatData?: AdvancedNetworkData[];
    field: Field;
}

const DirectedNetwork = ({
    formatData: _,
    colorSet,
    field,
}: DirectedNetworkProps) => {
    // @TODO replace with data from props when routine available available
    const { nodes, links } = useFormatAdvancedNetworkData({
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
            linkCurvature={0.25}
            showArrows
        />
    );
};

export default DirectedNetwork;

// export default compose<DirectedNetworkProps, DirectedNetworkProps>(
//     injectData(),
// )(DirectedNetwork);
