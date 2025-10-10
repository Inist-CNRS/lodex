import { useTranslate } from '../i18n/I18NContext.tsx';
import { SwitchField } from '../reactHookFormFields/SwitchField.tsx';

const FieldAnnotationKindCorrectionInput = () => {
    const { translate } = useTranslate();

    return (
        <SwitchField
            className="enableAnnotationKindCorrection"
            name="enableAnnotationKindCorrection"
            label={translate('field_annotation_kind_correction')}
            defaultValue={true}
        />
    );
};

export default FieldAnnotationKindCorrectionInput;
