import { SwitchField } from '@lodex/frontend-common/form-fields/SwitchField.tsx';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const FieldDisplayInput = () => {
    const { translate } = useTranslate();

    return (
        <SwitchField
            className="display"
            name="display"
            label={translate('field_display')}
        />
    );
};

export default FieldDisplayInput;
