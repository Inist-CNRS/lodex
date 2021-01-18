import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import EditIcon from '@material-ui/icons/Edit';
import withHandlers from 'recompose/withHandlers';

import EditFieldForm, { FORM_NAME } from './EditFieldForm';
import { fromResource } from '../../public/selectors';
import {
    fromUser,
    fromFields,
    fromCharacteristic,
} from '../../sharedSelectors';
import getFieldClassName from '../../lib/getFieldClassName';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';
import { openEditFieldValue, closeEditFieldValue } from '../';
import { SCOPE_DATASET } from '../../../../common/scope';
import { saveResource } from '../../public/resource';
import { updateCharacteristics } from '../../characteristic';
import { grey } from '@material-ui/core/colors';

import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        name: {
            float: 'right',
            color: grey[400],
            fontSize: '1rem',
        },
    },
    'field-edit-button',
);

const mapStateToProps = (
    state,
    { field, resource, onSaveProperty, p, warningMessage },
) => ({
    open: fromFields.isFieldEdited(state, field.name),
    show:
        fromUser.isAdmin(state) &&
        (field.scope === SCOPE_DATASET ||
            fromResource.isLastVersionSelected(state)),
    saving:
        field.scope === SCOPE_DATASET
            ? fromCharacteristic.isSaving(state)
            : fromResource.isSaving(state),
    form: (
        <EditFieldForm
            field={field}
            onSaveProperty={onSaveProperty}
            resource={resource}
            warningMessage={warningMessage}
        />
    ),
    formName: FORM_NAME,
    className: classnames('edit-field', getFieldClassName(field)),
    label: (
        <p>
            {p.t('edit_field', { field: field.label })}{' '}
            <span className={styles.name}>#{field.name}</span>
        </p>
    ),
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
            field.scope === SCOPE_DATASET
                ? updateCharacteristics(resource)
                : saveResource({ field, resource }),
        handleClose: ({ closeEditFieldValue }) => closeEditFieldValue,
        handleOpen: ({ openEditFieldValue, field: { name } }) => () =>
            openEditFieldValue(name),
    }),
    connect(mapStateToProps),
)(ButtonWithDialogForm);
