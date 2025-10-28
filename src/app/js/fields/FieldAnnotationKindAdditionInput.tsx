import { useTranslate } from '../i18n/I18NContext.tsx';
import { SwitchField } from '../../../../packages/frontend-common/form-fields/SwitchField.tsx';

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
