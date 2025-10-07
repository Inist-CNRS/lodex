import { useTranslate } from '../i18n/I18NContext.tsx';
import { SwitchField } from '../reactHookFormFields/SwitchField.tsx';

export const FieldAnnotationKindAdditionInput = () => {
    const { translate } = useTranslate();

    return (
        <SwitchField
            className="enableAnnotationKindAddition"
            name="enableAnnotationKindAddition"
            label={translate('field_annotation_kind_addition')}
        />
    );
};

export default FieldAnnotationKindAdditionInput;
