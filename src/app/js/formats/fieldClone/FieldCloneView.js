import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import InvalidFormat from '../InvalidFormat';
import { getViewComponent } from './..';

const FieldCloneView = ({ className, resource, field, fields, value }) => {
    const clonedField = fields.find(item => item.name === value);

    if (
        !clonedField ||
        typeof clonedField !== 'object' ||
        (clonedField.format && clonedField.format.name === 'fieldClone')
    ) {
        return <InvalidFormat format={field.format} value={value} />;
    }

    const { ViewComponent, args } = getViewComponent(clonedField, false);

    return (
        <ViewComponent
            className={className}
            field={clonedField}
            fields={fields}
            resource={resource}
            {...args}
        />
    );
};

FieldCloneView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    resource: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
};

FieldCloneView.defaultProps = {
    className: null,
};

export default FieldCloneView;
