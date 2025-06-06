import React from 'react';

import { field as fieldPropTypes } from '../../propTypes';
import FieldLanguageInput from '../FieldLanguageInput';
import FieldSchemeInput from '../FieldSchemeInput';

export const TabSemanticsComponent = ({ currentEditedField }) => {
    if (currentEditedField.subresourceId) {
        return null;
    }
    return (
        <>
            <FieldSchemeInput />
            <FieldLanguageInput field={currentEditedField} />
        </>
    );
};

TabSemanticsComponent.propTypes = {
    currentEditedField: fieldPropTypes.isRequired,
};

export default TabSemanticsComponent;
