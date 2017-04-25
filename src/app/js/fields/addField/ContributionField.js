import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, FormSection } from 'redux-form';

import FieldSchemeInput from '../FieldSchemeInput';
import FieldLabelInput from '../FieldLabelInput';
import FieldFormatInput from '../FieldFormatInput';
import FieldIsSearchableInput from '../FieldIsSearchableInput';
import FieldIsFacetInput from '../FieldIsFacetInput';
import FieldPositionInput from '../FieldPositionInput';
import { fromFields } from '../../sharedSelectors';
import FormTextField from '../../lib/components/FormTextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const required = value => (value ? undefined : 'Required');
const uniqueField = (fields, isNewField) => (value) => {
    if (!isNewField) {
        return null;
    }
    return (fields.find(({ label }) => label === value) ? 'Field already exists' : undefined);
};

export const AddFieldDetailComponent = ({
    collectionFields,
    documentFields,
    isNewField,
    isLoggedIn,
    p: polyglot,
}) => (

    <FormSection name="field">
        <FieldLabelInput
            validate={[
                required,
                uniqueField([...documentFields, ...collectionFields], isNewField),
            ]}
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
                fields={[...documentFields, ...collectionFields]}
            />,
        ]}
    </FormSection>
);

AddFieldDetailComponent.propTypes = {
    collectionFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    documentFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    isNewField: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, { isNewField }) => ({
    collectionFields: fromFields.getCollectionFields(state),
    documentFields: fromFields.getDocumentFields(state),
    isNewField,
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(AddFieldDetailComponent);
