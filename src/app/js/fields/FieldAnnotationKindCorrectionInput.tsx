import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { SwitchField } from '../../../../packages/frontend-common/form-fields/SwitchField.tsx';

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
