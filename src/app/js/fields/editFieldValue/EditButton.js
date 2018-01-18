import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import withHandlers from 'recompose/withHandlers';

import EditFieldForm, { FORM_NAME } from './EditFieldForm';
import { fromResource, fromCharacteristic } from '../../public/selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import getFieldClassName from '../../lib/getFieldClassName';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';
import { openEditFieldValue, closeEditFieldValue } from '../';
import { COVER_DATASET } from '../../../../common/cover';
import { saveResource } from '../../public/resource';
import { updateCharacteristics } from '../../public/characteristic';

const mapStateToProps = (state, { field, resource, onSaveProperty, p }) => ({
    open: fromFields.isFieldEdited(state, field.name),
    show:
        fromUser.isLoggedIn(state) &&
        (field.cover === COVER_DATASET ||
            fromResource.isLastVersionSelected(state)),
    saving:
        field.cover === COVER_DATASET
            ? fromCharacteristic.isSaving(state)
            : fromResource.isSaving(state),
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

const mapDispatchToProps = {
    openEditFieldValue,
    closeEditFieldValue,
    updateCharacteristics,
    saveResource,
};

export default compose(
    translate,
    connect(null, mapDispatchToProps),
    withHandlers({
        onSaveProperty: ({
            updateCharacteristics,
            saveResource,
            field,
        }) => resource =>
            field.cover === COVER_DATASET
                ? updateCharacteristics(resource)
                : saveResource({ field, resource }),
        handleClose: ({ closeEditFieldValue }) => closeEditFieldValue,
        handleOpen: ({ openEditFieldValue, field: { name } }) => () =>
            openEditFieldValue(name),
    }),
    connect(mapStateToProps),
)(ButtonWithDialogForm);
