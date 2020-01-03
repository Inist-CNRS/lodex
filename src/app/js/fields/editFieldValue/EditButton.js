import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { grey400 } from 'material-ui/styles/colors';

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

import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        name: {
            float: 'right',
            color: grey400,
            fontSize: '1rem',
        },
    },
    'field-edit-button',
);

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
            <span className={styles.name}>#{field.name}</span>
        </p>
    ),
    icon: <FontAwesomeIcon icon={faPen} />,
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
