import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { SwitchField } from '@lodex/frontend-common/form-fields/SwitchField.tsx';

const FieldAnnotationKindRemovalInput = () => {
    const { translate } = useTranslate();

    return (
        <SwitchField
            className="enableAnnotationKindRemoval"
            name="enableAnnotationKindRemoval"
            label={translate('field_annotation_kind_removal')}
            defaultValue={true}
        />
    );
};

export default FieldAnnotationKindRemovalInput;
