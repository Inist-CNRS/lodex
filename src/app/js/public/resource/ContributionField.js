import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import FieldSchemeInput from '../../lib/components/FieldSchemeInput';
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
    p: polyglot,
}) => (

    <div>
        <Field
            className="field-label"
            name="field.label"
            validate={[
                required,
                uniqueField([...documentFields, ...collectionFields], isNewField),
            ]}
            disabled={!isNewField}
            component={FormTextField}
            label={polyglot.t('fieldLabel')}
            fullWidth
        />
        <Field
            className="field-value"
            name="field.value"
            validate={required}
            component={FormTextField}
            label={polyglot.t('fieldValue')}
            fullWidth
        />
        <FieldSchemeInput
            disabled={!isNewField}
            name="field.scheme"
            className="field-scheme"
        />
    </div>
);

AddFieldDetailComponent.propTypes = {
    collectionFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    documentFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    isNewField: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
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
