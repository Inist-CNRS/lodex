import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../../propTypes';

// @ts-expect-error TS7031
const SentenceView = ({ resource, field, prefix, suffix }) => {
    const output = resource[field.name];
    return <span>{`${prefix}${output}${suffix}`}</span>;
};

SentenceView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    prefix: PropTypes.string.isRequired,
    suffix: PropTypes.string.isRequired,
};

export default SentenceView;
