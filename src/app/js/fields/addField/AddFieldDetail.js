import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Field, FormSection } from 'redux-form';

import FieldSchemeInput from '../FieldSchemeInput';
import FieldLabelInput from '../FieldLabelInput';
import FieldFormatInput from '../FieldFormatInput';
import FieldWidthInput from '../FieldWidthInput';
import FieldIsSearchableInput from '../FieldIsSearchableInput';
import FieldIsFacetInput from '../FieldIsFacetInput';
import FormTextField from '../../lib/components/FormTextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const required = value => (value ? undefined : 'Required');

export const AddFieldDetailComponent = ({
    isNewField,
    isAdmin,
    p: polyglot,
}) => (
    <FormSection name="field">
        <FieldLabelInput disabled={!isAdmin && !isNewField} />
        <Field
            className="field-value"
            name="value"
            validate={required}
            component={FormTextField}
            label={polyglot.t('fieldValue')}
            fullWidth
        />
        <FieldSchemeInput
            disabled={!isNewField}
            name="scheme"
            className="field-scheme"
        />
        {isAdmin && [
            <FieldFormatInput key="field_format" />,
            <FieldWidthInput key="field_width" />,
            <FieldIsSearchableInput key="field_searchable" />,
            <FieldIsFacetInput key="field_facet" />,
        ]}
    </FormSection>
);

AddFieldDetailComponent.propTypes = {
    isNewField: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    isAdmin: PropTypes.bool.isRequired,
};

export default translate(AddFieldDetailComponent);
