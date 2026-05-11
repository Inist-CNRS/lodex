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
        maxRadius,
        minRadius,
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
            linkCurvature={0.25}
            showArrows
            fieldToFilter={fieldToFilter}
            secondFieldToFilter={secondFieldToFilter}
            zoomAdjustNodeSize={zoomAdjustNodeSize}
        />
    );
};

export default compose<DirectedNetworkProps, DirectedNetworkProps>(
    injectData(),
)(DirectedNetwork);
