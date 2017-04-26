import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';
import { Field, FormSection } from 'redux-form';

import FieldSchemeInput from '../FieldSchemeInput';
import FieldLabelInput from '../FieldLabelInput';
import FieldFormatInput from '../FieldFormatInput';
import FieldIsSearchableInput from '../FieldIsSearchableInput';
import FieldIsFacetInput from '../FieldIsFacetInput';
import FieldPositionInput from '../FieldPositionInput';
import FormTextField from '../../lib/components/FormTextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const required = value => (value ? undefined : 'Required');

export const AddFieldDetailComponent = ({
    isNewField,
    isLoggedIn,
    p: polyglot,
}) => (
    <FormSection name="field">
        <FieldLabelInput
            disabled={!isLoggedIn && !isNewField}
        />
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
        {isLoggedIn && [
            <FieldFormatInput />,
            <FieldIsSearchableInput />,
            <FieldIsFacetInput />,
            <FieldPositionInput
                field={{}}
            />,
        ]}
    </FormSection>
);

AddFieldDetailComponent.propTypes = {
    isNewField: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};


export default translate(AddFieldDetailComponent);
