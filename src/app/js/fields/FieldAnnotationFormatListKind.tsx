import { MenuItem } from '@mui/material';
import { useTranslate } from '../i18n/I18NContext';
import { FIELD_ANNOTATION_FORMAT_LIST } from './FieldAnnotationFormat';
import { useFormContext, useWatch } from 'react-hook-form';
import { TextField } from '../reactHookFormFields/TextField.tsx';

export const FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE = 'single';
export const FIELD_ANNOTATION_FORMAT_LIST_KIND_MULTIPLE = 'multiple';

export function FieldAnnotationFormatListKind() {
    const { translate } = useTranslate();

    const { control } = useFormContext();
    const isFieldAnnotable = useWatch({
        control,
        name: 'annotable',
    });
    const fieldAnnotationFormat = useWatch({
        control,
        name: 'annotationFormat',
    });

    if (
        !isFieldAnnotable ||
        fieldAnnotationFormat !== FIELD_ANNOTATION_FORMAT_LIST
    ) {
        return null;
    }

    return (
        <TextField
            select
            name="annotationFormatListKind"
            label={translate('field_annotation_format_list_kind')}
            fullWidth
        >
            <MenuItem value={FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE}>
                {translate('field_annotation_format_list_kind_single')}
            </MenuItem>
            <MenuItem value={FIELD_ANNOTATION_FORMAT_LIST_KIND_MULTIPLE}>
                {translate('field_annotation_format_list_kind_multiple')}
            </MenuItem>
        </TextField>
    );
}

export default FieldAnnotationFormatListKind;
