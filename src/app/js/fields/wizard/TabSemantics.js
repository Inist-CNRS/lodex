import React from 'react';

import { field as fieldPropTypes } from '../../propTypes';
import FieldSchemeInput from '../FieldSchemeInput';
import FieldLanguageInput from '../FieldLanguageInput';

export const TabSemanticsComponent = ({ currentEditedField }) => {
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
