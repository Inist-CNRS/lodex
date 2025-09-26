import { TextField } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import { default as React, useMemo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { useTranslate } from '../i18n/I18NContext';
import FieldInput from '../lib/components/FieldInput';
import { FIELD_ANNOTATION_FORMAT_LIST } from './FieldAnnotationFormat';

function FieldAnnotationFormatListOptionsField({
    // @ts-expect-error TS7031
    input,
    // @ts-expect-error TS7031
    label,
    // @ts-expect-error TS7031
    meta: { touched, error },
}) {
    const fieldValue = useMemo(() => {
        if (typeof input.value === 'string') {
            return input.value;
        }

        return (input.value ?? []).join('\n');
    }, [input]);

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

FieldAnnotationFormatListOptionsField.propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    meta: PropTypes.object.isRequired,
};

export function FieldAnnotationFormatListOptions({
    // @ts-expect-error TS7031
    isFieldAnnotable,
    // @ts-expect-error TS7031
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
    fieldAnnotationFormat: PropTypes.string.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    return {
        isFieldAnnotable: state.form.field.values.annotable,
        fieldAnnotationFormat: state.form.field.values.annotationFormat,
    };
};

export default compose(connect(mapStateToProps))(
    // @ts-expect-error TS2345
    FieldAnnotationFormatListOptions,
);
