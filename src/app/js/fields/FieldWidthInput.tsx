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
            // min={10}
            // max={100}
            // step={10}
            label={translate('field_width')}
            InputProps={{
                endAdornment: '%',
            }}
        />
    );
};

export default FieldWidthInput;
