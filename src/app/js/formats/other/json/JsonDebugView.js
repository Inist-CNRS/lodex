import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../../propTypes';
import injectData from '../../injectData';

const JsonDebugView = (props) => {
    const ReactJson = require('react-json-view').default;

    const { debugMode } = props;

    const json = useMemo(() => {
        if (!debugMode) {
            return props.data ?? [];
        }
        return props;
    }, [props]);

    return (
        <ReactJson
            style={{ margin: '12px', padding: '8px', borderRadius: '4px' }}
            src={json}
            theme="monokai"
            collapsed={1}
        />
    );
};

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

JsonDebugView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    params: PropTypes.any.isRequired,
    debugMode: PropTypes.bool.isRequired,
};

export default compose(injectData(), connect(mapStateToProps))(JsonDebugView);
