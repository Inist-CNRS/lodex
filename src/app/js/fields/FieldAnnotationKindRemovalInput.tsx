import { useTranslate } from '../i18n/I18NContext.tsx';
import { SwitchField } from '../reactHookFormFields/SwitchField.tsx';

const FieldAnnotationKindRemovalInput = () => {
    const { translate } = useTranslate();

    return (
        <SwitchField
            className="enableAnnotationKindRemoval"
            name="enableAnnotationKindRemoval"
            label={translate('field_annotation_kind_removal')}
        />
    );
};

export default FieldAnnotationKindRemovalInput;
