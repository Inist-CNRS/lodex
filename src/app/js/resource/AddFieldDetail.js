import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import { CardText, CardHeader, CardActions } from 'material-ui/Card';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import SchemeAutoComplete from '../lib/SchemeAutoComplete';
import MenuItem from 'material-ui/MenuItem';

import {
    getResourceLastVersion,
    addFieldToResource,
    isSaving,
    NEW_RESOURCE_FIELD_FORM_NAME,
    getNewResourceFieldFormData,
} from './';
import {
    getCollectionFields,
    getDocumentFields,
    getFieldToAdd,
} from '../publication';
import Card from '../lib/Card';
import FormTextField from '../lib/FormTextField';
import Alert from '../lib/Alert';
import ButtonWithStatus from '../lib/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import Property from '../lib/Property';
import SelectFieldToAdd from './SelectFieldToAdd';
import { isLoggedIn as getIsLoggedIn } from '../user';
import FormSelectField from '../lib/FormSelectField';

const required = value => (value ? undefined : 'Required');
const validMail = value =>
    (value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? undefined : 'Invalid mail');
const uniqueField = fields => value =>
    (fields.find(({ name }) => name === value) ? 'Field already exists' : undefined);

export const AddFieldDetailComponent = ({
    resource,
    collectionFields,
    documentFields,
    saving,
    error,
    fieldToAdd,
    isLoggedIn,
    handleSubmit,
    p: polyglot,
}) => (
    <Card className="hide-detail">
        <CardText>
            {collectionFields.map(({ name, scheme }) => (
                <Property name={name} scheme={scheme} value={resource[name]} />
            ))}
            {documentFields.map(({ name, scheme }) => (
                <Property name={name} scheme={scheme} value={resource[name]} />
            ))}
        </CardText>
        <CardHeader title={polyglot.t('add_field_to_resource')} />
        <CardText>
            <form id="add_field_resource_form" onSubmit={() => handleSubmit(resource.uri)}>
                {error && <Alert><p>{error}</p></Alert>}
                {
                    isLoggedIn ? null :
                    <div>
                        {polyglot.t('about_you')}
                        <CardText>
                            <Field
                                validate={required}
                                name="contributor.name"
                                component={FormTextField}
                                label={polyglot.t('contributorName')}
                                fullWidth
                            />
                            <Field
                                validate={[required, validMail]}
                                name="contributor.mail"
                                component={FormTextField}
                                label={polyglot.t('contributorMail')}
                                fullWidth
                            />
                        </CardText>
                    </div>
                }
                <div>
                    {polyglot.t('new_field')}
                    <CardText>
                        <SelectFieldToAdd />
                        {
                            fieldToAdd ?
                                <div>
                                    <Field
                                        name="field.name"
                                        validate={[
                                            required,
                                            uniqueField([...documentFields, ...collectionFields]),
                                        ]}
                                        disabled={fieldToAdd.name}
                                        component={FormTextField}
                                        label={polyglot.t('fieldName')}
                                        fullWidth
                                    />
                                    <Field
                                        name="field.label"
                                        validate={required}
                                        disabled={fieldToAdd.name}
                                        component={FormTextField}
                                        label={polyglot.t('fieldLabel')}
                                        fullWidth
                                    />
                                    <Field
                                        name="field.value"
                                        validate={required}
                                        component={FormTextField}
                                        label={polyglot.t('fieldValue')}
                                        fullWidth
                                    />
                                    <Field
                                        name="field.cover"
                                        component={FormSelectField}
                                        label={polyglot.t('cover')}
                                        fullWidth
                                        disabled
                                    >
                                        <MenuItem value="document" primaryText={polyglot.t('cover_document')} />
                                    </Field>
                                    <SchemeAutoComplete disabled={fieldToAdd.name} name="field.scheme" />
                                </div>
                            : null
                        }
                    </CardText>
                </div>
            </form>
        </CardText>
        <CardActions>
            <ButtonWithStatus
                className="hide-resource"
                label={polyglot.t('add_field')}
                primary
                loading={saving}
                onTouchTap={() => handleSubmit(resource.uri)}
            />
            <Link to={{ pathname: '/resource', query: { uri: resource.uri } }}>
                <FlatButton label={'Cancel'} secondary />
            </Link>
        </CardActions>
    </Card>
);

AddFieldDetailComponent.defaultProps = {
    resource: null,
    error: null,
    saving: false,
};

AddFieldDetailComponent.propTypes = {
    ...reduxFormPropTypes,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    saving: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resource: getResourceLastVersion(state),
    collectionFields: getCollectionFields(state),
    documentFields: getDocumentFields(state),
    saving: isSaving(state),
    fieldToAdd: getFieldToAdd(state),
    initialValues: {
        ...getNewResourceFieldFormData(state),
        field: getFieldToAdd(state),
    },
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = {
    handleSubmit: addFieldToResource,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: NEW_RESOURCE_FIELD_FORM_NAME,
        enableReinitialize: true,
    }),
    translate,
)(AddFieldDetailComponent);
