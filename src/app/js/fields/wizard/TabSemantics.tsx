import { field as fieldPropTypes } from '../../propTypes';
import FieldLanguageInput from '../FieldLanguageInput';
import FieldSchemeInput from '../FieldSchemeInput';
import type { Field } from '../types.ts';

export const TabSemanticsComponent = ({
    currentEditedField,
}: {
    currentEditedField: Field;
}) => {
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
