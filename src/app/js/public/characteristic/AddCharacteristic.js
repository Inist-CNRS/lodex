import React from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { fromCharacteristic } from '../selectors';
import AddCharacteristicForm from './AddCharacteristicForm';
import {
    NEW_CHARACTERISTIC_FORM_NAME,
    addCharacteristicOpen,
    addCharacteristicCancel,
} from './';
import ButtonWithDialog from '../../lib/components/ButtonWithDialog';
import { isLoggedIn } from '../../user';

const mapStateToProps = (state, { p }) => ({
    show: isLoggedIn(state),
    open: fromCharacteristic.isAdding(state),
    saving: fromCharacteristic.isSaving(state),
    form: <AddCharacteristicForm />,
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
)(ButtonWithDialog);
