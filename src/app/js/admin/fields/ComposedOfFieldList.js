import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';

import ComposedOfFieldListItem from './ComposedOfFieldListItem';

const removeField = fields => fields.length > 2 && fields.remove(fields.length - 1);
const addFields = fields => fields.push('');

export const ComposedOfFieldListComponent = ({ fields }) => (
    <div>
        {fields.map(fieldName => (
            <ComposedOfFieldListItem
                key={`${fieldName}`}
                fieldName={fieldName}
            />
        ))}
        <FlatButton
            className="add-composite-field"
            label="+"
            onClick={() => addFields(fields)}
        />
        <FlatButton
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
