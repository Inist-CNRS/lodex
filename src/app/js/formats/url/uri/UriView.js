import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../../propTypes';
import { getResourceUri } from '../../../../../common/uris';
import getLabel from '../../shared/getLabel';
import InvalidFormat from '../../InvalidFormat';
import Link from '../../../lib/components/Link';

const UriView = ({ className, resource, field, fields, type, value }) => {
    const uri = resource[field.name];

    if (Array.isArray(uri)) {
        return uri.map((uriItem, index) => {
            const label = getLabel(field, resource, fields, type, value);

            const currentLabel = Array.isArray(label) ? label[index] : label;

            return (
                <div key={uriItem}>
                    <Link
                        className={className}
                        to={getResourceUri({ uri: uriItem })}
                    >
                        {currentLabel}
                    </Link>
                </div>
            );
        });
    }

    if (!uri || typeof uri !== 'string') {
        return <InvalidFormat format={field.format} value={uri} />;
    }

    const label = getLabel(field, resource, fields, type, value);

    return (
        <Link className={className} to={getResourceUri({ uri })}>
            {label}
        </Link>
    );
};

UriView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    resource: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['value', 'text', 'column']),
    value: PropTypes.string.isRequired,
};

UriView.defaultProps = {
    className: null,
};

export default UriView;
