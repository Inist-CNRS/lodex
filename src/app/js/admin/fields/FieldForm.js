import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, FieldArray, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import FormTextField from '../../lib/FormTextField';
import FormSelectField from '../../lib/FormSelectField';
import SchemeAutoComplete from '../../lib/SchemeAutoComplete';
import {
    FIELD_FORM_NAME,
    saveField,
} from './';

import { fromFields } from '../selectors';
import Format from '../FormatEdition';
import Alert from '../../lib/Alert';
import TransformerList from './TransformerList';

const validate = (values) => {
    const errors = ['name', 'label', 'cover'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: 'Required',
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

export const FieldFormComponent = ({
    error,
    field,
    fields,
    isContribution,
    handleSubmit,
    p: polyglot,
}) => {
    if (!field) {
        return <span />;
    }

    const otherFieldsMenuItems = fields.map(f => (
        <MenuItem
            className={`completes_${f.label.toLowerCase().replace(/\s/g, '_')}`}
            key={f.name}
            value={f.name}
            primaryText={f.label}
        />
    ));

    return (
        <form id="field_form" onSubmit={handleSubmit}>
            {error && <Alert><p>{error}</p></Alert>}
            <Field
                name="label"
                component={FormTextField}
                label={polyglot.t('fieldLabel')}
                fullWidth
            />
            <Field
                name="cover"
                component={FormSelectField}
                label={polyglot.t('cover')}
                fullWidth
            >
                <MenuItem value="dataset" primaryText={polyglot.t('cover_dataset')} />
                <MenuItem value="collection" primaryText={polyglot.t('cover_collection')} />
            </Field>
            <SchemeAutoComplete name="scheme" />
            <Field
                className="completes"
                name="completes"
                component={FormSelectField}
                label={polyglot.t('completes_field')}
                fullWidth
            >
                <MenuItem value="" primaryText={polyglot.t('complete_field_none')} />
                {otherFieldsMenuItems}
            </Field>
            { isContribution ? null : <FieldArray name="transformers" component={TransformerList} /> }
            { isContribution ? null : <Field
                name="format"
                component={Format}
                label={polyglot.t('format')}
                fullWidth
            />}
        </form>
    );
};

FieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    initialValues: fromFields.getEditedField(state),
    field: fromFields.getEditedField(state),
    fields: fromFields.getFieldsExceptEdited(state),
});

const mapDispatchToProps = {
    handleSubmit: saveField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: FIELD_FORM_NAME,
        validate,
        enableReinitialize: true,
    }),
    translate,
)(FieldFormComponent);
