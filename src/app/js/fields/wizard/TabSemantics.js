import React from 'react';

import { field as fieldPropTypes } from '../../propTypes';
import FieldAnnotableInput from '../FieldAnnotableInput';
import FieldLanguageInput from '../FieldLanguageInput';
import FieldSchemeInput from '../FieldSchemeInput';

export const TabSemanticsComponent = ({ currentEditedField }) => {
    return (
        <>
            <FieldSchemeInput />
            <FieldLanguageInput field={currentEditedField} />
            <FieldAnnotableInput />
        </>
    );
};

TabSemanticsComponent.propTypes = {
    currentEditedField: fieldPropTypes.isRequired,
};

export default TabSemanticsComponent;
