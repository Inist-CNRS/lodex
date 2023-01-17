// TODO: check if this is still used
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

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
            variant="text"
            className="add-composite-field"
            onClick={() => addFields(fields)}
        >
            +
        </Button>
        <Button
            variant="text"
            className="remove-composite-field"
            onClick={() => removeField(fields)}
        >
            -
        </Button>
    </div>
);

ComposedOfFieldListComponent.propTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
    }).isRequired,
};

export default ComposedOfFieldListComponent;
