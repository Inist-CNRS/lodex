import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';

const SentenceView = ({ resource, field, prefix, suffix }) => {
    const output = prefix.concat(resource[field.name]).concat(suffix);
    return <span>{`${prefix}${output}${suffix}`}</span>;
};

SentenceView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    prefix: PropTypes.string.isRequired,
    suffix: PropTypes.string.isRequired,
};

export default SentenceView;
