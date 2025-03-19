import { MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { default as React } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { useTranslate } from '../i18n/I18NContext';
import FieldInput from '../lib/components/FieldInput';
import FormSelectField from '../lib/components/FormSelectField';
import { FIELD_ANNOTATION_FORMAT_LIST } from './FieldAnnotationFormat';

export const FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE = 'single';
export const FIELD_ANNOTATION_FORMAT_LIST_KIND_MULTIPLE = 'multiple';

export function FieldAnnotationFormatListKind({
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
        <FieldInput
            name="annotationFormatListKind"
            labelKey="field_annotation_format_list_kind"
            component={FormSelectField}
        >
            <MenuItem value={FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE}>
                {translate('field_annotation_format_list_kind_single')}
            </MenuItem>
            <MenuItem value={FIELD_ANNOTATION_FORMAT_LIST_KIND_MULTIPLE}>
                {translate('field_annotation_format_list_kind_multiple')}
            </MenuItem>
        </FieldInput>
    );
}

FieldAnnotationFormatListKind.propTypes = {
    isFieldAnnotable: PropTypes.bool.isRequired,
    fieldAnnotationFormat: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    return {
        isFieldAnnotable: state.form.field.values.annotable,
        fieldAnnotationFormat: state.form.field.values.annotationFormat,
    };
};

export default compose(connect(mapStateToProps))(FieldAnnotationFormatListKind);
