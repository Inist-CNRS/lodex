import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { MenuItem } from '@mui/material';
import { useTranslate } from '../i18n/I18NContext';
import FieldInput from '../lib/components/FieldInput';
import FormSelectField from '../lib/components/FormSelectField';

export const FIELD_ANNOTATION_FORMAT_TEXT = 'text';
export const FIELD_ANNOTATION_FORMAT_LIST = 'list';

// @ts-expect-error TS7031
export function FieldAnnotationFormat({ isFieldAnnotable }) {
    const { translate } = useTranslate();

    if (!isFieldAnnotable) {
        return null;
    }

    return (
        <FieldInput
            name="annotationFormat"
            labelKey="field_annotation_format"
            component={FormSelectField}
            fullWidth
        >
            <MenuItem value={FIELD_ANNOTATION_FORMAT_TEXT}>
                {translate('field_annotation_format_text')}
            </MenuItem>
            <MenuItem value={FIELD_ANNOTATION_FORMAT_LIST}>
                {translate('field_annotation_format_list')}
            </MenuItem>
        </FieldInput>
    );
}

FieldAnnotationFormat.propTypes = {
    isFieldAnnotable: PropTypes.bool.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    return {
        isFieldAnnotable: state.form.field.values.annotable,
    };
};

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps))(FieldAnnotationFormat);
