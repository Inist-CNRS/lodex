import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import { CardText, CardHeader, CardActions } from 'material-ui/Card';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

import {
    addFieldToResource,
    NEW_RESOURCE_FIELD_FORM_NAME,
    getNewResourceFieldFormData,
} from './';
import {
    getFieldToAdd,
} from '../publication';
import Card from '../../lib/Card';
import Alert from '../../lib/Alert';
import ButtonWithStatus from '../../lib/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import SelectFieldToAdd from './SelectFieldToAdd';
import { isLoggedIn as getIsLoggedIn } from '../../user';
import DetailProperties from './DetailProperties';
import Contributor from './Contributor';
import ContributionField from './ContributionField';
import { fromResource } from '../../selectors';

export const AddFieldDetailComponent = ({
    resource,
    saving,
    error,
    fieldToAdd,
    isLoggedIn,
    handleSubmit,
    p: polyglot,
}) => (
    <Card className="hide-detail">
        <DetailProperties />
        <CardHeader title={polyglot.t('add_field_to_resource')} />
        <CardText>
            <form id="add_field_resource_form" onSubmit={() => handleSubmit(resource.uri)}>
                {error && <Alert><p>{error}</p></Alert>}
                {
                    isLoggedIn ? null :
                    <Contributor />
                }
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
        </CardText>
        <CardActions>
            <ButtonWithStatus
                className="add-field-to-resource"
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
    saving: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resource: fromResource.getResourceLastVersion(state),
    saving: fromResource.isSaving(state),
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
