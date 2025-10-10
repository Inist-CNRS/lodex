import { useTranslate } from '../i18n/I18NContext.tsx';
import { SwitchField } from '../reactHookFormFields/SwitchField.tsx';

const FieldAnnotableInput = () => {
    const { translate } = useTranslate();

    return (
        <SwitchField
            className="annotable"
            name="annotable"
            label={translate('field_annotable')}
            defaultValue={true}
        />
    );
};

export default FieldAnnotableInput;
