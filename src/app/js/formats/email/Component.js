import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { field as fieldPropTypes } from '../../propTypes';

const EmailView = ({ className, linkedResource, resource, field, fields }) => {
    let label = resource[field.name];
    const email = resource[field.name];

    if (field.format && field.format.args && field.format.args.type) {
        switch (field.format.args.type) {
            case 'text':
                label = field.format.args.value;
                break;

            case 'column': {
                if (linkedResource) {
                    const fieldForLabel = fields.find(
                        f => f.label === field.format.args.value,
                    );
                    label = linkedResource[fieldForLabel.name];
                }
                break;
            }

            default:
                label = resource[field.name];
                break;
        }
    }

    return (
        <Link className={className} to={`mailto:${email}`}>
            {label}
        </Link>
    );
};

EmailView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

EmailView.defaultProps = {
    className: null,
};

export default EmailView;
