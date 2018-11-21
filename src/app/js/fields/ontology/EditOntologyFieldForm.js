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
import FieldDisplayInListInput from '../FieldDisplayInListInput';
import FieldDisplayInResourceInput from '../FieldDisplayInResourceInput';
import FieldDisplayInGraphInput from '../FieldDisplayInGraphInput';
import FieldDisplayInHomeInput from '../FieldDisplayInHomeInput';
import FieldIsSearchableInput from '../FieldIsSearchableInput';
import FieldIsFacetInput from '../FieldIsFacetInput';
import FieldComposedOf from '../FieldComposedOf';
import FieldAnnotation from '../FieldAnnotation';
import InvalidFieldProperties from '../InvalidFieldProperties';

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
        <FieldDisplayInListInput />
        <FieldDisplayInResourceInput />
        {field.cover === 'dataset' && <FieldDisplayInGraphInput />}
        {field.cover === 'dataset' && <FieldDisplayInHomeInput />}
        <FieldOverviewInput />
        <FieldFormatInput />
        <FieldWidthInput />
        <FieldIsSearchableInput />
        <FieldIsFacetInput />
        <FieldComposedOf fields={fields} FORM_NAME={FORM_NAME} />
        <FieldAnnotation fields={fields} />
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
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
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
