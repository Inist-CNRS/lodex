import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

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
        <IconButton
            className="add-composite-field"
            onClick={() => addFields(fields)}
        >
            <Add />
        </IconButton>
        <IconButton
            className="remove-composite-field"
            onClick={() => removeField(fields)}
        >
            <Remove />
        </IconButton>
    </div>
);

ComposedOfFieldListComponent.propTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
    }).isRequired,
};

export default ComposedOfFieldListComponent;
