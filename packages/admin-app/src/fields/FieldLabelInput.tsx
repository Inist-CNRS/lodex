import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { TextField } from '@lodex/frontend-common/form-fields/TextField.tsx';

interface FieldLabelInputComponentProps {
    disabled?: boolean;
}

export const FieldLabelInputComponent = ({
    disabled = false,
}: FieldLabelInputComponentProps) => {
    const { translate } = useTranslate();

    return (
        <TextField
            name="label"
            label={translate('fieldLabel')}
            fullWidth
            disabled={disabled}
        />
    );
};

export default FieldLabelInputComponent;
