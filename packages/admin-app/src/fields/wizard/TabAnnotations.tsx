import Stack from '@mui/material/Stack';
import FieldAnnotableInput from '../FieldAnnotableInput';
import { default as FieldAnnotationFormat } from '../FieldAnnotationFormat';
import { default as FieldAnnotationFormatListKind } from '../FieldAnnotationFormatListKind';
import { default as FieldAnnotationFormatListOptions } from '../FieldAnnotationFormatListOptions';
import { default as FieldAnnotationFormatListSupportsNewValues } from '../FieldAnnotationFormatListSupportsNewValues';
import { default as FieldAnnotationKind } from '../FieldAnnotationKind';

export const TabAnnotationsComponent = () => {
    return (
        <Stack
            sx={{
                gap: 4,
            }}
        >
            <FieldAnnotableInput />
            <FieldAnnotationKind />
            <FieldAnnotationFormat />
            <FieldAnnotationFormatListOptions />
            <FieldAnnotationFormatListSupportsNewValues />
            <FieldAnnotationFormatListKind />
        </Stack>
    );
};

export default TabAnnotationsComponent;
