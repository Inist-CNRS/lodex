import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import {
    addFieldToResource as addFieldToResourceAction,
    NEW_RESOURCE_FIELD_FORM_NAME,
    getNewResourceFieldFormData,
} from './';
import Alert from '../../lib/components/Alert';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import SelectFieldToAdd from './SelectFieldToAdd';
import { fromUser, fromFields } from '../../sharedSelectors';
import Contributor from './Contributor';
import ContributionField from './ContributionField';
import { fromResource } from '../selectors';

export const AddFieldFormComponent = ({
    resourceError,
    fieldToAdd,
    isLoggedIn,
    onSubmit,
}) => (
    <form id="add_field_resource_form" className="hide-detail" onSubmit={onSubmit}>
        {resourceError && <Alert><p>{resourceError}</p></Alert>}
        {isLoggedIn ? null : <Contributor />}
        <SelectFieldToAdd />
        {
            fieldToAdd ?
                <ContributionField isNewField={!fieldToAdd.name} isLoggedIn={isLoggedIn} />
            : null
        }
    </form>
);

AddFieldFormComponent.defaultProps = {
    resourceError: null,
    saving: false,
};

AddFieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    saving: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resourceError: fromResource.getError(state),
    resource: fromResource.getResourceLastVersion(state),
    saving: fromResource.isSaving(state),
    fieldToAdd: fromFields.getFieldToAdd(state),
    initialValues: {
        ...getNewResourceFieldFormData(state),
        field: fromFields.getFieldToAdd(state),
    },
    isLoggedIn: fromUser.isLoggedIn(state),
});

const mapDispatchToProps = {
    addFieldToResource: addFieldToResourceAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onSubmit: ({ addFieldToResource, resource }) => () => {
            addFieldToResource(resource.uri);
        },
    }),
    reduxForm({
        form: NEW_RESOURCE_FIELD_FORM_NAME,
        enableReinitialize: true,
    }),
    translate,
)(AddFieldFormComponent);
