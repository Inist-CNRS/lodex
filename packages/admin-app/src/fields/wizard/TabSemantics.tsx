import FieldLanguageInput from '../FieldLanguageInput.tsx';
import FieldSchemeInput from '../FieldSchemeInput.tsx';
import type { Field } from '@lodex/frontend-common/fields/types.ts';

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

export default TabSemanticsComponent;
