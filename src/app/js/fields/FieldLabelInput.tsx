import get from 'lodash/get';

import { useTranslate } from '../i18n/I18NContext';
import { TextField } from '../reactHookFormFields/TextField.tsx';

// @ts-expect-error TS7006
export const uniqueField = (fields, polyglot) => (value, _, props) => {
    // retrieve previous label of the edited field if any (either in props.field of props.fieldToAdd)
    const label = get(props, 'field.label', get(props, 'fieldToAdd.label'));

    // the value is the same as the label currently edited
    if (label === value) {
        return undefined;
    }

    // check if another field exist with the same label
    // @ts-expect-error TS7031
    return fields.find(({ label }) => label === value)
        ? polyglot.t('field_label_exists')
        : undefined;
};

interface FieldLabelInputComponentProps {
    disabled?: boolean;
}

export const FieldLabelInputComponent = ({
    disabled,
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

FieldLabelInputComponent.defaultProps = {
    disabled: false,
};

export default FieldLabelInputComponent;
