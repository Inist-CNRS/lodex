// @ts-expect-error TS6133
import React from 'react';

import Stack from '@mui/material/Stack';
import { field as fieldPropTypes } from '../../propTypes';
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

TabAnnotationsComponent.propTypes = {
    currentEditedField: fieldPropTypes.isRequired,
};

export default TabAnnotationsComponent;
