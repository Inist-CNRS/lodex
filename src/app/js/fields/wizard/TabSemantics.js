import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { field as fieldPropTypes } from '../../propTypes';
import FieldComposedOf from '../FieldComposedOf';
import FieldAnnotation from '../FieldAnnotation';
import FieldSchemeInput from '../FieldSchemeInput';
import FieldLanguageInput from '../FieldLanguageInput';

export const TabSemanticsComponent = ({ fields, currentEditedField }) => {
    const { filter } = useParams();
    return (
        <>
            <FieldSchemeInput />
            <FieldLanguageInput field={currentEditedField} />
            <FieldAnnotation fields={fields} scope={filter} />
            <FieldComposedOf fields={fields} />
        </>
    );
};

TabSemanticsComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    currentEditedField: fieldPropTypes.isRequired,
};

export default TabSemanticsComponent;
