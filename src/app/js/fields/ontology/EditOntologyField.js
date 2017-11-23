import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

import getFieldClassName from '../../lib/getFieldClassName';
import EditOntologyFieldForm, { FORM_NAME } from './EditOntologyFieldForm';
import { fromUser, fromFields } from '../../sharedSelectors';
import ButtonWithDialog from '../../lib/components/ButtonWithDialog';
import { configureFieldOpen, configureFieldCancel } from '../';

const mapStateToProps = (state, { field, p }) => ({
    open: fromFields.isFieldConfigured(state, field.name),
    show: fromUser.isLoggedIn(state),
    saving: fromFields.isSaving(state),
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

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    ButtonWithDialog,
);
