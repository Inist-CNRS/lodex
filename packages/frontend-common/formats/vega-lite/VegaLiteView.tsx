import { clamp } from 'lodash';
import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import type { Field } from '../../fields/types';
import stylesToClassName from '../../utils/stylesToClassName';
import InvalidFormat from '../InvalidFormat';
import injectData from '../injectData';
import { useSizeObserver } from '../utils/chartsHooks';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../utils/chartsUtils';
import { CustomActionVegaLite } from '../utils/components/vega-lite-component';

// @ts-expect-error TS2554
const styles = stylesToClassName({
    container: {
        userSelect: 'none',
    },
});

interface VegaLiteViewProps {
    field: Field;
    resource: object;
    data?: any;
    specTemplate: string;
    aspectRatio?: string;
}

const VegaLiteView = ({
    field,
    data,
    aspectRatio,
    specTemplate,
}: VegaLiteViewProps) => {
    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        try {
            return convertSpecTemplate(
                specTemplate,
                width - VEGA_ACTIONS_WIDTH,
                clamp((width - VEGA_ACTIONS_WIDTH) * 0.8, 300, 1200),
            );
        } catch (e) {
            // @ts-expect-error TS18046
            setError(e.message);
            return null;
        }
    }, [specTemplate, width]);

    if (!spec) {
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        // @ts-expect-error TS2339
        <div className={styles.container} ref={ref}>
            <CustomActionVegaLite
                // @ts-expect-error TS2322
                spec={spec || {}}
                data={data}
                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
                aspectRatio={aspectRatio}
            />
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {};
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export const VegaLiteAdminView = connect((_state, props) => {
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
})(VegaLiteView);

// @ts-expect-error TS2345
export default compose(injectData(), connect(mapStateToProps))(VegaLiteView);
