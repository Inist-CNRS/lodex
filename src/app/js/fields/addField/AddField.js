import React from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { fromResource } from '../../public/selectors';
import AddFieldForm from './AddFieldForm';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';
import {
    addFieldToResourceOpen,
    addFieldToResourceCancel,
    NEW_RESOURCE_FIELD_FORM_NAME,
} from '../../public/resource';

const mapStateToProps = (state, { p }) => ({
    open: fromResource.isAdding(state),
    saving: fromResource.isSaving(state),
    formName: NEW_RESOURCE_FIELD_FORM_NAME,
    form: <AddFieldForm />,
    label: p.t('add-field-to-resource'),
    className: 'add-field-resource',
});

const mapDispatchToProps = {
    handleOpen: () => addFieldToResourceOpen(),
    handleClose: () => addFieldToResourceCancel(),
};

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    ButtonWithDialogForm,
);
