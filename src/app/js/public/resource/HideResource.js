import React from 'react';
import { connect } from 'react-redux';

import { fromResource } from '../selectors';
import { HIDE_RESOURCE_FORM_NAME } from './';
import HideResourceForm from './HideResourceForm';
import { isLoggedIn } from '../../user';
import DialogButton from '../../lib/DialogButton';

const mapStateToProps = state => ({
    saving: fromResource.isSaving(state),
    show: isLoggedIn(state),
    formName: HIDE_RESOURCE_FORM_NAME,
    form: <HideResourceForm />,
    label: 'hide',
    className: 'hide-resource',
});

export default connect(mapStateToProps)(DialogButton);
