// @ts-expect-error TS6133
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { clamp } from 'lodash';

import InvalidFormat from '../InvalidFormat';
import injectData from '../injectData';
import { field as fieldPropTypes } from '../../propTypes';
import { CustomActionVegaLite } from '../utils/components/vega-lite-component';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../utils/chartsUtils';
import { useSizeObserver } from '../utils/chartsHooks';
import stylesToClassName from '../../lib/stylesToClassName';

// @ts-expect-error TS2554
const styles = stylesToClassName({
    container: {
        userSelect: 'none',
    },
});

// @ts-expect-error TS7031
const VegaLiteView = ({ field, data, aspectRatio, specTemplate }) => {
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

VegaLiteView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    specTemplate: PropTypes.string.isRequired,
    aspectRatio: PropTypes.string,
};

VegaLiteView.defaultProps = {
    className: null,
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

// @ts-expect-error TS6133
export const VegaLiteAdminView = connect((state, props) => {
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
