import { Box } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { SwitchField } from '../../../../packages/frontend-common/form-fields/SwitchField.tsx';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

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
