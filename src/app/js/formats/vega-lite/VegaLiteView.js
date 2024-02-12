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

const styles = {
    container: {
        userSelect: 'none',
    },
};

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
            setError(e.message);
            return null;
        }
    }, [specTemplate, width]);

    if (!spec) {
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
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

export const VegaLiteAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: props.dataset.values ?? [],
        },
    };
})(VegaLiteView);

export default compose(injectData(), connect(mapStateToProps))(VegaLiteView);
