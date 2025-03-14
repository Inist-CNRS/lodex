import React from 'react';

import Stack from '@mui/material/Stack';
import useTheme from '@mui/material/styles/useTheme';
import { field as fieldPropTypes } from '../../propTypes';
import FieldAnnotableInput from '../FieldAnnotableInput';
import { default as FieldAnnotationFormat } from '../FieldAnnotationFormat';
import { default as FieldAnnotationFormatListKind } from '../FieldAnnotationFormatListKind';
import { default as FieldAnnotationFormatListOptions } from '../FieldAnnotationFormatListOptions';
import { default as FieldAnnotationFormatListSupportsNewValues } from '../FieldAnnotationFormatListSupportsNewValues';

export const TabAnnotationsComponent = () => {
    const theme = useTheme();
    return (
        <Stack
            sx={{
                gap: 4,
                paddingBlockStart: 2,
                marginBlockStart: 3,
                borderTopColor: theme.palette.grey[300],
                borderTopWidth: 1,
                borderTopStyle: 'solid',
            }}
        >
            <FieldAnnotableInput />
            <FieldAnnotationFormat />
            <FieldAnnotationFormatListOptions />
            <FieldAnnotationFormatListSupportsNewValues />
            <FieldAnnotationFormatListKind />
        </Stack>
    );
};

TabAnnotationsComponent.propTypes = {
    currentEditedField: fieldPropTypes.isRequired,
};

export default TabAnnotationsComponent;
