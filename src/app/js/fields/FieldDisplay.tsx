import { SwitchField } from '../../../../packages/frontend-common/form-fields/SwitchField.tsx';
import { useTranslate } from '../i18n/I18NContext.tsx';

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
