import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import Alert from '../../lib/components/Alert';
import { configureField } from '../';
import { fromFields } from '../../sharedSelectors';
import FieldLabelInput from '../FieldLabelInput';
import FieldSchemeInput from '../FieldSchemeInput';
import FieldLanguageInput from '../FieldLanguageInput';
import FieldOverviewInput from '../FieldOverviewInput';
import FieldFormatInput from '../FieldFormatInput';
import FieldWidthInput from '../FieldWidthInput';
import FieldIsSearchableInput from '../FieldIsSearchableInput';
import FieldIsFacetInput from '../FieldIsFacetInput';
import FieldComposedOf from '../FieldComposedOf';
import FieldAnnotation from '../FieldAnnotation';
import InvalidFieldProperties from '../InvalidFieldProperties';
import FieldDisplayInput from '../FieldDisplay';

export const FORM_NAME = 'ONTOLOGY_FIELD_FORM';

export const EditOntologyFieldFormComponent = ({
    field,
    fields,
    publicationError,
    handleSubmit,
}) => (
    <form id="field_form" onSubmit={() => handleSubmit()}>
        {publicationError && (
            <Alert>
                <p>{publicationError}</p>
            </Alert>
        )}
        <InvalidFieldProperties />
        <FieldLabelInput />
        <FieldSchemeInput />
        <FieldLanguageInput field={field} />
        <FieldOverviewInput />
        <FieldFormatInput />
        <FieldWidthInput />
        <FieldIsSearchableInput />
        <FieldIsFacetInput />
        <div>
            <FieldDisplayInput />
        </div>
        <FieldComposedOf fields={fields} FORM_NAME={FORM_NAME} />
        <FieldAnnotation fields={fields} scope={field.scope} />
    </form>
);

EditOntologyFieldFormComponent.defaultProps = {
    resource: null,
    error: null,
    saving: false,
};

EditOntologyFieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
};

const mapStateToProps = (state, { field }) => ({
    publicationError: fromFields.getError(state),
    fields: fromFields.getFieldsExceptField(state, field),
});

const mapDispatchToProps = {
    onSaveField: configureField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onSubmit: ({ onSaveField }) => values => {
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
