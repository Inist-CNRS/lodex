import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { SwitchField } from '../../../../packages/frontend-common/form-fields/SwitchField.tsx';

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
