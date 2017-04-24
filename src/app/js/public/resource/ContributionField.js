import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, FormSection } from 'redux-form';

import FieldSchemeInput from '../../lib/components/FieldSchemeInput';
import FieldLabelInput from '../../lib/components/FieldLabelInput';
import FieldFormatInput from '../../lib/components/FieldFormatInput';
import FieldIsSearchableInput from '../../lib/components/FieldIsSearchableInput';
import FieldIsFacetInput from '../../lib/components/FieldIsFacetInput';
import FieldPositionInput from '../../lib/components/FieldPositionInput';
import {
    fromPublication,
} from '../selectors';
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
    collectionFields: fromPublication.getCollectionFields(state),
    documentFields: fromPublication.getDocumentFields(state),
    isNewField,
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(AddFieldDetailComponent);
