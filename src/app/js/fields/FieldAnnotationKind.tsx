import { Stack, Typography } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import FieldAnnotationKindAdditionInput from './FieldAnnotationKindAdditionInput';
import FieldAnnotationKindCorrectionInput from './FieldAnnotationKindCorrectionInput';
import FieldAnnotationKindRemovalInput from './FieldAnnotationKindRemovalInput';
import { useFormContext, useWatch } from 'react-hook-form';

export function FieldAnnotationKind() {
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
        <Stack gap={1}>
            <Typography
                variant="h2"
                sx={{
                    fontSize: '1rem',
                }}
            >
                {translate('field_annotation_kind')}
            </Typography>
            <FieldAnnotationKindCorrectionInput />
            <FieldAnnotationKindAdditionInput />
            <FieldAnnotationKindRemovalInput />
        </Stack>
    );
}
export default FieldAnnotationKind;
