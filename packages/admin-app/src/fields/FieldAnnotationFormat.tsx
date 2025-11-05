import { MenuItem } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { TextField } from '@lodex/frontend-common/form-fields/TextField.tsx';
import {
    FIELD_ANNOTATION_FORMAT_LIST,
    FIELD_ANNOTATION_FORMAT_TEXT,
} from '@lodex/frontend-common/fields/selectors';

export function FieldAnnotationFormat() {
    const { translate } = useTranslate();

    const { control } = useFormContext();
    const isFieldAnnotable = useWatch({
        control,
        name: 'annotable',
    });

    if (!isFieldAnnotable) {
        return null;
    }

    return (
        <TextField
            select
            name="annotationFormat"
            label={translate('field_annotation_format')}
            fullWidth
        >
            <MenuItem value={FIELD_ANNOTATION_FORMAT_TEXT}>
                {translate('field_annotation_format_text')}
            </MenuItem>
            <MenuItem value={FIELD_ANNOTATION_FORMAT_LIST}>
                {translate('field_annotation_format_list')}
            </MenuItem>
        </TextField>
    );
}

export default FieldAnnotationFormat;
