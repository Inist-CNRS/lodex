import React from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { fromFields, fromUser } from '../../sharedSelectors';
import AddCharacteristicForm from './AddCharacteristicForm';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';

import {
    NEW_CHARACTERISTIC_FORM_NAME,
    addCharacteristicOpen,
    addCharacteristicCancel,
} from '../';

const mapStateToProps = (state, { p, displayPage }) => ({
    show: fromUser.isAdmin(state),
    open: fromFields.isAdding(state),
    saving: fromFields.isSaving(state),
    form: <AddCharacteristicForm displayPage={displayPage} />,
    formName: NEW_CHARACTERISTIC_FORM_NAME,
    label: p.t('add_characteristic'),
    className: 'add-characteristic',
});

const mapDispatchToProps = {
    handleOpen: () => addCharacteristicOpen(),
    handleClose: () => addCharacteristicCancel(),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ButtonWithDialogForm);
