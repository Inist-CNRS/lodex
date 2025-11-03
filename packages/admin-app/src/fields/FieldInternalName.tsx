import { TextField } from '@lodex/frontend-common/form-fields/TextField';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const FieldInternalNameComponent = () => {
    const { translate } = useTranslate();

    return <TextField name="internalName" label={translate('internalName')} />;
};

export default FieldInternalNameComponent;
