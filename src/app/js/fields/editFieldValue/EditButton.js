import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

import EditFieldForm, { FORM_NAME } from './EditFieldForm';
import { fromResource } from '../../public/selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import getFieldClassName from '../../lib/getFieldClassName';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';
import { openEditFieldValue, closeEditFieldValue } from '../';

const mapStateToProps = (state, { field, resource, onSaveProperty, p }) => ({
    open: fromFields.isFieldEdited(state, field.name),
    show:
        fromUser.isLoggedIn(state) && fromResource.isLastVersionSelected(state),
    saving: fromResource.isSaving(state),
    form: (
        <EditFieldForm
            field={field}
            onSaveProperty={onSaveProperty}
            resource={resource}
        />
    ),
    formName: FORM_NAME,
    className: classnames('edit-field', getFieldClassName(field)),
    label: p.t('edit_field', { field: field.label }),
    icon: <EditIcon viewBox="-10 0 32 32" />,
    buttonStyle: { padding: 0, height: 'auto', width: 'auto' },
});

const mapDispatchToProps = (dispatch, { field: { name } }) => ({
    handleOpen: () => dispatch(openEditFieldValue(name)),
    handleClose: () => dispatch(closeEditFieldValue()),
});

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    ButtonWithDialogForm,
);
