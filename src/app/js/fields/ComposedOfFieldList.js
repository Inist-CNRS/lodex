import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import ComposedOfFieldListItem from './ComposedOfFieldListItem';

const removeField = fields =>
    fields.length > 2 && fields.remove(fields.length - 1);
const addFields = fields => fields.push('');

export const ComposedOfFieldListComponent = ({ fields }) => (
    <div>
        {fields.map(fieldName => (
            <ComposedOfFieldListItem
                key={`${fieldName}`}
                fieldName={fieldName}
            />
        ))}
        <Button
            className="add-composite-field"
            label="+"
            onClick={() => addFields(fields)}
        />
        <Button
            className="remove-composite-field"
            label="-"
            onClick={() => removeField(fields)}
        />
    </div>
);

ComposedOfFieldListComponent.propTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
    }).isRequired,
};

export default ComposedOfFieldListComponent;
