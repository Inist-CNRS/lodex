import { Box } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { SwitchField } from '../reactHookFormFields/SwitchField.tsx';
import { useTranslate } from '../i18n/I18NContext.tsx';

export function FieldAnnotationFormatListSupportsNewValues() {
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

    if (!isFieldAnnotable || fieldAnnotationFormat !== 'list') {
        return null;
    }

    return (
        <Box
            sx={{
                marginBlockStart: -3,
            }}
        >
            <SwitchField
                className="annotationFormatListSupportsNewValues"
                name="annotationFormatListSupportsNewValues"
                label={translate(
                    'field_annotation_format_list_supports_new_values',
                )}
            />
        </Box>
    );
}

export default FieldAnnotationFormatListSupportsNewValues;
