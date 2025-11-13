import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { SwitchField } from '@lodex/frontend-common/form-fields/SwitchField.tsx';

export const FieldAnnotationKindAdditionInput = () => {
    const { translate } = useTranslate();

    return (
        <SwitchField
            className="enableAnnotationKindAddition"
            name="enableAnnotationKindAddition"
            label={translate('field_annotation_kind_addition')}
            defaultValue={true}
        />
    );
};

export default FieldAnnotationKindAdditionInput;
