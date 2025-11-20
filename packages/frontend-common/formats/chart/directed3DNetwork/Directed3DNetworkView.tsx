import type { Field } from '../../../fields/types';
import {
    useFormatAdvancedNetworkData,
    type AdvancedNetworkData,
} from '../advancedNetwork/useFormatAdvancedNetworkData';
import { compose } from 'recompose';
import injectData from '../../injectData';
import { Network3DBase } from '../network3D/Network3DBase';

interface Directed3DNetworkProps {
    colorSet?: string[];
    formatData?: AdvancedNetworkData[];
    field: Field;
}

const Directed3DNetwork = ({
    formatData,
    colorSet,
    field,
}: Directed3DNetworkProps) => {
    const { nodes, links } = useFormatAdvancedNetworkData({
        formatData,
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
        minRadius: 5,
    });

    const fieldToFilter =
        typeof field.format?.args?.fieldToFilter === 'string'
            ? field.format.args.fieldToFilter
            : null;
    return (
        <Network3DBase
            colorSet={colorSet}
            nodes={nodes}
            links={links}
            linkCurvature={0.25}
            showArrows
            fieldToFilter={fieldToFilter}
        />
    );
};

export default compose<Directed3DNetworkProps, Directed3DNetworkProps>(
    injectData(),
)(Directed3DNetwork);
