import { compose } from 'recompose';
import type { Field } from '../../../fields/types';
import injectData from '../../injectData';
import {
    useFormatNetworkData,
    type NetworkData,
} from '../network/useFormatNetworkData';
import { Network3DBase } from './Network3DBase';

interface NetworkProps {
    colorSet?: string[];
    formatData?: NetworkData[];
    field: Field;
}

const Network3D = ({ formatData, colorSet, field }: NetworkProps) => {
    const {
        minRadius,
        maxRadius,
    }: {
        zoomAdjustNodeSize?: boolean;
        minRadius?: number;
        maxRadius?: number;
    } = field?.format?.args ?? {};
    const { nodes, links } = useFormatNetworkData({
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

    return (
        <Network3DBase
            colorSet={colorSet}
            nodes={nodes}
            links={links}
            fieldToFilter={fieldToFilter}
        />
    );
};

// @ts-expect-error TS2345
export default compose(injectData())(Network3D);
