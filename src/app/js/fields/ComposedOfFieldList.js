import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

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
            <FontAwesomeIcon icon={faPlus} />
        </IconButton>
        <IconButton
            className="remove-composite-field"
            onClick={() => removeField(fields)}
        >
            <FontAwesomeIcon icon={faMinus} />
        </IconButton>
    </div>
);

ComposedOfFieldListComponent.propTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
    }).isRequired,
};

export default ComposedOfFieldListComponent;
