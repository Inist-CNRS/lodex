import { TextField } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import { default as React, useMemo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { useTranslate } from '../i18n/I18NContext';
import FieldInput from '../lib/components/FieldInput';
import { FIELD_ANNOTATION_FORMAT_LIST } from './FieldAnnotationFormat';
import { splitAnnotationFormatListOptions } from './annotations';

function FieldAnnotationFormatListOptionsField({
    input,
    label,
    meta: { touched, error },
}) {
    const fieldValue = useMemo(() => {
        if (typeof input.value === 'string') {
            return input.value;
        }

        return (input.value ?? []).join('\n');
    }, [input]);

    const predefinedValues = useMemo(() => {
        return splitAnnotationFormatListOptions(fieldValue);
    }, [fieldValue]);

    return (
        <>
            <TextField
                placeholder={label}
                label={label}
                error={touched && !!error}
                helperText={touched && error}
                {...input}
                name={null}
                value={fieldValue}
                fullWidth
                multiline
                minRows={3}
                maxRows={10}
            />
        </>
    );
}

export function FieldAnnotationFormatListOptions({
    isFieldAnnotable,
    fieldAnnotationFormat,
}) {
    const { translate } = useTranslate();
    if (
        !isFieldAnnotable ||
        fieldAnnotationFormat !== FIELD_ANNOTATION_FORMAT_LIST
    ) {
        return null;
    }

    return (
        <Stack gap={0.5}>
            <FieldInput
                name="annotationFormatListOptions"
                labelKey="field_annotation_format_list_options"
                component={FieldAnnotationFormatListOptionsField}
            />
            <FormHelperText>
                {translate('field_annotation_format_list_options_helptext')}
            </FormHelperText>
        </Stack>
    );
}

FieldAnnotationFormatListOptions.propTypes = {
    isFieldAnnotable: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        isFieldAnnotable: state.form.field.values.annotable,
        fieldAnnotationFormat: state.form.field.values.annotationFormat,
    };
};

export default compose(connect(mapStateToProps))(
    FieldAnnotationFormatListOptions,
);
