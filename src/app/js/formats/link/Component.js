import React, { PropTypes } from 'react';
import { field as fieldPropTypes } from '../../propTypes';

const getLabel = (field, linkedResource, resource, fields) => {
    if (field.format && field.format.args && field.format.args.type) {
        switch (field.format.args.type) {
        case 'text':
            return field.format.args.value;

        case 'column': {
            if (linkedResource) {
                const fieldForLabel = fields.find(f => f.label === field.format.args.value);
                return linkedResource[fieldForLabel.name];
            }
            return resource[field.name];
        }

        default:
            return resource[field.name];
        }
    }
    return resource[field.name];
};

const LinkView = ({ className, linkedResource, resource, field, fields }) => {
    const label = getLabel(field, linkedResource, resource, fields);

    if (Array.isArray(resource[field.name])) {
        const links = resource[field.name];

        return (
            <ul>
                {links.map(link => (
                    <li><a className={className} href={`${link}`}>{link}</a></li>
                ))}
            </ul>
        );
    }

    const link = resource[field.name];
    return <a className={className} href={`${link}`}>{label}</a>;
};

LinkView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

LinkView.defaultProps = {
    className: null,
};

export default LinkView;
