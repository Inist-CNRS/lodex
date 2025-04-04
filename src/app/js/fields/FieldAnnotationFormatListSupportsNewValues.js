import React from 'react';

import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import FieldInput from '../lib/components/FieldInput';
import FormSwitchField from '../lib/components/FormSwitchField';

export function FieldAnnotationFormatListSupportsNewValues({
    isFieldAnnotable,
    fieldAnnotationFormat,
}) {
    if (!isFieldAnnotable || fieldAnnotationFormat !== 'list') {
        return null;
    }

    return (
        <Box
            sx={{
                marginBlockStart: -3,
            }}
        >
            <FieldInput
                name="annotationFormatListSupportsNewValues"
                component={FormSwitchField}
                labelKey="field_annotation_format_list_supports_new_values"
            />
        </Box>
    );
}

FieldAnnotationFormatListSupportsNewValues.propTypes = {
    isFieldAnnotable: PropTypes.bool.isRequired,
    fieldAnnotationFormat: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    return {
        isFieldAnnotable: state.form.field.values.annotable,
        fieldAnnotationFormat: state.form.field.values.annotationFormat,
    };
};

export default compose(connect(mapStateToProps))(
    FieldAnnotationFormatListSupportsNewValues,
);
