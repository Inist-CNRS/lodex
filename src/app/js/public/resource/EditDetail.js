import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import { CardText, CardActions } from 'material-ui/Card';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

import {
    saveResource,
    RESOURCE_FORM_NAME,
} from './';
import Card from '../../lib/Card';
import Alert from '../../lib/Alert';
import ButtonWithStatus from '../../lib/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource, fromPublication } from '../selectors';
import EditDetailsField from './EditDetailsField';

const validate = (values) => {
    const errors = Object.keys(values).reduce((currentErrors, field) => {
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

export const EditDetailComponent = ({ resource, fields, saving, error, handleSubmit, p: polyglot }) => (
    <Card className="edit-detail">
        <CardText>
            <form id="resource_form" onSubmit={handleSubmit}>
                {error && <Alert><p>{error}</p></Alert>}
                {fields.map(field => (
                    <EditDetailsField key={field.name} field={field} />
                ))}
            </form>
        </CardText>
        <CardActions>
            <ButtonWithStatus
                className="save-resource"
                label={polyglot.t('save')}
                primary
                loading={saving}
                onTouchTap={handleSubmit}
            />
            <Link to={{ pathname: '/resource/hide', query: { uri: resource.uri } }}>
                <FlatButton label={polyglot.t('hide')} secondary />
            </Link>
            <Link to={{ pathname: '/resource', query: { uri: resource.uri } }}>
                <FlatButton label={polyglot.t('cancel')} secondary />
            </Link>
        </CardActions>
    </Card>
);

EditDetailComponent.defaultProps = {
    resource: null,
    error: null,
    saving: false,
};

EditDetailComponent.propTypes = {
    ...reduxFormPropTypes,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    saving: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    initialValues: fromResource.getResourceLastVersion(state),
    resource: fromResource.getResourceLastVersion(state),
    fields: fromPublication.getCollectionFieldsExceptComposed(state),
    saving: fromResource.isSaving(state),
});

const mapDispatchToProps = {
    handleSubmit: saveResource,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: RESOURCE_FORM_NAME,
        validate,
    }),
    translate,
)(EditDetailComponent);
