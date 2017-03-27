import React from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { fromCharacteristic } from '../selectors';
import AddCharacteristicForm from './AddCharacteristicForm';
import {
    NEW_CHARACTERISTIC_FORM_NAME,
} from './';
import DialogButton from '../../lib/DialogButton';

const mapStateToProps = (state, { p }) => ({
    saving: fromCharacteristic.isSaving(state),
    form: <AddCharacteristicForm />,
    formName: NEW_CHARACTERISTIC_FORM_NAME,
    label: p.t('add_characteristic'),
    className: 'add-characteristic',
});

export default compose(
    translate,
    connect(mapStateToProps),
)(DialogButton);
