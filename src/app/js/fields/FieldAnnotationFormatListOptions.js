import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import { useTranslate } from '../i18n/I18NContext';
import FieldInput from '../lib/components/FieldInput';
import FormTextField from '../lib/components/FormTextField';
import { FIELD_ANNOTATION_FORMAT_LIST } from './FieldAnnotationFormat';

export function FieldAnnotationFormat({
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
                component={FormTextField}
                fullWidth
                multiline
                minRows={3}
                maxRows={10}
            />
            <FormHelperText>
                {translate('field_annotation_format_list_options_helptext')}
            </FormHelperText>
        </Stack>
    );
}

FieldAnnotationFormat.propTypes = {
    isFieldAnnotable: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        isFieldAnnotable: state.form.field.values.annotable,
        fieldAnnotationFormat: state.form.field.values.annotationFormat,
    };
};

export default compose(connect(mapStateToProps))(FieldAnnotationFormat);
