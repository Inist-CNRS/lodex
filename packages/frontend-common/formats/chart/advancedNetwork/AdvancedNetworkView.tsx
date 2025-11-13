import compose from 'recompose/compose';

import type { Field } from '../../../fields/types';
import injectData from '../../injectData';
import {
    useFormatNetworkData,
    type AdvancedNetworkData,
} from './useFormatAdvancedNetworkData';
import { NetworkBase } from '../network/NetworkView';
import jsonFormatData from './dataGraphGexf.json';

interface NetworkProps {
    colorSet?: string[];
    formatData?: AdvancedNetworkData[];
    field: Field;
}

const Network = ({ formatData: _, colorSet, field }: NetworkProps) => {
    const { nodes, links } = useFormatNetworkData({
        // @TODO replace with real formatData when available
        formatData: jsonFormatData as AdvancedNetworkData[],
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
    });

    return <NetworkBase colorSet={colorSet} nodes={nodes} links={links} />;
};

// @ts-expect-error TS2345
export default compose(injectData())(Network);
