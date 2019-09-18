import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { ModeEdit as EditIcon } from '@material-ui/icons';
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
import { COVER_DATASET } from '../../../../common/cover';
import { saveResource } from '../../public/resource';
import { updateCharacteristics } from '../../characteristic';
import { grey400 } from 'material-ui/styles/colors';

const styles = {
    label: {
        float: 'right',
        color: grey400,
        fontSize: '1.5rem',
    },
};

const mapStateToProps = (state, { field, resource, onSaveProperty, p }) => ({
    open: fromFields.isFieldEdited(state, field.name),
    show:
        fromUser.isAdmin(state) &&
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
    label: (
        <p>
            {p.t('edit_field', { field: field.label })}{' '}
            <span style={styles.label}>#{field.name}</span>
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
    connect(
        null,
        mapDispatchToProps,
    ),
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
