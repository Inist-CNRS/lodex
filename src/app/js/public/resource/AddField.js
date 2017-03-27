import React from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { fromResource } from '../selectors';
import AddFieldForm from './AddFieldForm';
import DialogButton from '../../lib/DialogButton';
import {
    NEW_RESOURCE_FIELD_FORM_NAME,
} from './';

const mapStateToProps = (state, { p }) => ({
    saving: fromResource.isSaving(state),
    formName: NEW_RESOURCE_FIELD_FORM_NAME,
    form: <AddFieldForm />,
    label: p.t('add-field-to-resource'),
    className: 'add-field-resource',
});

export default compose(
    translate,
    connect(mapStateToProps),
)(DialogButton);
