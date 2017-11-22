import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';

const ListView = ({ className, resource, field }) => {
    const values = resource[field.name];
    const type =
        (field.format && field.format.args && field.format.args.type) ||
        'unordered';

    if (type === 'ordered') {
        return (
            <ol className={className}>
                {values.map(value => <li key={value}>{value}</li>)}
            </ol>
        );
    }
    return (
        <ul className={className}>
            {values.map(value => <li key={value}>{value}</li>)}
        </ul>
    );
};

ListView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

ListView.defaultProps = {
    className: null,
};

export default ListView;
