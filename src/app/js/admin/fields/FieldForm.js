import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, FieldArray, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import FormTextField from '../../lib/FormTextField';
import FormSelectField from '../../lib/FormSelectField';
import FormAutoCompleteField from '../../lib/FormAutoCompleteField';
import {
    FIELD_FORM_NAME,
    getEditedField,
    saveField,
    getSchemeSearchRequest as selectGetSchemeSearchRequest,
    getSchemeMenuItemsDataFromResponse as selectGetSchemeMenuItemsDataFromResponse,
} from './';

import Alert from '../../lib/Alert';
import TransformerList from './TransformerList';

const validate = (values) => {
    const errors = ['username', 'password'].reduce((currentErrors, field) => {
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

const styles = {
    menuItem: {
        lineHeight: 1,
    },
    schemeLabel: {
        fontSize: '0.9rem',
        margin: 0,
        padding: '0.2rem 0',
    },
    schemeUri: {
        fontSize: '0.7rem',
        color: 'grey',
        margin: 0,
        padding: 0,
    },
    targetOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
};

export const FieldFormComponent = ({
    error,
    field,
    handleSubmit,
    p: polyglot,
    getSchemeSearchRequest,
    getSchemeMenuItemsDataFromResponse,
}) => {
    if (!field) {
        return <span />;
    }

    return (
        <form id="login_form" onSubmit={handleSubmit}>
            {error && <Alert><p>{error}</p></Alert>}
            <Field
                name="name"
                component={FormTextField}
                label={polyglot.t('fieldName')}
                fullWidth
            />
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
            <Field
                name="scheme"
                component={FormAutoCompleteField}
                label={polyglot.t('scheme')}
                fullWidth
                targetOrigin={styles.targetOrigin}
                fetch={getSchemeSearchRequest}
                parseResponse={response => getSchemeMenuItemsDataFromResponse(response).map(({ label, uri }) => ({
                    text: uri,
                    value: (
                        <MenuItem style={styles.menuItem} value={uri}>
                            <div style={styles.schemeLabel}><b>{label}</b></div>
                            <small style={styles.schemeUri}>{uri}</small>
                        </MenuItem>
                    ),
                }))}
            />
            <FieldArray name="transformers" component={TransformerList} />
        </form>
    );
};

FieldFormComponent.defaultProps = {
};

FieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
    getSchemeSearchRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    initialValues: getEditedField(state),
    field: getEditedField(state),
    getSchemeSearchRequest: query => selectGetSchemeSearchRequest(state, query),
    getSchemeMenuItemsDataFromResponse: query => selectGetSchemeMenuItemsDataFromResponse(state, query),
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
