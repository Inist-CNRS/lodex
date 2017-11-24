import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';

const SentenceView = ({ resource, field }) => {
    const prefix =
        field.format && field.format.args && field.format.args.prefix
            ? field.format.args.prefix
            : '';
    const suffix =
        field.format && field.format.args && field.format.args.suffix
            ? field.format.args.suffix
            : '';
    const output = prefix.concat(resource[field.name]).concat(suffix);
    return <span>{output}</span>;
};

SentenceView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default SentenceView;
