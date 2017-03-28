import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import getFieldClassName from '../lib/getFieldClassName';

import EditOntologyFieldForm, { FORM_NAME } from './EditOntologyFieldForm';
import { isLoggedIn } from '../user';
import { fromPublication } from './selectors';
import DialogButton from '../lib/DialogButton';
import {
    configureFieldOpen,
    configureFieldCancel,
} from './publication';

const mapStateToProps = (state, { field, p }) => ({
    open: fromPublication.isFieldConfigured(state, field.name),
    show: isLoggedIn(state),
    saving: fromPublication.isPublicationSaving(state),
    className: classnames('configure-field', getFieldClassName(field)),
    label: p.t('configure_field', { field: field.label }),
    form: <EditOntologyFieldForm field={field} />,
    formName: FORM_NAME,
    icon: <SettingsIcon />,
    style: {
        marginLeft: 'auto',
    },
});

const mapDispatchToProps = (dispatch, { field: { name } }) => ({
    handleOpen: () => dispatch(configureFieldOpen(name)),
    handleClose: () => dispatch(configureFieldCancel()),
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(DialogButton);
