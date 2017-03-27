import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { fromResource } from '../selectors';
import { HIDE_RESOURCE_FORM_NAME } from './';
import HideResourceForm from './HideResourceForm';
import { isLoggedIn } from '../../user';
import DialogButton from '../../lib/DialogButton';

const mapStateToProps = (state, { p }) => ({
    saving: fromResource.isSaving(state),
    show: isLoggedIn(state),
    formName: HIDE_RESOURCE_FORM_NAME,
    form: <HideResourceForm />,
    label: p.t('hide'),
    className: 'hide-resource',
});

export default compose(
    translate,
    connect(mapStateToProps),
)(DialogButton);
