import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import Alert from '../lib/components/Alert';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { configureField } from '../fields';
import { fromFields } from '../sharedSelectors';
import FieldLabelInput from '../lib/components/FieldLabelInput';
import FieldSchemeInput from '../lib/components/FieldSchemeInput';
import FieldLanguageInput from '../lib/components/FieldLanguageInput';
import FieldPositionInput from '../lib/components/FieldPositionInput';
import FieldFormatInput from '../lib/components/FieldFormatInput';
import FieldDisplayInListInput from '../lib/components/FieldDisplayInListInput';
import FieldDisplayInResourceInput from '../lib/components/FieldDisplayInResourceInput';
import FieldIsSearchableInput from '../lib/components/FieldIsSearchableInput';
import FieldIsFacetInput from '../lib/components/FieldIsFacetInput';

export const FORM_NAME = 'ONTOLOGY_FIELD_FORM';

export const EditOntologyFieldFormComponent = ({ field, fields, publicationError, handleSubmit }) => (
    <form id="field_form" onSubmit={() => handleSubmit()}>
        {publicationError && <Alert><p>{publicationError}</p></Alert>}
        <FieldLabelInput />
        <FieldSchemeInput />
        <FieldLanguageInput field={field} />
        <FieldDisplayInListInput />
        <FieldDisplayInResourceInput />
        <FieldPositionInput field={field} fields={fields} />
        <FieldFormatInput />
        <FieldIsSearchableInput />
        <FieldIsFacetInput />
    </form>
);

EditOntologyFieldFormComponent.defaultProps = {
    resource: null,
    error: null,
    saving: false,
};

EditOntologyFieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
    publicationError: fromFields.getError(state),
});

const mapDispatchToProps = {
    onSaveField: configureField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onSubmit: ({ onSaveField }) => (values) => {
            onSaveField(values);
        },
    }),
    withProps(({ field, ...props }) => ({
        ...props,
        initialValues: field,
    })),
    reduxForm({
        form: FORM_NAME,
    }),
)(EditOntologyFieldFormComponent);
