import { useMemo, useState, type CSSProperties } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { CustomActionVega } from '../../../utils/components/vega-component';
import FlowMap from '../../models/FlowMap';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_DATA_INJECT_TYPE_B,
} from '../../../utils/chartsUtils';
import { schemeBlues } from 'd3-scale-chromatic';
import MouseIcon from '../../../utils/components/MouseIcon';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import injectData from '../../../injectData';
import type { VegaData } from '../../../utils/components/vega-component/VegaComponent';
import type { AspectRatio } from '../../../utils/aspectRatio';
import type { State } from '../../../../admin/reducers';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    } as CSSProperties,
};

type FlowMapViewProps = {
    field: {
        format: string;
    };
    data: VegaData;
    tooltip: boolean;
    tooltipCategory: string;
    tooltipValue: string;
    color: string;
    colorScheme: string[];
    advancedMode?: boolean;
    advancedModeSpec?: string | null;
    aspectRatio?: AspectRatio;
};

const FlowMapView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    tooltip,
    tooltipCategory,
    tooltipValue,
    color,
    colorScheme,
    aspectRatio,
}: FlowMapViewProps) => {
    const { ref, width } = useSizeObserver();
    const [error, setError] = useState<string>('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    width * 0.6,
                );
            } catch (e) {
                setError((e as Error).message);
                return null;
            }
        }

        const specBuilder = new FlowMap();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(color ? color.split(' ')[0] : null);
        specBuilder.setColorScheme(
            colorScheme !== undefined ? colorScheme : schemeBlues[9],
        );

        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipCategory,
        tooltipValue,
        color,
        colorScheme,
    ]);

    if (spec === null) {
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        <div style={styles.container} ref={ref}>
            <CustomActionVega
                spec={spec}
                data={data}
                injectType={VEGA_DATA_INJECT_TYPE_B}
                aspectRatio={aspectRatio}
            />
            <MouseIcon />
        </div>
    );
};

const mapStateToProps = (
    _state: State,
    {
        formatData,
    }: {
        formatData: unknown;
    },
) => {
    if (!formatData) {
        return {
            data: {
                values: [],
            },
        };
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export const FlowMapAdminView = connect((_state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            // @ts-expect-error TS2399
            values: props.dataset.values ?? [],
        },
    };
})(FlowMapView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(FlowMapView);
