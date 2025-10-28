import { useTranslate } from '../i18n/I18NContext.tsx';
import { SwitchField } from '../../../../packages/frontend-common/form-fields/SwitchField.tsx';

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
