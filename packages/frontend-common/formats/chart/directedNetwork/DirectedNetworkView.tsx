import type { Field } from '../../../fields/types';
import {
    useFormatAdvancedNetworkData,
    type AdvancedNetworkData,
} from '../advancedNetwork/useFormatAdvancedNetworkData';
import { NetworkBase } from '../network/NetworkBase';
import { compose } from 'recompose';
import injectData from '../../injectData';

interface DirectedNetworkProps {
    colorSet?: string[];
    formatData?: AdvancedNetworkData[];
    field: Field;
}

const DirectedNetwork = ({
    formatData,
    colorSet,
    field,
}: DirectedNetworkProps) => {
    // @TODO replace with data from props when routine available available
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
            linkCurvature={0.25}
            showArrows
            fieldToFilter={fieldToFilter}
        />
    );
};

export default compose<DirectedNetworkProps, DirectedNetworkProps>(
    injectData(),
)(DirectedNetwork);
