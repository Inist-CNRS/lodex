import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import _ from 'lodash';

const LdaChartView = props => {
    const ReactJson = require('react-json-view').default;

    const json = useMemo(() => {
        const values = props.data.values ?? [];
        const topics = _.chain(values)
            .flatMap(o => Object.keys(o.value.topics))
            .uniq()
            .sort((a, b) =>
                a.localeCompare(b, 'fr', {
                    sensitivity: 'accent',
                    numeric: true,
                    usage: 'sort',
                    ignorePunctuation: true,
                }),
            )
            .value();

        return {
            values,
            topics,
        };
    }, [props]);

    return (
        <ReactJson
            style={{ margin: '12px', borderRadius: '4px' }}
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

LdaChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
};

export default compose(injectData(), connect(mapStateToProps))(LdaChartView);
