import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

import EditFieldForm, { FORM_NAME } from './EditFieldForm';
import { fromResource, fromPublication } from './selectors';
import { isLoggedIn } from '../user';
import getFieldClassName from '../lib/getFieldClassName';
import ButtonWithDialog from '../lib/ButtonWithDialog';
import {
    openEditFieldValue,
    closeEditFieldValue,
} from './publication';

const mapStateToProps = (state, { field, resource, onSaveProperty, style, p }) => ({
    open: fromPublication.isFieldEdited(state, field.name),
    show: isLoggedIn(state) && fromResource.isLastVersionSelected(state),
    saving: fromResource.isSaving(state),
    form: <EditFieldForm
        field={field}
        onSaveProperty={onSaveProperty}
        resource={resource}
    />,
    formName: FORM_NAME,
    className: classnames('edit-field', getFieldClassName(field)),
    label: p.t('edit_field', { field: field.label }),
    icon: <EditIcon />,
    style,
    buttonStyle: { padding: 0, height: 'auto', width: 'auto' },
});

const mapDispatchToProps = (dispatch, { field: { name } }) => ({
    handleOpen: () => dispatch(openEditFieldValue(name)),
    handleClose: () => dispatch(closeEditFieldValue()),
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ButtonWithDialog);
