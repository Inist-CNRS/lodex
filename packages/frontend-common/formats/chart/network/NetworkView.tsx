import type { Field } from '../../../fields/types';
import { useFormatNetworkData, type NetworkData } from './useFormatNetworkData';
import { compose } from 'recompose';
import injectData from '../../injectData';
import { NetworkBase } from './NetworkBase';

interface NetworkProps {
    colorSet?: string[];
    formatData?: NetworkData[];
    field: Field;
}

const Network = ({ formatData, colorSet, field }: NetworkProps) => {
    const { nodes, links } = useFormatNetworkData({
        formatData,
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
    });

    return <NetworkBase colorSet={colorSet} nodes={nodes} links={links} />;
};

// @ts-expect-error TS2345
export default compose(injectData())(Network);
