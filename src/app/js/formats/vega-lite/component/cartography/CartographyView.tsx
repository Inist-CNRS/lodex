import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { clamp } from 'lodash';
import { schemeOrRd } from 'd3-scale-chromatic';

import { CustomActionVegaLite } from '../../../utils/components/vega-lite-component';
import {
    convertSpecTemplate,
    MAP_FRANCE,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../../utils/chartsUtils';
import injectData from '../../../injectData';
import Cartography from '../../models/Cartography';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import type { Field } from '@lodex/frontend-common/fields/types';

const styles = {
    container: {
        userSelect: 'none',
    },
};

interface CartographyViewProps {
    field?: Field;
    resource?: object;
    data?: {
        values: any;
    };
    tooltip?: boolean;
    tooltipCategory?: string;
    tooltipValue?: string;
    colorScheme?: string[];
    worldPosition?: string;
    advancedMode?: boolean;
    advancedModeSpec?: string;
    aspectRatio?: string;
}

const CartographyView = ({
    advancedMode,

    advancedModeSpec,

    field,

    data,

    tooltip,

    tooltipCategory,

    tooltipValue,

    worldPosition,

    colorScheme,

    aspectRatio,
}: CartographyViewProps) => {
    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    clamp((width - VEGA_ACTIONS_WIDTH) * 0.6, 300, 1200),
                );
            } catch (e) {
                // @ts-expect-error TS18046
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new Cartography();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setWorldPosition(worldPosition);
        specBuilder.setColor(
            colorScheme !== undefined ? colorScheme.join(' ') : schemeOrRd[9],
        );

        // @ts-expect-error TS2554
        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        field,
        tooltip,
        tooltipCategory,
        tooltipValue,
        worldPosition,
        colorScheme,
    ]);

    if (!spec) {
        // @ts-expect-error TS18046
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        // @ts-expect-error TS2322
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
                // @ts-expect-error TS2322
                spec={spec}
                data={data}
                injectType={
                    worldPosition === MAP_FRANCE
                        ? VEGA_LITE_DATA_INJECT_TYPE_C
                        : VEGA_LITE_DATA_INJECT_TYPE_B
                }
                aspectRatio={aspectRatio}
            />
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { formatData }) => {
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

export const CartographyAdminView = connect((_state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            // @ts-expect-error TS2339
            values: props.dataset.values ?? [],
        },
    };
    // @ts-expect-error TS2345
})(CartographyView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(CartographyView);
