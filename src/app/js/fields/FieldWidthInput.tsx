import { useTranslate } from '../i18n/I18NContext.tsx';
import { TextField } from '../reactHookFormFields/TextField.tsx';

const FieldWidthInput = () => {
    const { translate } = useTranslate();

    return (
        <TextField
            className="width"
            name="width"
            sx={{
                width: '30%',
                marginTop: 2,
            }}
            type="number"
            label={translate('field_width')}
            InputProps={{
                endAdornment: '%',
                inputProps: {
                    min: 10,
                    max: 100,
                    step: 10,
                },
            }}
        />
    );
};

export default FieldWidthInput;
