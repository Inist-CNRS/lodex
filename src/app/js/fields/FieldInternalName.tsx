import { TextField } from '../../../../packages/frontend-common/form-fields/TextField';
import { useTranslate } from '../i18n/I18NContext';

export const FieldInternalNameComponent = () => {
    const { translate } = useTranslate();

    return <TextField name="internalName" label={translate('internalName')} />;
};

export default FieldInternalNameComponent;
