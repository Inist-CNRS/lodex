import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import { CardText } from 'material-ui/Card';

import {
    addFieldToResource as addFieldToResourceAction,
    NEW_RESOURCE_FIELD_FORM_NAME,
    getNewResourceFieldFormData,
} from './';
import Alert from '../../lib/Alert';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import SelectFieldToAdd from './SelectFieldToAdd';
import { isLoggedIn as getIsLoggedIn } from '../../user';
import Contributor from './Contributor';
import ContributionField from './ContributionField';
import {
    fromResource,
    fromPublication,
} from '../selectors';

export const AddFieldFormComponent = ({
    resourceError,
    fieldToAdd,
    isLoggedIn,
    onSubmit,
    p: polyglot,
}) => (
    <form id="add_field_resource_form" className="hide-detail" onSubmit={onSubmit}>
        {resourceError && <Alert><p>{resourceError}</p></Alert>}
        {isLoggedIn ? null : <Contributor />}
        <div>
            {polyglot.t('new_field')}
            <CardText>
                <SelectFieldToAdd />
                {
                    fieldToAdd ?
                        <ContributionField isNewField={!fieldToAdd.name} />
                    : null
                }
            </CardText>
        </div>
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
    fieldToAdd: fromPublication.getFieldToAdd(state),
    initialValues: {
        ...getNewResourceFieldFormData(state),
        field: fromPublication.getFieldToAdd(state),
    },
    isLoggedIn: getIsLoggedIn(state),
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
