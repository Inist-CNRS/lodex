import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { CustomActionVega } from '../../../utils/components/vega-component';
import RadarChart from '../../models/RadarChart';
import {
    convertSpecTemplate,
    lodexScaleToIdScale,
    VEGA_ACTIONS_WIDTH,
    VEGA_DATA_INJECT_TYPE_A,
} from '../../../utils/chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../utils/chartsHooks';
import injectData from '../../../injectData';
import type { Field } from '@lodex/frontend-common/fields/types';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

interface RadarChartViewProps {
    field: Field;
    resource: object;
    data?: any;
    colors: string;
    tooltip: boolean;
    tooltipCategory: string;
    tooltipValue: string;
    scale: string;
    advancedMode?: boolean;
    advancedModeSpec?: string;
    aspectRatio?: string;
}

const RadarChartView = ({
    advancedMode,

    advancedModeSpec,

    field,

    data,

    colors,

    tooltip,

    tooltipCategory,

    tooltipValue,

    scale,

    aspectRatio,
}: RadarChartViewProps) => {
    const formattedData = useMemo(() => {
        if (!data) {
            return data;
        }

        const tmpData = {
            ...data,
        };

        // @ts-expect-error TS7006
        tmpData.values.forEach((value) => {
            value.category = 0;
        });

        return tmpData;
    }, [data]);

    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    width * 0.76,
                );
            } catch (e) {
                // @ts-expect-error TS18046
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new RadarChart();

        specBuilder.setColors(colors.split(' '));
        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setScale(lodexScaleToIdScale(scale));

        // @ts-expect-error TS2554
        return specBuilder.buildSpec(width, formattedData.values.length);
    }, [
        width,
        formattedData.values,
        advancedMode,
        advancedModeSpec,
        colors,
        tooltip,
        tooltipCategory,
        tooltipValue,
        scale,
    ]);

    if (spec === null) {
        // @ts-expect-error TS18046
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        // @ts-expect-error TS2322
        <div style={styles.container} ref={ref}>
            <CustomActionVega
                spec={spec}
                data={formattedData}
                injectType={VEGA_DATA_INJECT_TYPE_A}
                // @ts-expect-error TS2322
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

export const RadarChartAdminView = connect((_state, props) => {
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
})(RadarChartView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(RadarChartView);
