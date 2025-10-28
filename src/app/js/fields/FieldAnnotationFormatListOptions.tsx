import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import { useTranslate } from '../i18n/I18NContext';
import { FIELD_ANNOTATION_FORMAT_LIST } from './FieldAnnotationFormat';
import { useFormContext, useWatch } from 'react-hook-form';
import { TextField } from '../../../../packages/frontend-common/form-fields/TextField';

export function FieldAnnotationFormatListOptions() {
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
        <Stack gap={0.5}>
            <TextField
                name="annotationFormatListOptions"
                label={translate('field_annotation_format_list_options')}
                fullWidth
                multiline
                minRows={3}
                maxRows={10}
                transform={(value: string | string[]) => {
                    if (typeof value === 'string') {
                        return value;
                    }

                    return (value ?? []).join('\n');
                }}
            />
            <FormHelperText>
                {translate('field_annotation_format_list_options_helptext')}
            </FormHelperText>
        </Stack>
    );
}

export default FieldAnnotationFormatListOptions;
