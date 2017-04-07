import React, { PropTypes } from 'react';
import { field as fieldPropTypes } from '../../propTypes';

const UriView = ({ className, resource, field }) => {
    const values = resource[field.name];
    const type = (field.format && field.format.args && field.format.args.type) || 'unordered';

    if (type === 'ordered') {
        return (
            <ol className={className}>
                {values.map(value => <li>{value}</li>)}
            </ol>
        );
    }
    return (
        <ul className={className}>
            {values.map(value => <li>{value}</li>)}
        </ul>
    );
};

UriView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

UriView.defaultProps = {
    className: null,
};

export default UriView;
